// Configuration and Constants
module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN || '8519517662:AAFt7rGafAG3ym35mb3YzXimquP6hybMyhY',
  BOT_USERNAME: process.env.BOT_USERNAME || 'sb_quizz_bot',
  ADMIN_USERNAMES: (process.env.ADMIN_USERNAMES || 'ys16108').split(',').map(u => u.trim().toLowerCase()),
  QUESTION_TIME_LIMIT: 60, // seconds
  DB_PATH: process.env.DB_PATH || './quiz.db'
};
