// Callback query handlers
const { ADMIN_USERNAMES } = require('./config');
const { getQuiz, getAvailableQuizzes } = require('./quizData');
const { hasUserAttempted, startQuizSession, getQuizState } = require('./database');
const { getShareableLink, escapeHtml } = require('./utils');
const { showMainMenu, showCantos, showCantoChapters, showQuizList, showQuizDetails, showReview, showLeaderboard, showCombinedLeaderboard } = require('./menuHandlers');
const { sendQuestion, clearTimer } = require('./quizLogic');

function setupCallbacks(bot) {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;
    const username = query.from.username || '';
    const isAdmin = ADMIN_USERNAMES.includes(username.toLowerCase());

    // Answer callback query early to prevent timeout
    bot.answerCallbackQuery(query.id).catch(() => {});

    try {
      if (data === 'browse_cantos') {
        await showCantos(bot, chatId);
      }
      else if (data === 'browse_quizzes') {
        await showQuizList(bot, chatId);
      }
      else if (data === 'canto_inactive') {
        bot.answerCallbackQuery(query.id, { text: 'This Canto is not yet active!', show_alert: true });
        return;
      }
      else if (data.startsWith('canto_')) {
        const cantoId = parseInt(data.substring(6));
        await showCantoChapters(bot, chatId, userId, cantoId, isAdmin);
      }
      else if (data === 'view_leaderboards') {
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
      }
      else if (data === 'back_main') {
        await showMainMenu(bot, chatId);
      }
      else if (data.startsWith('quiz_')) {
        const quizId = data.substring(5);
        await showQuizDetails(bot, chatId, userId, quizId, isAdmin);
      }
      else if (data.startsWith('start_')) {
        const quizId = data.substring(6);
        const quiz = getQuiz(quizId);
        
        if (!quiz) {
          bot.answerCallbackQuery(query.id, { text: 'Quiz not found!', show_alert: true });
          return;
        }

        const attempted = hasUserAttempted(userId, quizId);
        if (attempted && !isAdmin) {
          bot.answerCallbackQuery(query.id, { text: 'You already completed this quiz!', show_alert: true });
          return;
        }

        // Clear any existing timers and session before starting new quiz
        const { deleteQuizState } = require('./database');
        clearTimer(userId);
        deleteQuizState(userId);

        startQuizSession(userId, quizId);
        await sendQuestion(bot, chatId, userId, quizId, 0);
      }
      else if (data.startsWith('lb_')) {
        const quizId = data.substring(3);
        
        if (quizId === 'combined') {
          await showCombinedLeaderboard(bot, chatId);
        } else {
          await showLeaderboard(bot, chatId, quizId);
        }
      }
      else if (data.startsWith('review_')) {
        const quizId = data.substring(7);
        await showReview(bot, chatId, userId, quizId);
      }
      else if (data.startsWith('share_')) {
        const quizId = data.substring(6);
        const quiz = getQuiz(quizId);
        if (!quiz) return;
        const link = getShareableLink(quizId);
        
        const keyboard = {
          inline_keyboard: [
            [{ text: '◀️ Back to Quiz', callback_data: `quiz_${quizId}` }]
          ]
        };
        
        bot.sendMessage(chatId,
          `🔗 <b>Share "${escapeHtml(quiz.title)}"</b>\n\n` +
          `${link}\n\n` +
          `<i>Forward this link to friends!</i>`,
          { 
            parse_mode: 'HTML',
            reply_markup: keyboard
          }
        );
      }
    } catch (error) {
      console.error('Callback error:', error);
      bot.answerCallbackQuery(query.id, { text: 'An error occurred', show_alert: true }).catch(() => {});
    }
  });
}

module.exports = { setupCallbacks };
