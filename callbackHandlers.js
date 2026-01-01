// Callback query handlers
const { ADMIN_USERNAMES } = require('./config');
const { getQuiz, getAvailableQuizzes } = require('./quizData');
const { hasUserAttempted, startQuizSession, getQuizState } = require('./database');
const { getShareableLink, escapeHtml } = require('./utils');
const { showMainMenu, showQuizList, showQuizDetails, showReview, showLeaderboard } = require('./menuHandlers');
const { sendQuestion, handleAnswer, clearTimer } = require('./quizLogic');

function setupCallbacks(bot) {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;
    const username = query.from.username || '';
    const isAdmin = ADMIN_USERNAMES.includes(username.toLowerCase());

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
        bot.sendMessage(chatId, '🏆 <b>Select a quiz to view its leaderboard:</b>', {
          parse_mode: 'HTML',
          reply_markup: keyboard
        });
      }
      else if (data === 'back_main') {
        await showMainMenu(bot, chatId);
      }
      else if (data.startsWith('quiz_')) {
        // callback_data is 'quiz_quiz_1' (prefix 'quiz_' + id 'quiz_1')
        const quizId = data.substring(5); // Remove first 'quiz_' to get 'quiz_1'
        await showQuizDetails(bot, chatId, userId, quizId, isAdmin);
      }
      else if (data.startsWith('start_')) {
        // callback_data is 'start_quiz_1' (prefix 'start_' + id 'quiz_1')
        const quizId = data.substring(6); // Remove 'start_' to get 'quiz_1'
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
        // callback_data is 'lb_quiz_1' (prefix 'lb_' + id 'quiz_1')
        const quizId = data.substring(3); // Remove 'lb_' to get 'quiz_1'
        await showLeaderboard(bot, chatId, quizId);
      }
      else if (data.startsWith('review_')) {
        // callback_data is 'review_quiz_1' (prefix 'review_' + id 'quiz_1')
        const quizId = data.substring(7); // Remove 'review_' to get 'quiz_1'
        await showReview(bot, chatId, userId, quizId);
      }
      else if (data.startsWith('share_')) {
        // callback_data is 'share_quiz_1' (prefix 'share_' + id 'quiz_1')
        const quizId = data.substring(6); // Remove 'share_' to get 'quiz_1'
        const quiz = getQuiz(quizId);
        if (!quiz) return;
        const link = getShareableLink(quizId);
        
        bot.sendMessage(chatId,
          `🔗 <b>Share "${escapeHtml(quiz.title)}"</b>\n\n` +
          `${link}\n\n` +
          `<i>Forward this link to friends!</i>`,
          { parse_mode: 'HTML' }
        );
      }
      else if (data.startsWith('answer_')) {
        // Format: answer_quiz_1_0_2 (answer_quizId_questionIndex_answerIndex)
        const withoutPrefix = data.substring(7); // Remove 'answer_' to get 'quiz_1_0_2'
        const lastUnderscore = withoutPrefix.lastIndexOf('_');
        const secondLastUnderscore = withoutPrefix.lastIndexOf('_', lastUnderscore - 1);
        
        const quizId = withoutPrefix.substring(0, secondLastUnderscore); // quiz_1
        const questionIndex = parseInt(withoutPrefix.substring(secondLastUnderscore + 1, lastUnderscore)); // 0
        const answerIndex = parseInt(withoutPrefix.substring(lastUnderscore + 1)); // 2

        const state = getQuizState(userId);
        
        if (!state) {
          bot.answerCallbackQuery(query.id, { text: 'Quiz session expired. Please start again.', show_alert: true });
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
