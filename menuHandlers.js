// Menu and UI handlers
const { getQuiz, getAvailableQuizzes, getAllQuizzes } = require('./quizData');
const { hasUserAttempted, getLeaderboard, getUserResult, getTopPlayer, getCombinedLeaderboard, getUserQuizIds } = require('./database');
const { getShareableLink, escapeHtml } = require('./utils');

async function showMainMenu(bot, chatId) {
  const quizzes = getAvailableQuizzes();
  
  // Get top player
  const topPlayer = getTopPlayer();
  const topPlayerText = topPlayer 
    ? `🥇 Top Scorer: ${escapeHtml(topPlayer.first_name || topPlayer.username || 'Unknown')} Prabhu\n\n` 
    : '';
  
  const menuText = `🌸 <b>Śrīmad Bhāgavatam Quiz</b> 🌸\n` +
    `<i>"nityaṁ bhāgavata-sevayā"</i>\n\n` +
    `📊 <b>Available:</b> ${quizzes.length} Quizzes\n` +
    topPlayerText +
    `• /quizzes — Browse topics\n` +
    `• /leaderboard — View results`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '📚 Browse All Quizzes', callback_data: 'browse_quizzes' }],
      [{ text: '🏆 View Leaderboard', callback_data: 'lb_combined' }]
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

  const keyboard = {
    inline_keyboard: quizzes.map(q => [
      { text: `📝 ${q.title}`, callback_data: `quiz_${q.id}` }
    ])
  };
  
  // Add back button
  keyboard.inline_keyboard.push([{ text: '◀️ Back to Main Menu', callback_data: 'back_main' }]);

  bot.sendMessage(chatId, '📚 <b>All Available Quizzes</b>\n\n', {
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

  const reviewParts = [`📝 <b>Review: ${escapeHtml(quiz.title)}</b>\n\n` +
    `📊 Score: ${result.score}/${questions.length}\n` +
    `⏱️ Time: ${result.total_time}s\n\n`];

  questions.forEach((q, qIndex) => {
    const userChoice = userAnswers[qIndex];
    const isCorrect = userChoice === q.correct;

    let questionText = `<b>Q${qIndex + 1}: ${escapeHtml(q.question)}</b>\n`;

    if (userChoice === null || userChoice === undefined) {
      questionText += `⏰ Time's up - No answer\n`;
    } else if (isCorrect) {
      questionText += `✅ Your answer: ${escapeHtml(q.options[userChoice])}\n`;
    } else {
      questionText += `❌ Your answer: ${escapeHtml(q.options[userChoice])}\n`;
      questionText += `✓ Correct: ${escapeHtml(q.options[q.correct])}\n`;
    }
    reviewParts.push(questionText);
  });

  // Split into multiple messages if too long (Telegram limit: 4096 chars)
  const reviewText = reviewParts.join('\n');
  
  const keyboard = {
    inline_keyboard: [
      [{ text: '◀️ Back to Quiz', callback_data: `quiz_${quizId}` }]
    ]
  };
  
  if (reviewText.length > 4000) {
    // Send in chunks
    let currentChunk = reviewParts[0];
    for (let i = 1; i < reviewParts.length; i++) {
      if ((currentChunk + reviewParts[i]).length > 4000) {
        bot.sendMessage(chatId, currentChunk, { parse_mode: 'HTML' });
        currentChunk = reviewParts[i];
      } else {
        currentChunk += '\n' + reviewParts[i];
      }
    }
    if (currentChunk) {
      bot.sendMessage(chatId, currentChunk, { 
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    }
  } else {
    bot.sendMessage(chatId, reviewText, { 
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  }
}

async function showLeaderboard(bot, chatId, quizId) {
  const quiz = getQuiz(quizId);
  const leaderboard = getLeaderboard(quizId);

  if (!quiz) {
    bot.sendMessage(chatId, '⚠️ Quiz not found.');
    return;
  }

  if (leaderboard.length === 0) {
    const keyboard = {
      inline_keyboard: [
        [{ text: '◀️ Back to Leaderboards', callback_data: 'view_leaderboards' }]
      ]
    };
    
    bot.sendMessage(chatId, `🏆 <b>Leaderboard: ${escapeHtml(quiz.title)}</b>\n\nNo results yet. Be the first!`, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  const leaderboardLines = leaderboard.map((entry, index) => {
    const medal = medals[index] || `${index + 1}.`;
    const name = entry.first_name || entry.username || 'Anonymous';
    return `${medal} <b>${escapeHtml(name)}</b> - ${entry.score}/${quiz.questions.length} (${entry.total_time}s)`;
  });

  const shareLink = getShareableLink(quizId);
  const leaderboardText = `🏆 <b>Leaderboard: ${escapeHtml(quiz.title)}</b>\n\n` +
    leaderboardLines.join('\n') +
    `\n\n🔗 Share: ${shareLink}`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '◀️ Back to Leaderboards', callback_data: 'view_leaderboards' }]
    ]
  };

  bot.sendMessage(chatId, leaderboardText, { 
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

async function showCombinedLeaderboard(bot, chatId) {
  const leaderboard = getCombinedLeaderboard(10);

  if (leaderboard.length === 0) {
    const keyboard = {
      inline_keyboard: [
        [{ text: '◀️ Back', callback_data: 'back_main' }]
      ]
    };
    
    bot.sendMessage(chatId, `🏆 <b>Combined Leaderboard</b>\n\nNo results yet. Be the first to take a quiz!`, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  const leaderboardLines = leaderboard.map((entry, index) => {
    const medal = medals[index] || `${index + 1}.`;
    const name = entry.first_name || entry.username || 'Anonymous';
    
    // Get the quiz IDs this user has taken
    const userQuizIds = getUserQuizIds(entry.user_id);
    
    // Calculate total questions for those specific quizzes
    const totalQuestions = userQuizIds.reduce((sum, quizId) => {
      const quiz = getQuiz(quizId);
      return sum + (quiz ? quiz.questions.length : 0);
    }, 0);
    
    return `${medal} <b>${escapeHtml(name)}</b> - ${entry.total_score}/${totalQuestions} (${entry.quizzes_taken} quizzes)`;
  });

  const leaderboardText = `🏆 <b>Combined Leaderboard</b>\n` +
    `<i>Total scores across all quizzes</i>\n\n` +
    leaderboardLines.join('\n');

  const keyboard = {
    inline_keyboard: [
      [{ text: '◀️ Back', callback_data: 'back_main' }]
    ]
  };

  bot.sendMessage(chatId, leaderboardText, { 
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

module.exports = {
  showMainMenu,
  showQuizList,
  showQuizDetails,
  showReview,
  showLeaderboard,
  showCombinedLeaderboard
};
