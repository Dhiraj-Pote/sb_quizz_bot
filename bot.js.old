// Telegram Quiz Bot - Multiple Quizzes with Unique IDs & Shareable Links
// File: bot.js

const TelegramBot = require('node-telegram-bot-api');
const Database = require('better-sqlite3');

// ============= CONFIGURATION =============
const BOT_TOKEN = '8590540828:AAFDdhQzqP3_LQLcTLPNZbtOe8s2Mb8A3DU';
const BOT_USERNAME = 'srimadbhagavatam_quiz_bot';
const db = new Database('./quiz.db');

// Admin username (can attempt quiz unlimited times)
const ADMIN_USERNAME = 'ys16108';

// ============= QUIZ LIBRARY =============
// Each quiz has a unique ID that never expires
// Shareable link format: https://t.me/BOT_USERNAME?start=quiz_ID
const QUIZZES = {
  'quiz_1': {
    id: 'quiz_1',
    title: 'SB Canto 3 Chapter 17',
    description: 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 17',
    createdDate: '2025-12-23',
    questions: [
      {
        question: "According to the Pinda-siddhi logic mentioned in the SB 3/17/18 purport, why was Hiranyakasipu considered the elder twin despite being born second?",
        options: ["He was delivered from the right side of the womb.", "Brahma explicitly named him the elder in a benediction.", "He was the first to be conceived in the womb.", "He exhibited greater physical strength at the moment of birth."],
        correct: 2
      },
      {
        question: "What was the cause of natural disturbances & bad omen throughout the universe?",
        options: ["Attack's caused by the demon's", "It was the time for a dissolution of the universe.", "End of Brahma's Kalpa.", "Birth of Diti's son's"],
        correct: 3
      },
      {
        question: "Which of the following was NOT described as an inauspicious omen at the birth of the demons?",
        options: ["She-jackals vomited fire and howled ominously.", "Cows passed dung and urine out of sheer terror.", "Flowers rained from the sky in the heavenly planets.", "The earth and mountains quaked violently."],
        correct: 2
      },
      {
        question: "When Hiranyaksa entered the ocean searching for a fight, how did the aquatic creatures react?",
        options: ["They formed an army to defend the palace of Varuna.", "They remained indifferent as he was a land-dweller.", "They fled in great fear, even though he did not strike them.", "They gathered to offer him tributes of gold and jewels."],
        correct: 2
      },
      {
        question: "Which one is lord Varuna's Planet?",
        options: ["Virajā", "Varuna loka", "Indraloka", "Vibhavari"],
        correct: 3
      }
    ]
  },
  'quiz_2': {
    id: 'quiz_2',
    title: 'SB Canto 3 Chapter 18',
    description: 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 18',
    createdDate: '2025-12-24',
    questions: [
      {
        question: "Who is described as the most independent demigod of the universe who came to witness the fight?",
        options: ["Lord Shiva", "Lord Brahma", "Indra", "Manu"],
        correct: 1
      },
      {
        question: "How did Lord Varaha ensure the safety of the Earth before engaging in the final duel?",
        options: ["He placed her on the water and empowered her to float", "He hid the Earth behind the sun", "He handed the Earth over to Lord Brahma", "He swallowed the Earth to keep her safe inside His body"],
        correct: 0
      },
      {
        question: "Did the demon Hiranyaksha glorify the Lord with his words, despite his wanting to deride Him?",
        options: ["True", "False"],
        correct: 0
      },
      {
        question: "Who refuses liberation even if it is offered to them?",
        options: ["Impersonalists", "Asuras", "Karmis", "Devotees of the Lord"],
        correct: 3
      }
    ]
  },
  'quiz_3': {
    id: 'quiz_3',
    title: 'SB Canto 3 Chapter 19',
    description: 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 19',
    createdDate: '2025-12-25',
    questions: [
      {
        question: "Sample Question 1 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0
      },
      {
        question: "Sample Question 2 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 1
      },
      {
        question: "Sample Question 3 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 2
      },
      {
        question: "Sample Question 4 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 3
      },
      {
        question: "Sample Question 5 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0
      }
    ]
  },
  'quiz_4': {
    id: 'quiz_4',
    title: 'SB Canto 3 Chapter 20',
    description: 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 20',
    createdDate: '2025-12-26',
    questions: [
      {
        question: "Sample Question 1 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0
      },
      {
        question: "Sample Question 2 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 1
      },
      {
        question: "Sample Question 3 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 2
      },
      {
        question: "Sample Question 4 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 3
      },
      {
        question: "Sample Question 5 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0
      }
    ]
  },
  'quiz_5': {
    id: 'quiz_5',
    title: 'SB Canto 3 Chapter 21',
    description: 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 21',
    createdDate: '2025-12-27',
    questions: [
      {
        question: "Sample Question 1 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0
      },
      {
        question: "Sample Question 2 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 1
      },
      {
        question: "Sample Question 3 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 2
      },
      {
        question: "Sample Question 4 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 3
      },
      {
        question: "Sample Question 5 - Replace with actual question",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0
      }
    ]
  }
};

