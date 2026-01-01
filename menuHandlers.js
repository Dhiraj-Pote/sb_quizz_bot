// Menu and UI handlers
const { getQuiz, getAvailableQuizzes } = require('./quizData');
const { hasUserAttempted, getLeaderboard, getUserResult } = require('./database');
const { getShareableLink, escapeHtml } = require('./utils');

async function showMainMenu(bot, chatId) {
  const quizzes = getAvailableQuizzes();
  
  let menuText = `🎯 <b>Welcome to the Quiz Bot!</b>\n\n`;
  menuText += `📚 <b>Available Quizzes:</b> ${quizzes.length}\n\n`;
  menuText += `Choose a quiz below or use:\n`;
  menuText += `• /quizzes - List all quizzes\n`;
  menuText += `• /leaderboard - View leaderboards`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '📚 Browse All Quizzes', callback_data: 'browse_quizzes' }],
      [{ text: '🏆 View Leaderboards', callback_data: 'view_leaderboards' }]
    ]
  };

  bot.sendMessage(chatId, menuText, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

async function showQuizList(bot, chatId) {
  const quizzes = getAvailableQuizzes();

  if (quizzes.length === 0) {
    bot.sendMessage(chatId, '⚠️ No quizzes available yet.');
    return;
  }

  let listText = `📚 <b>All Available Quizzes</b>\n\n`;

  const keyboard = {
    inline_keyboard: quizzes.map(q => [
      { text: `📝 ${q.title}`, callback_data: `quiz_${q.id}` }
    ])
  };

  bot.sendMessage(chatId, listText, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

async function showQuizDetails(bot, chatId, userId, quizId, isAdmin) {
  const quiz = getQuiz(quizId);
  if (!quiz) {
    bot.sendMessage(chatId, '⚠️ Quiz not found.');
    return;
  }

  const attempted = hasUserAttempted(userId, quizId);

  let detailText = `🎯 <b>${escapeHtml(quiz.title)}</b> 📖\n\n`;

  if (attempted && !isAdmin) {
    detailText += `✅ <i>You have already completed this quiz!</i>`;
  } else {
    detailText += `✨ <i>Ready to begin?</i>`;
  }

  const buttons = [];
  
  if (!attempted || isAdmin) {
    buttons.push([{ text: '▶️ Start Quiz', callback_data: `start_${quizId}` }]);
  }
  
  if (attempted) {
    buttons.push([{ text: '📝 Review My Answers', callback_data: `review_${quizId}` }]);
  }
  
  buttons.push([{ text: '🏆 Leaderboard', callback_data: `lb_${quizId}` }]);
  buttons.push([{ text: '🔗 Share Quiz', callback_data: `share_${quizId}` }]);
  buttons.push([{ text: '◀️ Back to Quizzes', callback_data: 'browse_quizzes' }]);

  bot.sendMessage(chatId, detailText, {
    parse_mode: 'HTML',
    reply_markup: { inline_keyboard: buttons }
  });
}

async function showReview(bot, chatId, userId, quizId) {
  const result = getUserResult(userId, quizId);
  const quiz = getQuiz(quizId);

  if (!result) {
    bot.sendMessage(chatId, '⚠️ You haven\'t taken this quiz yet!');
    return;
  }

  if (!quiz) {
    bot.sendMessage(chatId, '⚠️ Quiz not found.');
    return;
  }

  const questions = quiz.questions;
  const userAnswers = JSON.parse(result.user_answers);

  let reviewText = `📝 <b>Review: ${escapeHtml(quiz.title)}</b>\n\n`;
  reviewText += `📊 Score: ${result.score}/${questions.length}\n`;
  reviewText += `⏱️ Time: ${result.total_time}s\n\n`;

  questions.forEach((q, qIndex) => {
    const userChoice = userAnswers[qIndex];
    const isCorrect = userChoice === q.correct;

    reviewText += `<b>Q${qIndex + 1}: ${escapeHtml(q.question)}</b>\n`;

    if (userChoice === null || userChoice === undefined) {
      reviewText += `⏰ Time's up - No answer\n`;
    } else if (isCorrect) {
      reviewText += `✅ Your answer: ${escapeHtml(q.options[userChoice])}\n`;
    } else {
      reviewText += `❌ Your answer: ${escapeHtml(q.options[userChoice])}\n`;
      reviewText += `✓ Correct: ${escapeHtml(q.options[q.correct])}\n`;
    }
    reviewText += `\n`;
  });

  bot.sendMessage(chatId, reviewText, { parse_mode: 'HTML' });
}

async function showLeaderboard(bot, chatId, quizId) {
  const quiz = getQuiz(quizId);
  const leaderboard = getLeaderboard(quizId);

  if (!quiz) {
    bot.sendMessage(chatId, '⚠️ Quiz not found.');
    return;
  }

  if (leaderboard.length === 0) {
    bot.sendMessage(chatId, `🏆 <b>Leaderboard: ${escapeHtml(quiz.title)}</b>\n\nNo results yet. Be the first!`, {
      parse_mode: 'HTML'
    });
    return;
  }

  let leaderboardText = `🏆 <b>Leaderboard: ${escapeHtml(quiz.title)}</b>\n\n`;

  leaderboard.forEach((entry, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    const name = entry.first_name || entry.username || 'Anonymous';
    leaderboardText += `${medal} <b>${escapeHtml(name)}</b> - ${entry.score}/${quiz.questions.length} (${entry.total_time}s)\n`;
  });

  const shareLink = getShareableLink(quizId);
  leaderboardText += `\n🔗 Share: ${shareLink}`;

  bot.sendMessage(chatId, leaderboardText, { parse_mode: 'HTML' });
}

module.exports = {
  showMainMenu,
  showQuizList,
  showQuizDetails,
  showReview,
  showLeaderboard
};
