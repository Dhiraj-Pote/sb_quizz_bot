// Quiz game logic
const { QUESTION_TIME_LIMIT } = require('./config');
const { getQuiz } = require('./quizData');
const { getQuizState, updateQuizState, deleteQuizState, markUserAttempted, saveResult } = require('./database');
const { getShareableLink, sleep, escapeHtml } = require('./utils');

const userTimers = {};

function clearTimer(userId) {
  if (userTimers[userId]) {
    if (userTimers[userId].timeout) clearTimeout(userTimers[userId].timeout);
    if (userTimers[userId].interval) clearInterval(userTimers[userId].interval);
    delete userTimers[userId];
  }
}

async function sendQuestion(bot, chatId, userId, quizId, questionIndex) {
  const quiz = getQuiz(quizId);
  const questions = quiz.questions;

  if (questionIndex >= questions.length) {
    await finishQuiz(bot, chatId, userId, quizId);
    return;
  }

  const question = questions[questionIndex];

  // Format question with better layout
  const questionText = `📝 <b>${escapeHtml(quiz.title)}</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `<b>Question ${questionIndex + 1}/${questions.length}</b>\n\n` +
    `${escapeHtml(question.question)}\n\n` +
    `⏱ Time remaining: <b>${QUESTION_TIME_LIMIT}s</b>`;

  // Create keyboard with better formatting - one button per row for long text
  const keyboard = {
    inline_keyboard: question.options.map((option, index) => {
      // Use simple circle bullet for options
      return [{ 
        text: `⚪ ${option}`, 
        callback_data: `answer_${quizId}_${questionIndex}_${index}` 
      }];
    })
  };

  const sentMessage = await bot.sendMessage(chatId, questionText, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });

  const questionStartTime = Date.now();

  // Timer countdown display
  const timerInterval = setInterval(async () => {
    const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
    const remaining = Math.max(0, QUESTION_TIME_LIMIT - elapsed);

    if (remaining <= 0) {
      clearInterval(timerInterval);
      return;
    }

    const updatedText = `📝 <b>${escapeHtml(quiz.title)}</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `<b>Question ${questionIndex + 1}/${questions.length}</b>\n\n` +
      `${escapeHtml(question.question)}\n\n` +
      `⏱ Time remaining: <b>${remaining}s</b>`;

    try {
      await bot.editMessageText(updatedText, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    } catch (error) {
      clearInterval(timerInterval);
    }
  }, 5000);

  userTimers[userId] = {
    timeout: setTimeout(async () => {
      clearInterval(timerInterval);
      await handleTimeout(bot, chatId, userId, sentMessage.message_id, quizId, questionIndex);
    }, QUESTION_TIME_LIMIT * 1000),
    interval: timerInterval
  };
}

async function handleAnswer(bot, chatId, userId, messageId, quizId, questionIndex, answerIndex) {
  const quiz = getQuiz(quizId);
  
  if (!quiz) {
    bot.sendMessage(chatId, '⚠️ Quiz not found.');
    return;
  }
  
  const question = quiz.questions[questionIndex];
  const state = getQuizState(userId);
  
  if (!state) {
    bot.sendMessage(chatId, '⚠️ Quiz session expired. Please start again.');
    return;
  }

  // Check if answer was already recorded (race condition protection)
  const userAnswers = JSON.parse(state.user_answers);
  if (userAnswers.length > questionIndex) {
    return;
  }

  const isCorrect = answerIndex === question.correct;
  clearTimer(userId);

  userAnswers.push(answerIndex);

  // Loading animation
  const loadingFrames = ['⏳ Checking', '⏳ Checking.', '⏳ Checking..', '⏳ Checking...'];
  
  for (let i = 0; i < loadingFrames.length; i++) {
    try {
      await bot.editMessageText(loadingFrames[i], {
        chat_id: chatId,
        message_id: messageId
      });
      await sleep(200);
    } catch (e) {}
  }

  if (isCorrect) {
    // Celebration animation for correct answer
    const celebrationFrames = [
      '🎉',
      '🎉✨',
      '🎉✨🎊',
      '🎉✨🎊✨',
      '🎉✨🎊✨🎉',
      '✨🎊✨🎉✨',
      '🎊✨🎉✨',
      '✨🎉✨',
      '🎉✨',
      '✨'
    ];
    
    for (let i = 0; i < celebrationFrames.length; i++) {
      try {
        await bot.editMessageText(`${celebrationFrames[i]} Correct! ${celebrationFrames[i]}`, {
          chat_id: chatId,
          message_id: messageId
        });
        await sleep(150);
      } catch (e) {}
    }

    const feedbackText = `✅ <b>Correct Answer!</b> 🎉\n\n` +
      `<b>Question:</b>\n${escapeHtml(question.question)}\n\n` +
      `⚪ <b>${escapeHtml(question.options[question.correct])}</b>\n\n` +
      `Great job! 👏`;
    
    try {
      await bot.editMessageText(feedbackText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML'
      });
    } catch (e) {}

    updateQuizState(userId, state.current_question + 1, state.score + 1, Date.now(), userAnswers);
  } else {
    const feedbackText = `❌ <b>Wrong Answer</b>\n\n` +
      `<b>Question:</b>\n${escapeHtml(question.question)}\n\n` +
      `⚪ <b>Your answer:</b>\n${escapeHtml(question.options[answerIndex])}\n\n` +
      `✅ <b>Correct answer:</b>\n${escapeHtml(question.options[question.correct])}\n\n` +
      `Keep trying! 💪`;
    
    try {
      await bot.editMessageText(feedbackText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML'
      });
    } catch (e) {}

    updateQuizState(userId, state.current_question + 1, state.score, Date.now(), userAnswers);
  }

  setTimeout(async () => {
    await sendQuestion(bot, chatId, userId, quizId, questionIndex + 1);
  }, 2000);
}