const QUESTION_TIME_LIMIT = 60; // seconds


// ============= DATABASE SETUP =============
db.exec(`CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER,
  quiz_id TEXT,
  username TEXT,
  first_name TEXT,
  has_attempted INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, quiz_id)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  quiz_id TEXT,
  username TEXT,
  first_name TEXT,
  score INTEGER,
  total_time INTEGER,
  user_answers TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

db.exec(`CREATE TABLE IF NOT EXISTS active_quizzes (
  user_id INTEGER PRIMARY KEY,
  quiz_id TEXT,
  current_question INTEGER,
  score INTEGER,
  start_time INTEGER,
  question_start_time INTEGER,
  user_answers TEXT
)`);

// ============= BOT INITIALIZATION =============
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const userTimers = {};

// ============= HELPER FUNCTIONS =============
function getQuiz(quizId) {
  return QUIZZES[quizId] || null;
}

function getAllQuizzes() {
  return Object.values(QUIZZES);
}

function getShareableLink(quizId) {
  return `https://t.me/${BOT_USERNAME}?start=${quizId}`;
}

function hasUserAttempted(userId, quizId) {
  const row = db.prepare('SELECT has_attempted FROM users WHERE user_id = ? AND quiz_id = ?')
    .get(userId, quizId);
  return row && row.has_attempted === 1;
}

function markUserAttempted(userId, quizId, username, firstName) {
  db.prepare(
    'INSERT OR REPLACE INTO users (user_id, quiz_id, username, first_name, has_attempted) VALUES (?, ?, ?, ?, 1)'
  ).run(userId, quizId, username, firstName);
}

function saveResult(userId, quizId, username, firstName, score, totalTime, userAnswers) {
  db.prepare(
    'INSERT INTO results (user_id, quiz_id, username, first_name, score, total_time, user_answers) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(userId, quizId, username, firstName, score, totalTime, JSON.stringify(userAnswers));
}

function getUserResult(userId, quizId) {
  return db.prepare('SELECT * FROM results WHERE user_id = ? AND quiz_id = ?')
    .get(userId, quizId);
}

function getLeaderboard(quizId) {
  return db.prepare(
    `SELECT username, first_name, score, total_time 
     FROM results 
     WHERE quiz_id = ?
     ORDER BY score DESC, total_time ASC 
     LIMIT 10`
  ).all(quizId);
}

function startQuizSession(userId, quizId) {
  const now = Date.now();
  db.prepare(
    'INSERT OR REPLACE INTO active_quizzes (user_id, quiz_id, current_question, score, start_time, question_start_time, user_answers) VALUES (?, ?, 0, 0, ?, ?, ?)'
  ).run(userId, quizId, now, now, JSON.stringify([]));
}

function getQuizState(userId) {
  return db.prepare('SELECT * FROM active_quizzes WHERE user_id = ?').get(userId);
}

function updateQuizState(userId, currentQuestion, score, questionStartTime, userAnswers) {
  db.prepare(
    'UPDATE active_quizzes SET current_question = ?, score = ?, question_start_time = ?, user_answers = ? WHERE user_id = ?'
  ).run(currentQuestion, score, questionStartTime, JSON.stringify(userAnswers), userId);
}

function deleteQuizState(userId) {
  db.prepare('DELETE FROM active_quizzes WHERE user_id = ?').run(userId);
}

function clearTimer(userId) {
  if (userTimers[userId]) {
    if (userTimers[userId].timeout) clearTimeout(userTimers[userId].timeout);
    if (userTimers[userId].interval) clearInterval(userTimers[userId].interval);
    delete userTimers[userId];
  }
}

// Helper for animation delays
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// ============= BOT COMMANDS =============

// /start - Show menu or start specific quiz via deep link
bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || '';
  const isAdmin = username.toLowerCase() === ADMIN_USERNAME.toLowerCase();
  const quizId = match[1]; // Deep link parameter (e.g., quiz_1)

  // If deep link contains a quiz ID, show that quiz
  if (quizId && QUIZZES[quizId]) {
    await showQuizDetails(chatId, userId, quizId, isAdmin);
    return;
  }

  // Otherwise show the main menu with all quizzes
  await showMainMenu(chatId);
});

