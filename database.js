// Database operations
const Database = require('better-sqlite3');
const { DB_PATH } = require('./config');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent access and performance
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = -64000'); // 64MB cache

// Prepare statements once for better performance (will be initialized after tables are created)
let statements = {};

// Initialize database tables
function initDatabase() {
  // Use a single transaction for all table creation
  db.exec(`
    BEGIN TRANSACTION;
    
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER,
      quiz_id TEXT,
      username TEXT,
      first_name TEXT,
      has_attempted INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, quiz_id)
    );

    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      quiz_id TEXT,
      username TEXT,
      first_name TEXT,
      score INTEGER,
      total_time INTEGER,
      user_answers TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS active_quizzes (
      user_id INTEGER PRIMARY KEY,
      quiz_id TEXT,
      current_question INTEGER,
      score INTEGER,
      start_time INTEGER,
      question_start_time INTEGER,
      user_answers TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_results_quiz_score ON results(quiz_id, score DESC, total_time ASC);
    CREATE INDEX IF NOT EXISTS idx_results_user_quiz ON results(user_id, quiz_id);
    CREATE INDEX IF NOT EXISTS idx_users_lookup ON users(user_id, quiz_id);
    
    COMMIT;
  `);

  // Now prepare statements after tables are created
  statements = {
    hasUserAttempted: db.prepare('SELECT has_attempted FROM users WHERE user_id = ? AND quiz_id = ?'),
    markUserAttempted: db.prepare('INSERT OR REPLACE INTO users (user_id, quiz_id, username, first_name, has_attempted) VALUES (?, ?, ?, ?, 1)'),
    saveResult: db.prepare('INSERT INTO results (user_id, quiz_id, username, first_name, score, total_time, user_answers) VALUES (?, ?, ?, ?, ?, ?, ?)'),
    getUserResult: db.prepare('SELECT * FROM results WHERE user_id = ? AND quiz_id = ?'),
    getLeaderboard: db.prepare('SELECT username, first_name, score, total_time FROM results WHERE quiz_id = ? ORDER BY score DESC, total_time ASC'),
    startQuizSession: db.prepare('INSERT OR REPLACE INTO active_quizzes (user_id, quiz_id, current_question, score, start_time, question_start_time, user_answers) VALUES (?, ?, 0, 0, ?, ?, ?)'),
    getQuizState: db.prepare('SELECT * FROM active_quizzes WHERE user_id = ?'),
    updateQuizState: db.prepare('UPDATE active_quizzes SET current_question = ?, score = ?, question_start_time = ?, user_answers = ? WHERE user_id = ?'),
    deleteQuizState: db.prepare('DELETE FROM active_quizzes WHERE user_id = ?'),
    clearUserResults: db.prepare('DELETE FROM results WHERE username = ? AND quiz_id = ?'),
    clearUserAttempts: db.prepare('DELETE FROM users WHERE username = ? AND quiz_id = ?'),
    listUsers: db.prepare('SELECT username, first_name, score FROM results WHERE quiz_id = ? ORDER BY score DESC')
  };

  // Clean up any active quiz sessions on startup (bot restart)
  db.prepare('DELETE FROM active_quizzes').run();
  console.log('✓ Database initialized with WAL mode');
  console.log('✓ Cleaned up old quiz sessions');
}

// User operations
function hasUserAttempted(userId, quizId) {
  const row = statements.hasUserAttempted.get(userId, quizId);
  return row && row.has_attempted === 1;
}

function markUserAttempted(userId, quizId, username, firstName) {
  statements.markUserAttempted.run(userId, quizId, username, firstName);
}

// Result operations
function saveResult(userId, quizId, username, firstName, score, totalTime, userAnswers) {
  statements.saveResult.run(userId, quizId, username, firstName, score, totalTime, JSON.stringify(userAnswers));
}

function getUserResult(userId, quizId) {
  return statements.getUserResult.get(userId, quizId);
}

function getLeaderboard(quizId) {
  return statements.getLeaderboard.all(quizId);
}

// Quiz session operations
function startQuizSession(userId, quizId) {
  const now = Date.now();
  statements.startQuizSession.run(userId, quizId, now, now, JSON.stringify([]));
}

function getQuizState(userId) {
  return statements.getQuizState.get(userId);
}

function updateQuizState(userId, currentQuestion, score, questionStartTime, userAnswers) {
  statements.updateQuizState.run(currentQuestion, score, questionStartTime, JSON.stringify(userAnswers), userId);
}

function deleteQuizState(userId) {
  statements.deleteQuizState.run(userId);
}

// Admin operations
function clearUserData(username, quizId) {
  const transaction = db.transaction(() => {
    statements.clearUserResults.run(username, quizId);
    statements.clearUserAttempts.run(username, quizId);
  });
  transaction();
}

function listUsers(quizId) {
  return statements.listUsers.all(quizId);
}

// Get combined leaderboard across all quizzes
function getCombinedLeaderboard() {
  const query = `
    SELECT 
      user_id,
      username,
      first_name,
      SUM(score) as total_score,
      COUNT(DISTINCT quiz_id) as quizzes_taken
    FROM results
    GROUP BY user_id
    ORDER BY total_score DESC, quizzes_taken DESC
  `;
  return db.prepare(query).all();
}

// Get top player (highest combined score)
function getTopPlayer() {
  const query = `
    SELECT 
      username,
      first_name,
      SUM(score) as total_score,
      COUNT(DISTINCT quiz_id) as quizzes_taken
    FROM results
    GROUP BY user_id
    ORDER BY total_score DESC, quizzes_taken DESC
    LIMIT 1
  `;
  return db.prepare(query).get();
}

// Get user's total statistics
function getUserTotalStats(userId) {
  const query = `
    SELECT 
      SUM(score) as total_score,
      COUNT(DISTINCT quiz_id) as quizzes_taken
    FROM results
    WHERE user_id = ?
  `;
  return db.prepare(query).get(userId);
}

// Get quiz IDs that a user has taken
function getUserQuizIds(userId) {
  const query = `SELECT DISTINCT quiz_id FROM results WHERE user_id = ? ORDER BY timestamp`;
  return db.prepare(query).all(userId).map(row => row.quiz_id);
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
  getCombinedLeaderboard,
  getTopPlayer,
  getUserTotalStats,
  getUserQuizIds,
  startQuizSession,
  getQuizState,
  updateQuizState,
  deleteQuizState,
  clearUserData,
  listUsers,
  closeDatabase
};
