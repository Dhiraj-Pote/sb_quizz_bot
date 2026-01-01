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

  const questionText = `📝 <b>${escapeHtml(quiz.title)}</b>\n` +
    `Question ${questionIndex + 1}/${questions.length}\n\n` +
    `${escapeHtml(question.question)}\n\n` +
    `⏱️ Time: ${QUESTION_TIME_LIMIT} seconds`;

  const keyboard = {
    inline_keyboard: question.options.map((option, index) => [
      { text: option, callback_data: `answer_${quizId}_${questionIndex}_${index}` }
    ])
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
      `Question ${questionIndex + 1}/${questions.length}\n\n` +
      `${escapeHtml(question.question)}\n\n` +
      `⏱️ Time: ${remaining} seconds`;

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
  const loadingFrames = ['Checking .', 'Checking ..', 'Checking ...'];
  
  for (let i = 0; i < loadingFrames.length; i++) {
    try {
      await bot.editMessageText(loadingFrames[i], {
        chat_id: chatId,
        message_id: messageId
      });
      await sleep(250);
    } catch (e) {}
  }

  if (isCorrect) {
    const feedbackText = `<b>✅ Correct!</b>\n\n` +
      `${escapeHtml(question.question)}\n\n` +
      `Answer: ${escapeHtml(question.options[question.correct])}`;
    
    try {
      await bot.editMessageText(feedbackText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML'
      });
    } catch (e) {}

    updateQuizState(userId, state.current_question + 1, state.score + 1, Date.now(), userAnswers);
  } else {
    const feedbackText = `<b>❌ Wrong!</b>\n\n` +
      `${escapeHtml(question.question)}\n\n` +
      `Your answer: ${escapeHtml(question.options[answerIndex])}\n` +
      `Correct answer: ${escapeHtml(question.options[question.correct])}`;
    
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
  }, 1500);
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

  // Loading animation
  const loadingMsg = await bot.sendMessage(chatId, '◐ Calculating results...');
  const circleFrames = ['◐', '◓', '◑', '◒'];
  
  for (let i = 0; i < 8; i++) {
    try {
      await bot.editMessageText(`${circleFrames[i % 4]} Calculating results...`, {
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

  const percentage = (state.score / totalQuestions) * 100;
  if (percentage >= 80) {
    resultEmoji = '🏆';
    resultMessage = 'Excellent work!';
  } else if (percentage >= 60) {
    resultEmoji = '👏';
    resultMessage = 'Good job!';
  } else {
    resultEmoji = '💪';
    resultMessage = 'Keep practicing!';
  }

  const shareLink = getShareableLink(quizId);

  const resultText = `${resultEmoji} <b>Quiz Complete!</b>\n\n` +
    `${resultMessage}\n\n` +
    `📊 <b>Your Results:</b>\n` +
    `Quiz: ${escapeHtml(quiz.title)}\n` +
    `Score: ${state.score}/${totalQuestions}\n` +
    `Time: ${totalTime} seconds\n\n` +
    `🔗 Share this quiz: ${shareLink}`;

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
