// Menu and UI handlers
const { getQuiz, getAvailableQuizzes, getAllQuizzes, getCantos, getCanto, getChaptersForCanto } = require('./quizData');
const { hasUserAttempted, getLeaderboard, getUserResult, getTopPlayer, getCombinedLeaderboard, getUserQuizIds } = require('./database');
const { getShareableLink, escapeHtml } = require('./utils');

async function showMainMenu(bot, chatId, messageId = null) {
  const quizzes = getAvailableQuizzes();
  
  // Get top player
  const topPlayer = getTopPlayer();
  const topPlayerText = topPlayer 
    ? `🥇 <b>Top Score:</b> ${escapeHtml(topPlayer.first_name || topPlayer.username || 'Unknown')} Prabhu\n\n` 
    : '';
  
  const menuText = `🌸 <b>Śrīmad Bhāgavatam Quiz</b> 🌸\n` +
    `<i>"nityaṁ bhāgavata-sevayā"</i>\n\n` +
    ` <b>Cantos:</b> 12 (Canto 3 Active)\n` +
    topPlayerText +
    `🔹/cantos — Select Cantos\n` +
    `🔹/leaderboard — View results`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '📚 Browse Cantos', callback_data: 'browse_cantos' }],
      [{ text: '🏆 View Leaderboard', callback_data: 'lb_combined' }]
    ]
  };

  if (messageId) {
    bot.editMessageText(menuText, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'HTML',
      reply_markup: keyboard
    }).catch(() => {});
  } else {
    bot.sendMessage(chatId, menuText, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  }
}

async function showCantos(bot, chatId, messageId = null) {
  const cantos = getCantos();

  // Create keyboard with 2 columns (like the web UI with 4 columns but adapted for Telegram)
  const keyboard = {
    inline_keyboard: []
  };

  // Arrange cantos in 2 columns
  const cantoIds = Object.keys(cantos).map(Number).sort((a, b) => a - b);
  
  for (let i = 0; i < cantoIds.length; i += 2) {
    const row = [];
    
    // First canto in the row
    const canto1Id = cantoIds[i];
    const canto1 = cantos[canto1Id];
    const button1 = {
      text: canto1.active ? `📖 ${canto1Id}. ${canto1.name}` : `🔒 ${canto1Id}. ${canto1.name}`,
      callback_data: canto1.active ? `canto_${canto1Id}` : 'canto_inactive'
    };
    row.push(button1);
    
    // Second canto in the row (if exists)
    if (i + 1 < cantoIds.length) {
      const canto2Id = cantoIds[i + 1];
      const canto2 = cantos[canto2Id];
      const button2 = {
        text: canto2.active ? `📖 ${canto2Id}. ${canto2.name}` : `🔒 ${canto2Id}. ${canto2.name}`,
        callback_data: canto2.active ? `canto_${canto2Id}` : 'canto_inactive'
      };
      row.push(button2);
    }
    
    keyboard.inline_keyboard.push(row);
  }
  
  // Add back button
  keyboard.inline_keyboard.push([{ text: '◀️ Back to Main Menu', callback_data: 'back_main' }]);

  const text = `📚 <b>Śrīmad Bhāgavatam - 12 Cantos</b>\n\n<i>Select a Canto to view chapters</i>\n\n🔒 = Unavailable (Coming Soon)\n📖 = Available\n\n<b>Currently Available:</b> Canto 3`;

  if (messageId) {
    bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'HTML',
      reply_markup: keyboard
    }).catch(() => {});
  } else {
    bot.sendMessage(chatId, text, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  }
}

async function showCantoChapters(bot, chatId, userId, cantoId, isAdmin, messageId = null) {
  const canto = getCanto(cantoId);
  
  if (!canto) {
    bot.sendMessage(chatId, '⚠️ Canto not found.');
    return;
  }

  if (!canto.active) {
    const keyboard = {
      inline_keyboard: [
        [{ text: '◀️ Back to Cantos', callback_data: 'browse_cantos' }]
      ]
    };
    const text = `🔒 <b>Canto ${cantoId}: ${canto.name}</b>\n\nThis Canto is not yet active. Please check back later!`;
    
    if (messageId) {
      bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: keyboard
      }).catch(() => {});
    } else {
      bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    }
    return;
  }

  const chapters = getChaptersForCanto(cantoId);

  if (chapters.length === 0) {
    const keyboard = {
      inline_keyboard: [
        [{ text: '◀️ Back to Cantos', callback_data: 'browse_cantos' }]
      ]
    };
    const text = `⚠️ No chapters available for Canto ${cantoId}.`;
    
    if (messageId) {
      bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: keyboard
      }).catch(() => {});
    } else {
      bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    }
    return;
  }

  // Create 2-column layout for chapters
  const keyboard = {
    inline_keyboard: []
  };

  for (let i = 0; i < chapters.length; i += 2) {
    const row = [];
    
    // First chapter - callback should be quiz_quiz_3_17 (quiz_ prefix + quiz ID)
    const chapter1 = chapters[i];
    const ch1Num = chapter1.id.split('_')[2];
    row.push({
      text: `📖 Ch ${ch1Num}`,
      callback_data: `quiz_${chapter1.id}`
    });
    
    // Second chapter (if exists)
    if (i + 1 < chapters.length) {
      const chapter2 = chapters[i + 1];
      const ch2Num = chapter2.id.split('_')[2];
      row.push({
        text: `📖 Ch ${ch2Num}`,
        callback_data: `quiz_${chapter2.id}`
      });
    }
    
    keyboard.inline_keyboard.push(row);
  }

  // Add back button
  keyboard.inline_keyboard.push([{ text: '◀️ Back to Cantos', callback_data: 'browse_cantos' }]);

  const text = `📖 <b>Canto ${cantoId}: ${canto.name}</b>\n\n<b>Chapters:</b>`;

  if (messageId) {
    bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'HTML',
      reply_markup: keyboard
    }).catch(() => {});
  } else {
    bot.sendMessage(chatId, text, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  }
}

