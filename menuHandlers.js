// Menu and UI handlers
const { getQuiz, getAvailableQuizzes } = require('./quizData');
const { hasUserAttempted, getLeaderboard, getUserResult } = require('./database');
const { getShareableLink, escapeMarkdown } = require('./utils');

async function showMainMenu(bot, chatId) {
  const quizzes = getAvailableQuizzes();
  
  let menuText = `🎯 *Welcome to the Quiz Bot!*\n\n`;
  menuText += `📚 *Available Quizzes:* ${quizzes.length}\n\n`;
  menuText += `Choose a quiz below or use:\n`;
  menuText += `• /quizzes - List all quizzes\n`;
  menuText += `• /share quiz_id - Get shareable link\n`;
  menuText += `• /leaderboard - View leaderboards`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '📚 Browse All Quizzes', callback_data: 'browse_quizzes' }],
      [{ text: '🏆 View Leaderboards', callback_data: 'view_leaderboards' }]
    ]
  };

  bot.sendMessage(chatId, menuText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}

async function showQuizList(bot, chatId) {
  const quizzes = getAvailableQuizzes();

  if (quizzes.length === 0) {
    bot.sendMessage(chatId, '⚠️ No quizzes available yet.');
    return;
  }

  let listText = `📚 *All Available Quizzes*\n\n`;

  const keyboard = {
    inline_keyboard: quizzes.map(q => [
      { text: `📝 ${q.title}`, callback_data: `quiz_${q.id}` }
    ])
  };

  bot.sendMessage(chatId, listText, {
    parse_mode: 'Markdown',
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

  let detailText = `🎯 *${escapeMarkdown(quiz.title)}* 📖\n\n`;

  if (attempted && !isAdmin) {
    detailText += `✅ _You have already completed this quiz!_`;
  } else {
    detailText += `✨ _Ready to begin?_`;
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
    parse_mode: 'Markdown',
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

  let reviewText = `📝 *Review: ${escapeMarkdown(quiz.title)}*\n\n`;
  reviewText += `📊 Score: ${result.score}/${questions.length}\n`;
  reviewText += `⏱️ Time: ${result.total_time}s\n\n`;

  questions.forEach((q, qIndex) => {
    const userChoice = userAnswers[qIndex];
    const isCorrect = userChoice === q.correct;

    reviewText += `*Q${qIndex + 1}: ${escapeMarkdown(q.question)}*\n`;

    if (userChoice === null) {
      reviewText += `⏰ Time's up - No answer\n`;
    } else if (isCorrect) {
      reviewText += `✅ Your answer: ${escapeMarkdown(q.options[userChoice])}\n`;
    } else {
      reviewText += `❌ Your answer: ${escapeMarkdown(q.options[userChoice])}\n`;
      reviewText += `✓ Correct: ${escapeMarkdown(q.options[q.correct])}\n`;
    }
    reviewText += `\n`;
  });

  bot.sendMessage(chatId, reviewText, { parse_mode: 'Markdown' });
}

async function showLeaderboard(bot, chatId, quizId) {
  const quiz = getQuiz(quizId);
  const leaderboard = getLeaderboard(quizId);

  if (!quiz) {
    bot.sendMessage(chatId, '⚠️ Quiz not found.');
    return;
  }

  if (leaderboard.length === 0) {
    bot.sendMessage(chatId, `🏆 *Leaderboard: ${escapeMarkdown(quiz.title)}*\n\nNo results yet. Be the first!`, {
      parse_mode: 'Markdown'
    });
    return;
  }

  let leaderboardText = `🏆 *Leaderboard: ${escapeMarkdown(quiz.title)}*\n\n`;

  leaderboard.forEach((entry, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    const name = entry.first_name || entry.username || 'Anonymous';
    leaderboardText += `${medal} *${escapeMarkdown(name)}* - ${entry.score}/${quiz.questions.length} (${entry.total_time}s)\n`;
  });

  const shareLink = getShareableLink(quizId);
  leaderboardText += `\n🔗 Share: ${shareLink}`;

  bot.sendMessage(chatId, leaderboardText, { parse_mode: 'Markdown' });
}

module.exports = {
  showMainMenu,
  showQuizList,
  showQuizDetails,
  showReview,
  showLeaderboard
};