// /quizzes - List all available quizzes
bot.onText(/\/quizzes/, async (msg) => {
  const chatId = msg.chat.id;
  await showQuizList(chatId);
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
    `📝 *${quiz.title}*\n` +
    `${quiz.description}\n\n` +
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
    // Show list of quizzes to choose from
    const quizzes = getAllQuizzes();
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

  await showLeaderboard(chatId, quizId);
});

// Admin: /clearuser username quiz_id
bot.onText(/\/clearuser\s+(\S+)\s+(\S+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || '';
  const isAdmin = username.toLowerCase() === ADMIN_USERNAME.toLowerCase();

  if (!isAdmin) {
    bot.sendMessage(chatId, '⛔ Admin only command.');
    return;
  }

  const targetUsername = match[1].replace('@', '');
  const quizId = match[2];

  db.prepare('DELETE FROM results WHERE username = ? AND quiz_id = ?').run(targetUsername, quizId);
  db.prepare('DELETE FROM users WHERE username = ? AND quiz_id = ?').run(targetUsername, quizId);

  bot.sendMessage(chatId, `✅ Cleared @${targetUsername} from ${quizId}`);
});

// Admin: /listusers quiz_id
bot.onText(/\/listusers(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || '';
  const isAdmin = username.toLowerCase() === ADMIN_USERNAME.toLowerCase();

  if (!isAdmin) {
    bot.sendMessage(chatId, '⛔ Admin only command.');
    return;
  }

  const quizId = match[1]?.trim();
  if (!quizId) {
    bot.sendMessage(chatId, 'Usage: /listusers quiz_id');
    return;
  }

  const users = db.prepare('SELECT username, first_name, score FROM results WHERE quiz_id = ? ORDER BY score DESC').all(quizId);

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


// ============= MENU FUNCTIONS =============
async function showMainMenu(chatId) {
  const quizzes = getAllQuizzes();
  
  let menuText = `🎯 *Welcome to the Quiz Bot!*\n\n`;
  menuText += `📚 *Available Quizzes:* ${quizzes.length}\n\n`;
  menuText += `Choose a quiz below or use:\n`;
  menuText += `• /quizzes - List all quizzes\n`;
  menuText += `• /share quiz_id - Get shareable link\n`;
  menuText += `• /leaderboard - View leaderboards`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '📚 Browse All Quizzes', callback_data: 'browse_quizzes' }],
      [{ text: '🏆 View Leaderboards', callback_data: 'view_leaderboards' }]
    ]
  };

  bot.sendMessage(chatId, menuText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}