async function showQuizList(bot, chatId, messageId = null) {
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

  const text = '📚 <b>All Available Quizzes</b>\n\n';

  if (messageId) {
    bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'HTML',
      reply_markup: keyboard
    }).catch(() => {});
  } else {
    bot.sendMessage(chatId, text, {
      parse_mode: 'HTML',
      reply_markup: keyboard
    });
  }
}

async function showQuizDetails(bot, chatId, userId, quizId, isAdmin, messageId = null) {
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
  
  // Extract canto ID from quizId (e.g., quiz_3_17 -> 3)
  const quizParts = quizId.split('_');
  const cantoId = quizParts[1];
  const backCallback = cantoId ? `canto_${cantoId}` : 'browse_quizzes';
  
  buttons.push([{ text: '◀️ Back to Chapters', callback_data: backCallback }]);

  if (messageId) {
    bot.editMessageText(detailText, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: buttons }
    }).catch(() => {});
  } else {
    bot.sendMessage(chatId, detailText, {
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: buttons }
    });
  }
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

async function showLeaderboard(bot, chatId, quizId, messageId = null) {
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
    
    const text = `🏆 <b>Leaderboard: ${escapeHtml(quiz.title)}</b>\n\nNo results yet. Be the first!`;
    
    if (messageId) {
      bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: keyboard
      }).catch(() => {});
    } else {
      bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    }
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

  // Telegram message limit is 4096 chars, split if needed
  if (leaderboardText.length > 4000) {
    let current = `🏆 <b>Leaderboard: ${escapeHtml(quiz.title)}</b>\n\n`;
    for (let i = 0; i < leaderboardLines.length; i++) {
      if ((current + leaderboardLines[i] + '\n').length > 4000) {
        await bot.sendMessage(chatId, current, { parse_mode: 'HTML' });
        current = '';
      }
      current += leaderboardLines[i] + '\n';
    }
    if (current) {
      await bot.sendMessage(chatId, current + `\n\n🔗 Share: ${shareLink}`, { parse_mode: 'HTML', reply_markup: keyboard });
    }
  } else {
    if (messageId) {
      bot.editMessageText(leaderboardText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: keyboard
      }).catch(() => {});
    } else {
      bot.sendMessage(chatId, leaderboardText, { 
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    }
  }
}

async function showCombinedLeaderboard(bot, chatId, messageId = null) {
  const leaderboard = getCombinedLeaderboard();

  if (leaderboard.length === 0) {
    const keyboard = {
      inline_keyboard: [
        [{ text: '◀️ Back', callback_data: 'back_main' }]
      ]
    };
    
    const text = `🏆 <b>Combined Leaderboard</b>\n\nNo results yet. Be the first to take a quiz!`;
    
    if (messageId) {
      bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: keyboard
      }).catch(() => {});
    } else {
      bot.sendMessage(chatId, text, {
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    }
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

  // Telegram message limit is 4096 chars, split if needed
  if (leaderboardText.length > 4000) {
    let current = `🏆 <b>Combined Leaderboard</b>\n<i>Total scores across all quizzes</i>\n\n`;
    for (let i = 0; i < leaderboardLines.length; i++) {
      if ((current + leaderboardLines[i] + '\n').length > 4000) {
        await bot.sendMessage(chatId, current, { parse_mode: 'HTML' });
        current = '';
      }
      current += leaderboardLines[i] + '\n';
    }
    if (current) {
      await bot.sendMessage(chatId, current, { parse_mode: 'HTML', reply_markup: keyboard });
    }
  } else {
    if (messageId) {
      bot.editMessageText(leaderboardText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: keyboard
      }).catch(() => {});
    } else {
      bot.sendMessage(chatId, leaderboardText, { 
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
    }
  }
}

module.exports = {
  showMainMenu,
  showCantos,
  showCantoChapters,
  showQuizList,
  showQuizDetails,
  showReview,
  showLeaderboard,
  showCombinedLeaderboard
};
