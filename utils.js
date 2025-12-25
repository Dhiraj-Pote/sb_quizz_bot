// Utility functions
const { BOT_USERNAME } = require('./config');

function getShareableLink(quizId) {
  return `https://t.me/${BOT_USERNAME}?start=${quizId}`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeMarkdown(text) {
  // Escape special Markdown characters for Telegram
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, function(match) {
    return '\\' + match;
  });
}

module.exports = {
  getShareableLink,
  sleep,
  escapeMarkdown
};