async function handleTimeout(bot, chatId, userId, messageId, quizId, questionIndex) {
  const quiz = getQuiz(quizId);
  const question = quiz.questions[questionIndex];
  const state = getQuizState(userId);

  if (!state) return;

  const userAnswers = JSON.parse(state.user_answers);
  if (userAnswers.length > questionIndex) {
    return;
  }

  userAnswers.push(null);

  const timeoutText = `<b>⏰ Time's Up!</b>\n\n` +
    `${escapeHtml(question.question)}\n\n` +
    `Correct answer: ${escapeHtml(question.options[question.correct])}`;

  try {
    await bot.editMessageText(timeoutText, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'HTML'
    });
  } catch (e) {}

  updateQuizState(userId, state.current_question + 1, state.score, Date.now(), userAnswers);

  setTimeout(async () => {
    await sendQuestion(bot, chatId, userId, quizId, questionIndex + 1);
  }, 1500);
}

async function finishQuiz(bot, chatId, userId, quizId) {
  const state = getQuizState(userId);
  const quiz = getQuiz(quizId);
  
  if (!state || !quiz) {
    bot.sendMessage(chatId, '⚠️ Quiz session not found.');
    return;
  }

  const totalTime = Math.floor((Date.now() - state.start_time) / 1000);
  const userAnswers = JSON.parse(state.user_answers);

  // Loading animation with celebration
  const loadingMsg = await bot.sendMessage(chatId, '🎯 Calculating results...');
  const circleFrames = ['◐', '◓', '◑', '◒', '◐', '◓', '◑', '◒'];
  
  for (let i = 0; i < circleFrames.length; i++) {
    try {
      await bot.editMessageText(`${circleFrames[i]} Calculating your score...`, {
        chat_id: chatId,
        message_id: loadingMsg.message_id
      });
      await sleep(200);
    } catch (e) {}
  }
  
  try {
    await bot.deleteMessage(chatId, loadingMsg.message_id);
  } catch (e) {}

  const user = await bot.getChat(userId).catch(() => ({ username: 'Unknown', first_name: 'User' }));

  markUserAttempted(userId, quizId, user.username || 'Unknown', user.first_name || 'User');
  saveResult(userId, quizId, user.username || 'Unknown', user.first_name || 'User', state.score, totalTime, userAnswers);
  deleteQuizState(userId);
  clearTimer(userId);

  const totalQuestions = quiz.questions.length;
  let resultEmoji = '🎉';
  let resultMessage = 'Outstanding!';
  let celebrationEmoji = '🎊✨🎉';

  const percentage = (state.score / totalQuestions) * 100;
  if (percentage >= 80) {
    resultEmoji = '🏆';
    resultMessage = 'Excellent work!';
    celebrationEmoji = '🏆✨🎉✨🏆';
  } else if (percentage >= 60) {
    resultEmoji = '👏';
    resultMessage = 'Good job!';
    celebrationEmoji = '👏✨🎊';
  } else {
    resultEmoji = '💪';
    resultMessage = 'Keep practicing!';
    celebrationEmoji = '💪📚';
  }

  const shareLink = getShareableLink(quizId);

  const resultText = `${celebrationEmoji}\n\n` +
    `${resultEmoji} <b>Quiz Complete!</b> ${resultEmoji}\n\n` +
    `${resultMessage}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📊 <b>Your Results:</b>\n\n` +
    `📝 Quiz: ${escapeHtml(quiz.title)}\n` +
    `✅ Score: <b>${state.score}/${totalQuestions}</b> (${Math.round(percentage)}%)\n` +
    `⏱ Time: ${totalTime} seconds\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🔗 Share this quiz:\n${shareLink}`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '📝 Review Your Answers', callback_data: `review_${quizId}` }],
      [{ text: '🏆 View Leaderboard', callback_data: `lb_${quizId}` }],
      [{ text: '📚 More Quizzes', callback_data: 'browse_quizzes' }]
    ]
  };

  bot.sendMessage(chatId, resultText, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

module.exports = {
  sendQuestion,
  handleAnswer,
  handleTimeout,
  finishQuiz,
  clearTimer
};