async function showQuizList(chatId) {
  const quizzes = getAllQuizzes();

  if (quizzes.length === 0) {
    bot.sendMessage(chatId, '⚠️ No quizzes available yet.');
    return;
  }

  let listText = `📚 *All Available Quizzes*\n\n`;

  const keyboard = {
    inline_keyboard: quizzes.map(q => [
      { text: `📝 ${q.title} (${q.questions.length} Q)`, callback_data: `quiz_${q.id}` }
    ])
  };

  bot.sendMessage(chatId, listText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}

async function showQuizDetails(chatId, userId, quizId, isAdmin) {
  const quiz = getQuiz(quizId);
  if (!quiz) {
    bot.sendMessage(chatId, '⚠️ Quiz not found.');
    return;
  }

  const attempted = hasUserAttempted(userId, quizId);
  const shareLink = getShareableLink(quizId);

  let detailText = `🎯 *${quiz.title}*\n\n`;
  detailText += `📖 ${quiz.description}\n`;
  detailText += `📅 Created: ${quiz.createdDate}\n`;
  detailText += `❓ Questions: ${quiz.questions.length}\n`;
  detailText += `⏱️ Time per question: ${QUESTION_TIME_LIMIT}s\n\n`;
  detailText += `🔗 Share: \`${shareLink}\`\n\n`;

  if (attempted && !isAdmin) {
    detailText += `✅ _You have already completed this quiz!_`;
  } else {
    detailText += `✨ _Ready to begin?_`;
  }

  const buttons = [];
  
  if (!attempted || isAdmin) {
    buttons.push([{ text: '▶️ Start Quiz', callback_data: `start_${quizId}` }]);
  }
  
  if (attempted) {
    buttons.push([{ text: '📝 Review My Answers', callback_data: `review_${quizId}` }]);
  }
  
  buttons.push([{ text: '🏆 Leaderboard', callback_data: `lb_${quizId}` }]);
  buttons.push([{ text: '🔗 Share Quiz', callback_data: `share_${quizId}` }]);
  buttons.push([{ text: '◀️ Back to Quizzes', callback_data: 'browse_quizzes' }]);

  bot.sendMessage(chatId, detailText, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
}


// ============= CALLBACK HANDLERS =============
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;
  const username = query.from.username || '';
  const isAdmin = username.toLowerCase() === ADMIN_USERNAME.toLowerCase();

  try {
    // Browse quizzes
    if (data === 'browse_quizzes') {
      await showQuizList(chatId);
    }
    // View leaderboards menu
    else if (data === 'view_leaderboards') {
      const quizzes = getAllQuizzes();
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
    // Back to main menu
    else if (data === 'back_main') {
      await showMainMenu(chatId);
    }
    // View specific quiz
    else if (data.startsWith('quiz_')) {
      const quizId = data.replace('quiz_', '');
      await showQuizDetails(chatId, userId, quizId, isAdmin);
    }
    // Start quiz
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

      startQuizSession(userId, quizId);
      await sendQuestion(chatId, userId, quizId, 0);
    }
    // View leaderboard
    else if (data.startsWith('lb_')) {
      const quizId = data.replace('lb_', '');
      await showLeaderboard(chatId, quizId);
    }
    // Review answers
    else if (data.startsWith('review_')) {
      const quizId = data.replace('review_', '');
      await showReview(chatId, userId, quizId);
    }
    // Share quiz
    else if (data.startsWith('share_')) {
      const quizId = data.replace('share_', '');
      const quiz = getQuiz(quizId);
      if (!quiz) return;
      const link = getShareableLink(quizId);
      
      bot.sendMessage(chatId,
        `🔗 *Share "${quiz.title}"*\n\n` +
        `${link}\n\n` +
        `_Forward this link to friends!_`,
        { parse_mode: 'Markdown' }
      );
    }
    // Answer question
    else if (data.startsWith('answer_')) {
      const parts = data.split('_');
      const quizId = parts[1];
      const questionIndex = parseInt(parts[2]);
      const answerIndex = parseInt(parts[3]);

      // Check if user has active quiz session
      const state = getQuizState(userId);
      if (!state || state.quiz_id !== quizId) {
        bot.answerCallbackQuery(query.id, { text: 'Quiz session expired. Please start again.', show_alert: true });
        return;
      }

      clearTimer(userId);
      await handleAnswer(chatId, userId, query.message.message_id, quizId, questionIndex, answerIndex);
    }

    bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error('Callback error:', error);
    bot.answerCallbackQuery(query.id, { text: 'An error occurred', show_alert: true });
  }
});


// ============= QUIZ LOGIC =============
async function sendQuestion(chatId, userId, quizId, questionIndex) {
  const quiz = getQuiz(quizId);
  const questions = quiz.questions;

  if (questionIndex >= questions.length) {
    await finishQuiz(chatId, userId, quizId);
    return;
  }

  const question = questions[questionIndex];

  const questionText = `📝 *${quiz.title}*\n` +
    `Question ${questionIndex + 1}/${questions.length}\n\n` +
    `${question.question}\n\n` +
    `⏱️ Time: ${QUESTION_TIME_LIMIT} seconds`;

  const keyboard = {
    inline_keyboard: question.options.map((option, index) => [
      { text: option, callback_data: `answer_${quizId}_${questionIndex}_${index}` }
    ])
  };

  const sentMessage = await bot.sendMessage(chatId, questionText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });

  const questionStartTime = Date.now();

  // Timer countdown display
  const timerInterval = setInterval(async () => {
    const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
    const remaining = Math.max(0, QUESTION_TIME_LIMIT - elapsed);

    if (remaining <= 0) {
      clearInterval(timerInterval);
      return;
    }

    const updatedText = `📝 *${quiz.title}*\n` +
      `Question ${questionIndex + 1}/${questions.length}\n\n` +
      `${question.question}\n\n` +
      `⏱️ Time: ${remaining} seconds`;

    try {
      await bot.editMessageText(updatedText, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    } catch (error) {
      clearInterval(timerInterval);
    }
  }, 5000);

  userTimers[userId] = {
    timeout: setTimeout(async () => {
      clearInterval(timerInterval);
      await handleTimeout(chatId, userId, sentMessage.message_id, quizId, questionIndex);
    }, QUESTION_TIME_LIMIT * 1000),
    interval: timerInterval
  };
}

