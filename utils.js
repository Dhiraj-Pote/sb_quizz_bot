// Utility functions
const { BOT_USERNAME } = require('./config');

function getShareableLink(quizId) {
  return `https://t.me/${BOT_USERNAME}?start=${quizId}`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(text) {
  // Escape special HTML characters for Telegram HTML parse mode
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = {
  getShareableLink,
  sleep,
  escapeHtml
};
