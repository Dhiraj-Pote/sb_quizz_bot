// Callback query handlers
const { ADMIN_USERNAMES } = require('./config');
const { getQuiz, getAvailableQuizzes } = require('./quizData');
const { hasUserAttempted, startQuizSession, getQuizState } = require('./database');
const { getShareableLink, escapeMarkdown } = require('./utils');
const { showMainMenu, showQuizList, showQuizDetails, showReview, showLeaderboard } = require('./menuHandlers');
const { sendQuestion, handleAnswer, clearTimer } = require('./quizLogic');

function setupCallbacks(bot) {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;
    const username = query.from.username || '';
    const isAdmin = ADMIN_USERNAMES.includes(username.toLowerCase());
    
    // Debug logging for admin check
    if (data.startsWith('answer_')) {
      console.log(`Answer callback - Username: ${username}, IsAdmin: ${isAdmin}, AdminList: ${ADMIN_USERNAMES.join(',')}`);
    }

    try {
      if (data === 'browse_quizzes') {
        await showQuizList(bot, chatId);
      }
      else if (data === 'view_leaderboards') {
        const quizzes = getAvailableQuizzes();
        const keyboard = {
          inline_keyboard: quizzes.map(q => [
            { text: `🏆 ${q.title}`, callback_data: `lb_${q.id}` }
          ])
        };
        keyboard.inline_keyboard.push([{ text: '◀️ Back', callback_data: 'back_main' }]);
        bot.sendMessage(chatId, '🏆 *Select a quiz to view its leaderboard:*', {
          parse_mode: 'Markdown',
          reply_markup: keyboard
        });
      }
      else if (data === 'back_main') {
        await showMainMenu(bot, chatId);
      }
      else if (data.startsWith('quiz_')) {
        const quizId = data.replace('quiz_', '');
        await showQuizDetails(bot, chatId, userId, quizId, isAdmin);
      }
      else if (data.startsWith('start_')) {
        const quizId = data.replace('start_', '');
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
        const quizId = data.replace('lb_', '');
        await showLeaderboard(bot, chatId, quizId);
      }
      else if (data.startsWith('review_')) {
        const quizId = data.replace('review_', '');
        await showReview(bot, chatId, userId, quizId);
      }
      else if (data.startsWith('share_')) {
        const quizId = data.replace('share_', '');
        const quiz = getQuiz(quizId);
        if (!quiz) return;
        const link = getShareableLink(quizId);
        
        bot.sendMessage(chatId,
          `🔗 *Share "${escapeMarkdown(quiz.title)}"*\n\n` +
          `${link}\n\n` +
          `_Forward this link to friends!_`,
          { parse_mode: 'Markdown' }
        );
      }
      else if (data.startsWith('answer_')) {
        const parts = data.split('_');
        const quizId = parts[1];
        const questionIndex = parseInt(parts[2]);
        const answerIndex = parseInt(parts[3]);

        const state = getQuizState(userId);
        
        if (!state) {
          bot.answerCallbackQuery(query.id, { text: 'Quiz session expired. Please start again.', show_alert: true });
          return;
        }
        
        // Validate quiz_id matches current session
        if (state.quiz_id !== quizId) {
          bot.answerCallbackQuery(query.id, { text: 'This question is from a different quiz session.', show_alert: true });
          return;
        }
        
        // Allow admins to answer any question, but regular users can only answer the current question
        if (!isAdmin && state.current_question !== questionIndex) {
          bot.answerCallbackQuery(query.id, { text: 'This question has already been answered.', show_alert: true });
          return;
        }

        clearTimer(userId);
        await handleAnswer(bot, chatId, userId, query.message.message_id, quizId, questionIndex, answerIndex);
      }

      bot.answerCallbackQuery(query.id);
    } catch (error) {
      console.error('Callback error:', error);
      bot.answerCallbackQuery(query.id, { text: 'An error occurred', show_alert: true });
    }
  });
}

module.exports = { setupCallbacks };
