// Bot command handlers
const { ADMIN_USERNAMES } = require('./config');
const { getQuiz, getAvailableQuizzes } = require('./quizData');
const { clearUserData, listUsers } = require('./database');
const { getShareableLink, escapeHtml } = require('./utils');
const { showMainMenu, showCantos, showQuizList, showQuizDetails, showLeaderboard } = require('./menuHandlers');

function setupCommands(bot) {
  // /start - Show menu or start specific quiz via deep link
  bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username || '';
    const isAdmin = ADMIN_USERNAMES.includes(username.toLowerCase());
    const quizId = match[1];

    if (quizId && getQuiz(quizId)) {
      await showQuizDetails(bot, chatId, userId, quizId, isAdmin);
      return;
    }

    await showMainMenu(bot, chatId);
  });

  // /cantos - Show all cantos
  bot.onText(/\/cantos/, async (msg) => {
    const chatId = msg.chat.id;
    await showCantos(bot, chatId);
  });

  // /quizzes - List all available quizzes
  bot.onText(/\/quizzes/, async (msg) => {
    const chatId = msg.chat.id;
    await showQuizList(bot, chatId);
  });

  // /share quiz_id - Get shareable link for a quiz
  bot.onText(/\/share\s+(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const quizId = match[1].trim();
    const quiz = getQuiz(quizId);

    if (!quiz) {
      bot.sendMessage(chatId, '⚠️ Quiz not found. Use /quizzes to see available quizzes.');
      return;
    }

    const link = getShareableLink(quizId);
    bot.sendMessage(chatId, 
      `🔗 <b>Share this quiz:</b>\n\n` +
      `📝 <b>${escapeHtml(quiz.title)}</b>\n` +
      `${escapeHtml(quiz.description)}\n\n` +
      `🔗 Link: ${link}\n\n` +
      `<i>Anyone can click this link to start the quiz!</i>`,
      { parse_mode: 'HTML' }
    );
  });

  // /leaderboard quiz_id - Show leaderboard for specific quiz
  bot.onText(/\/leaderboard(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const quizId = match[1]?.trim();

    if (!quizId) {
      // Show combined leaderboard selection menu
      const quizzes = getAvailableQuizzes();
      const keyboard = {
        inline_keyboard: [
          [{ text: '🌟 Combined Leaderboard', callback_data: 'lb_combined' }]
        ]
      };
      
      // Add chapter-wise leaderboards
      quizzes.forEach(q => {
        keyboard.inline_keyboard.push([
          { text: `📖 ${q.title}`, callback_data: `lb_${q.id}` }
        ]);
      });
      
      keyboard.inline_keyboard.push([{ text: '◀️ Back to Main Menu', callback_data: 'back_main' }]);
      
      bot.sendMessage(chatId, '🏆 <b>Select Leaderboard:</b>', {
        parse_mode: 'HTML',
        reply_markup: keyboard
      });
      return;
    }

    const quiz = getQuiz(quizId);
    if (!quiz) {
      bot.sendMessage(chatId, '⚠️ Quiz not found.');
      return;
    }

    await showLeaderboard(bot, chatId, quizId);
  });

  // Admin: /clearuser username quiz_id
  bot.onText(/\/clearuser\s+(\S+)\s+(\S+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || '';
    const isAdmin = ADMIN_USERNAMES.includes(username.toLowerCase());

    if (!isAdmin) {
      bot.sendMessage(chatId, '⛔ Admin only command.');
      return;
    }

    const targetUsername = match[1].replace('@', '');
    const quizId = match[2];

    clearUserData(targetUsername, quizId);
    bot.sendMessage(chatId, `✅ Cleared @${targetUsername} from ${quizId}`);
  });
  
  // Admin: /resetquiz - Clear your current active quiz session
  bot.onText(/\/resetquiz/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username || '';
    const isAdmin = ADMIN_USERNAMES.includes(username.toLowerCase());

    if (!isAdmin) {
      bot.sendMessage(chatId, '⛔ Admin only command.');
      return;
    }

    const { deleteQuizState } = require('./database');
    deleteQuizState(userId);
    bot.sendMessage(chatId, `✅ Your active quiz session has been reset. You can start a new quiz now.`);
  });

  // Admin: /listusers quiz_id
  bot.onText(/\/listusers(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || '';
    const isAdmin = ADMIN_USERNAMES.includes(username.toLowerCase());

    if (!isAdmin) {
      bot.sendMessage(chatId, '⛔ Admin only command.');
      return;
    }

    const quizId = match[1]?.trim();
    if (!quizId) {
      bot.sendMessage(chatId, 'Usage: /listusers quiz_id');
      return;
    }

    const users = listUsers(quizId);

    if (users.length === 0) {
      bot.sendMessage(chatId, `No users found for ${quizId}`);
      return;
    }

    let userList = `👥 <b>Users in ${quizId}:</b>\n\n`;
    users.forEach((user, index) => {
      userList += `${index + 1}. @${user.username || 'unknown'} - Score: ${user.score}\n`;
    });

    bot.sendMessage(chatId, userList, { parse_mode: 'HTML' });
  });
}

module.exports = { setupCommands };
