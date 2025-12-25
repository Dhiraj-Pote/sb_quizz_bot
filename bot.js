// Telegram Quiz Bot - Main Entry Point
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const { BOT_TOKEN, BOT_USERNAME } = require('./config');
const { initDatabase, closeDatabase } = require('./database');
const { QUIZZES } = require('./quizData');
const { setupCommands } = require('./commandHandlers');
const { setupCallbacks } = require('./callbackHandlers');

// Initialize database
initDatabase();

// Initialize bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Create a simple HTTP server for Railway health checks
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', bot: 'running' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`🌐 Health check server running on port ${PORT}`);
});

// Setup command and callback handlers
setupCommands(bot);
setupCallbacks(bot);

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.code, error.message);
});

bot.on('error', (error) => {
  console.error('Bot error:', error.message);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down bot...');
  bot.stopPolling();
  server.close();
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down bot...');
  bot.stopPolling();
  server.close();
  closeDatabase();
  process.exit(0);
});

console.log('🤖 Quiz Bot is running...');
console.log(`📚 Total quizzes available: ${Object.keys(QUIZZES).length}`);
const availableQuizzes = require('./quizData').getAvailableQuizzes();
console.log(`✅ Currently accessible: ${availableQuizzes.length}`);
availableQuizzes.forEach(quiz => {
  console.log(`   - ${quiz.id}: ${quiz.title} (${quiz.createdDate})`);
});
console.log(`🔗 Share links: https://t.me/${BOT_USERNAME}?start=quiz_ID`);
