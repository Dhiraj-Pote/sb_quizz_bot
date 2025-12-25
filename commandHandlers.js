// Bot command handlers
const { ADMIN_USERNAMES } = require('./config');
const { getQuiz, getAvailableQuizzes } = require('./quizData');
const { clearUserData, listUsers } = require('./database');
const { getShareableLink, escapeMarkdown } = require('./utils');
const { showMainMenu, showQuizList, showQuizDetails, showLeaderboard } = require('./menuHandlers');

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

  // /quizzes - List all available quizzes
  bot.onText(/\/quizzes/, async (msg) => {
    const chatId = msg.chat.id;
    await showQuizList(bot, chatId);
  });

  // /share quiz_id - Get shareable link for a quiz
  bot.onText(/\/share\s+(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const quizId = match[1].trim();
    const quiz = getQuiz(quizId);

    if (!quiz) {
      bot.sendMessage(chatId, '⚠️ Quiz not found. Use /quizzes to see available quizzes.');
      return;
    }

    const link = getShareableLink(quizId);
    bot.sendMessage(chatId, 
      `🔗 *Share this quiz:*\n\n` +
      `📝 *${escapeMarkdown(quiz.title)}*\n` +
      `${escapeMarkdown(quiz.description)}\n\n` +
      `🔗 Link: ${link}\n\n` +
      `_Anyone can click this link to start the quiz!_`,
      { parse_mode: 'Markdown' }
    );
  });

  // /leaderboard quiz_id - Show leaderboard for specific quiz
  bot.onText(/\/leaderboard(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const quizId = match[1]?.trim();

    if (!quizId) {
      const quizzes = getAvailableQuizzes();
      const keyboard = {
        inline_keyboard: quizzes.map(q => [
          { text: `🏆 ${q.title}`, callback_data: `lb_${q.id}` }
        ])
      };
      bot.sendMessage(chatId, '🏆 *Select a quiz to view its leaderboard:*', {
        parse_mode: 'Markdown',
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

    let userList = `👥 *Users in ${quizId}:*\n\n`;
    users.forEach((user, index) => {
      userList += `${index + 1}. @${user.username || 'unknown'} - Score: ${user.score}\n`;
    });

    bot.sendMessage(chatId, userList, { parse_mode: 'Markdown' });
  });
}

module.exports = { setupCommands };
