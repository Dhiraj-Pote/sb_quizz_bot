// Database operations
const Database = require('better-sqlite3');
const { DB_PATH } = require('./config');

const db = new Database(DB_PATH);

// Initialize database tables
function initDatabase() {
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

  // Create indexes for better query performance
  db.exec(`CREATE INDEX IF NOT EXISTS idx_results_quiz_score ON results(quiz_id, score DESC, total_time ASC)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_results_user_quiz ON results(user_id, quiz_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_users_lookup ON users(user_id, quiz_id)`);

  // Clean up any active quiz sessions on startup (bot restart)
  // This prevents "session expired" errors from old sessions
  db.prepare('DELETE FROM active_quizzes').run();
  console.log('✓ Cleaned up old quiz sessions');
  console.log('✓ Database indexes created');
}

// User operations
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

// Result operations
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

// Quiz session operations
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

// Admin operations
function clearUserData(username, quizId) {
  db.prepare('DELETE FROM results WHERE username = ? AND quiz_id = ?').run(username, quizId);
  db.prepare('DELETE FROM users WHERE username = ? AND quiz_id = ?').run(username, quizId);
}

function listUsers(quizId) {
  return db.prepare('SELECT username, first_name, score FROM results WHERE quiz_id = ? ORDER BY score DESC').all(quizId);
}

function closeDatabase() {
  db.close();
}

module.exports = {
  initDatabase,
  hasUserAttempted,
  markUserAttempted,
  saveResult,
  getUserResult,
  getLeaderboard,
  startQuizSession,
  getQuizState,
  updateQuizState,
  deleteQuizState,
  clearUserData,
  listUsers,
  closeDatabase
};