async function handleAnswer(chatId, userId, messageId, quizId, questionIndex, answerIndex) {
  const quiz = getQuiz(quizId);
  const question = quiz.questions[questionIndex];
  const state = getQuizState(userId);
  
  // Safety check - if no state, quiz session expired
  if (!state) {
    bot.sendMessage(chatId, '⚠️ Quiz session expired. Please start again.');
    return;
  }

  const isCorrect = answerIndex === question.correct;

  clearTimer(userId);

  const userAnswers = JSON.parse(state.user_answers);
  userAnswers.push(answerIndex);

  // Simple loading animation
  const loadingFrames = ['Checking .', 'Checking ..', 'Checking ...'];
  
  for (let i = 0; i < loadingFrames.length; i++) {
    try {
      await bot.editMessageText(loadingFrames[i], {
        chat_id: chatId,
        message_id: messageId
      });
      await sleep(250);
    } catch (e) {}
  }

  if (isCorrect) {
    const feedbackText = `*Correct!*\n\n` +
      `${question.question}\n\n` +
      `Answer: ${question.options[question.correct]}`;
    
    try {
      await bot.editMessageText(feedbackText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      });
    } catch (e) {}

    updateQuizState(userId, state.current_question + 1, state.score + 1, Date.now(), userAnswers);
  } else {
    const feedbackText = `*Wrong!*\n\n` +
      `${question.question}\n\n` +
      `Your answer: ${question.options[answerIndex]}\n` +
      `Correct answer: ${question.options[question.correct]}`;
    
    try {
      await bot.editMessageText(feedbackText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown'
      });
    } catch (e) {}

    updateQuizState(userId, state.current_question + 1, state.score, Date.now(), userAnswers);
  }

  setTimeout(async () => {
    await sendQuestion(chatId, userId, quizId, questionIndex + 1);
  }, 1500);
}

async function handleTimeout(chatId, userId, messageId, quizId, questionIndex) {
  const quiz = getQuiz(quizId);
  const question = quiz.questions[questionIndex];
  const state = getQuizState(userId);

  // Safety check
  if (!state) return;

  const userAnswers = JSON.parse(state.user_answers);
  userAnswers.push(null);

  const timeoutText = `*Time's Up!*\n\n` +
    `${question.question}\n\n` +
    `Correct answer: ${question.options[question.correct]}`;

  try {
    await bot.editMessageText(timeoutText, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown'
    });
  } catch (e) {}

  updateQuizState(userId, state.current_question + 1, state.score, Date.now(), userAnswers);

  setTimeout(async () => {
    await sendQuestion(chatId, userId, quizId, questionIndex + 1);
  }, 1500);
}


