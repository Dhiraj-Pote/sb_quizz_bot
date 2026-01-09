// Configuration and Constants
module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN || '8590540828:AAFDdhQzqP3_LQLcTLPNZbtOe8s2Mb8A3DU',
  BOT_USERNAME: process.env.BOT_USERNAME || 'srimadbhagavatam_quiz_bot',
  ADMIN_USERNAMES: (process.env.ADMIN_USERNAMES || 'ys16108').split(',').map(u => u.trim().toLowerCase()),
  QUESTION_TIME_LIMIT: 60, // seconds
  DB_PATH: process.env.DB_PATH || './quiz.db'
};
