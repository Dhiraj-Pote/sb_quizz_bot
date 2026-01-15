// Telegram Quiz Bot - Main Entry Point
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const { BOT_TOKEN, BOT_USERNAME } = require('./config');
const { initDatabase, closeDatabase } = require('./database');
const { QUIZZES } = require('./quizData');
const { setupCommands } = require('./commandHandlers');
const { setupCallbacks } = require('./callbackHandlers');

// Validate bot token
if (!BOT_TOKEN) {
  console.error('❌ ERROR: BOT_TOKEN environment variable is not set!');
  console.error('Please set BOT_TOKEN in Railway dashboard Variables tab.');
  process.exit(1);
}

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
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️  Port ${PORT} is already in use. Health check server disabled.`);
    console.log(`✅ Bot will still work normally for Telegram!`);
  } else {
    console.error('Server error:', err);
  }
});

// Setup command and callback handlers
setupCommands(bot);
setupCallbacks(bot);

// Setup poll answer handler
const { handlePollAnswer } = require('./quizLogic');
bot.on('poll_answer', async (pollAnswer) => {
  await handlePollAnswer(bot, pollAnswer);
});

// Error handling with rate limiting awareness
bot.on('polling_error', (error) => {
  if (error.code === 'ETELEGRAM' && error.response?.statusCode === 429) {
    const retryAfter = error.response.body?.parameters?.retry_after || 60;
    console.warn(`⚠️  Rate limited. Retrying after ${retryAfter}s`);
  } else {
    console.error('Polling error:', error.code, error.message);
  }
});

bot.on('error', (error) => {
  console.error('Bot error:', error.message);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down bot...');
  bot.stopPolling();
  try {
    server.close();
  } catch (e) {
    // Server might not be running
  }
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down bot...');
  bot.stopPolling();
  try {
    server.close();
  } catch (e) {
    // Server might not be running
  }
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