async function finishQuiz(chatId, userId, quizId) {
  const state = getQuizState(userId);
  const quiz = getQuiz(quizId);
  
  // Safety check
  if (!state || !quiz) {
    bot.sendMessage(chatId, '⚠️ Quiz session not found.');
    return;
  }

  const totalTime = Math.floor((Date.now() - state.start_time) / 1000);
  const userAnswers = JSON.parse(state.user_answers);

  // Circle loading animation
  const loadingMsg = await bot.sendMessage(chatId, '◐ Calculating results...');
  const circleFrames = ['◐', '◓', '◑', '◒'];
  
  for (let i = 0; i < 8; i++) {
    try {
      await bot.editMessageText(`${circleFrames[i % 4]} Calculating results...`, {
        chat_id: chatId,
        message_id: loadingMsg.message_id
      });
      await sleep(200);
    } catch (e) {}
  }
  
  // Delete loading message
  try {
    await bot.deleteMessage(chatId, loadingMsg.message_id);
  } catch (e) {}

  const user = await bot.getChat(userId).catch(() => ({ username: 'Unknown', first_name: 'User' }));

  markUserAttempted(userId, quizId, user.username || 'Unknown', user.first_name || 'User');
  saveResult(userId, quizId, user.username || 'Unknown', user.first_name || 'User', state.score, totalTime, userAnswers);
  deleteQuizState(userId);
  clearTimer(userId);

  const totalQuestions = quiz.questions.length;
  let resultEmoji = '🎉';
  let resultMessage = 'Outstanding!';

  const percentage = (state.score / totalQuestions) * 100;
  if (percentage >= 80) {
    resultEmoji = '🏆';
    resultMessage = 'Excellent work!';
  } else if (percentage >= 60) {
    resultEmoji = '👏';
    resultMessage = 'Good job!';
  } else {
    resultEmoji = '💪';
    resultMessage = 'Keep practicing!';
  }

  const shareLink = getShareableLink(quizId);

  const resultText = `${resultEmoji} *Quiz Complete!*\n\n` +
    `${resultMessage}\n\n` +
    `📊 *Your Results:*\n` +
    `Quiz: ${quiz.title}\n` +
    `Score: ${state.score}/${totalQuestions}\n` +
    `Time: ${totalTime} seconds\n\n` +
    `🔗 Share this quiz: ${shareLink}`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '📝 Review Your Answers', callback_data: `review_${quizId}` }],
      [{ text: '🏆 View Leaderboard', callback_data: `lb_${quizId}` }],
      [{ text: '📚 More Quizzes', callback_data: 'browse_quizzes' }]
    ]
  };

  bot.sendMessage(chatId, resultText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
}

async function showReview(chatId, userId, quizId) {
  const result = getUserResult(userId, quizId);
  const quiz = getQuiz(quizId);

  if (!result) {
    bot.sendMessage(chatId, '⚠️ You haven\'t taken this quiz yet!');
    return;
  }

  const questions = quiz.questions;
  const userAnswers = JSON.parse(result.user_answers);

  let reviewText = `📝 *Review: ${quiz.title}*\n\n`;
  reviewText += `📊 Score: ${result.score}/${questions.length}\n`;
  reviewText += `⏱️ Time: ${result.total_time}s\n\n`;

  questions.forEach((q, qIndex) => {
    const userChoice = userAnswers[qIndex];
    const isCorrect = userChoice === q.correct;

    reviewText += `*Q${qIndex + 1}: ${q.question}*\n`;

    if (userChoice === null) {
      reviewText += `⏰ Time's up - No answer\n`;
    } else if (isCorrect) {
      reviewText += `✅ Your answer: ${q.options[userChoice]}\n`;
    } else {
      reviewText += `❌ Your answer: ${q.options[userChoice]}\n`;
      reviewText += `✓ Correct: ${q.options[q.correct]}\n`;
    }
    reviewText += `\n`;
  });

  bot.sendMessage(chatId, reviewText, { parse_mode: 'Markdown' });
}

async function showLeaderboard(chatId, quizId) {
  const quiz = getQuiz(quizId);
  const leaderboard = getLeaderboard(quizId);

  if (!quiz) {
    bot.sendMessage(chatId, '⚠️ Quiz not found.');
    return;
  }

  if (leaderboard.length === 0) {
    bot.sendMessage(chatId, `🏆 *Leaderboard: ${quiz.title}*\n\nNo results yet. Be the first!`, {
      parse_mode: 'Markdown'
    });
    return;
  }

  let leaderboardText = `🏆 *Leaderboard: ${quiz.title}*\n\n`;

  leaderboard.forEach((entry, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    const name = entry.first_name || entry.username || 'Anonymous';
    leaderboardText += `${medal} *${name}* - ${entry.score}/${quiz.questions.length} (${entry.total_time}s)\n`;
  });

  const shareLink = getShareableLink(quizId);
  leaderboardText += `\n🔗 Share: ${shareLink}`;

  bot.sendMessage(chatId, leaderboardText, { parse_mode: 'Markdown' });
}

// ============= ERROR HANDLING =============
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
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down bot...');
  bot.stopPolling();
  db.close();
  process.exit(0);
});

console.log('🤖 Quiz Bot is running...');
console.log(`📚 Total quizzes available: ${Object.keys(QUIZZES).length}`);
Object.keys(QUIZZES).forEach(id => {
  console.log(`   - ${id}: ${QUIZZES[id].title}`);
});
console.log(`🔗 Share links: https://t.me/${BOT_USERNAME}?start=quiz_ID`);
