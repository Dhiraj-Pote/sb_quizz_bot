// Quiz game logic
const { QUESTION_TIME_LIMIT } = require('./config');
const { getQuiz } = require('./quizData');
const { getQuizState, updateQuizState, deleteQuizState, markUserAttempted, saveResult } = require('./database');
const { getShareableLink, sleep } = require('./utils');

// Use Map for better performance with large datasets
const userTimers = new Map();
const userPolls = new Map();

function clearTimer(userId) {
  const timer = userTimers.get(userId);
  if (timer?.timeout) {
    clearTimeout(timer.timeout);
  }
  userTimers.delete(userId);
}

async function sendQuestion(bot, chatId, userId, quizId, questionIndex) {
  const quiz = getQuiz(quizId);
  
  if (!quiz) {
    bot.sendMessage(chatId, '⚠️ Quiz data not found. Please try again.');
    return;
  }
  
  const questions = quiz.questions;

  if (!questions || questions.length === 0) {
    bot.sendMessage(chatId, '⚠️ No questions found in this quiz.');
    return;
  }

  if (questionIndex >= questions.length) {
    await finishQuiz(bot, chatId, userId, quizId);
    return;
  }

  const question = questions[questionIndex];

  // Send as native Telegram Quiz Poll with formatted question
  const formattedQuestion = `📝 Question ${questionIndex + 1}/${questions.length}\n\n${question.question}`;
  
  const pollMessage = await bot.sendPoll(chatId, 
    formattedQuestion,
    question.options,
    {
      type: 'quiz',
      correct_option_id: question.correct,
      is_anonymous: false,
      open_period: QUESTION_TIME_LIMIT
    }
  );

  // Store poll info for tracking
  userPolls.set(pollMessage.poll.id, {
    userId: userId,
    chatId,
    quizId,
    questionIndex,
    correctAnswer: question.correct
  });

  // Set timeout for auto-advance
  const timeout = setTimeout(async () => {
    const state = getQuizState(userId);
    if (state) {
      const userAnswers = JSON.parse(state.user_answers);
      if (userAnswers.length <= questionIndex) {
        userAnswers.push(null);
        updateQuizState(userId, questionIndex + 1, state.score, Date.now(), userAnswers);
        userPolls.delete(pollMessage.poll.id);
        await sendQuestion(bot, chatId, userId, quizId, questionIndex + 1);
      }
    }
  }, (QUESTION_TIME_LIMIT + 2) * 1000);

  userTimers.set(userId, { timeout });
}

async function handlePollAnswer(bot, pollAnswer) {
  const pollId = pollAnswer.poll_id;
  const optionId = pollAnswer.option_ids[0];
  
  const pollInfo = userPolls.get(pollId);
  if (!pollInfo) return;
  
  const { chatId, quizId, questionIndex, correctAnswer, userId } = pollInfo;
  
  const state = getQuizState(userId);
  if (!state) return;

  const userAnswers = JSON.parse(state.user_answers);
  if (userAnswers.length > questionIndex) return;

  clearTimer(userId);
  
  const isCorrect = optionId === correctAnswer;
  userAnswers.push(optionId);
  
  updateQuizState(
    userId, 
    questionIndex + 1, 
    isCorrect ? state.score + 1 : state.score, 
    Date.now(), 
    userAnswers
  );

  userPolls.delete(pollId);

  await sleep(1500);
  await sendQuestion(bot, chatId, userId, quizId, questionIndex + 1);
}

async function finishQuiz(bot, chatId, userId, quizId) {
  const state = getQuizState(userId);
  const quiz = getQuiz(quizId);
  
  if (!state || !quiz) {
    bot.sendMessage(chatId, 'Quiz session not found.');
    return;
  }

  const totalTime = Math.floor((Date.now() - state.start_time) / 1000);
  const userAnswers = JSON.parse(state.user_answers);
  const totalQuestions = quiz.questions.length;
  const percentage = (state.score / totalQuestions) * 100;

  // Get user info with fallback
  const user = await bot.getChat(userId).catch(() => ({ username: 'Unknown', first_name: 'User' }));
  const username = user.username || 'Unknown';
  const firstName = user.first_name || 'User';

  // Save results
  markUserAttempted(userId, quizId, username, firstName);
  saveResult(userId, quizId, username, firstName, state.score, totalTime, userAnswers);
  deleteQuizState(userId);
  clearTimer(userId);

  // Determine result emoji
  const resultEmoji = percentage >= 80 ? '🏆' : percentage >= 60 ? '👏' : '💪';
  const shareLink = getShareableLink(quizId);

  const resultText = `${resultEmoji} Quiz Complete!\n\n` +
    `Quiz: ${quiz.title}\n` +
    `Score: ${state.score}/${totalQuestions}\n` +
    `Time: ${totalTime}s\n\n` +
    `Share: ${shareLink}`;

  const keyboard = {
    inline_keyboard: [
      [{ text: 'Review Answers', callback_data: `review_${quizId}` }],
      [{ text: 'Leaderboard', callback_data: `lb_${quizId}` }],
      [{ text: 'More Quizzes', callback_data: 'browse_quizzes' }]
    ]
  };

  bot.sendMessage(chatId, resultText, { reply_markup: keyboard });
}

module.exports = {
  sendQuestion,
  handlePollAnswer,
  finishQuiz,
  clearTimer,
  userPolls
};
