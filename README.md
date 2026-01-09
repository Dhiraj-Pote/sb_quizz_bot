# Telegram Quiz Bot - Modular Structure

## Project Structure

```
├── bot.js                  # Main entry point - initializes bot and handlers
├── config.js               # Configuration and constants
├── database.js             # Database operations and queries
├── quizData.js             # Quiz content and data
├── quizLogic.js            # Quiz game logic (questions, answers, timers)
├── commandHandlers.js      # Bot command handlers (/start, /quizzes, etc.)
├── callbackHandlers.js     # Inline button callback handlers
├── menuHandlers.js         # Menu and UI display functions
├── utils.js                # Utility functions
├── package.json            # Dependencies
└── quiz.db                 # SQLite database
```

## Module Descriptions

### bot.js
Main entry point that:
- Initializes the database
- Creates the bot instance
- Sets up command and callback handlers
- Handles graceful shutdown

### config.js
Contains all configuration constants:
- Bot token and username
- Admin username
- Question time limit
- Database path

### database.js
All database operations:
- Table initialization
- User attempt tracking
- Result storage and retrieval
- Leaderboard queries
- Quiz session management
- Admin operations

### quizData.js
Quiz content management:
- Quiz definitions with questions
- Quiz retrieval functions
- Quiz listing

### quizLogic.js
Core quiz gameplay:
- Question display with timers
- Answer validation
- Timeout handling
- Quiz completion and scoring
- Timer management

### commandHandlers.js
Bot command handlers:
- `/start` - Main menu or deep link
- `/quizzes` - List all quizzes
- `/share` - Get shareable link
- `/leaderboard` - View leaderboards
- `/clearuser` - Admin: clear user data
- `/listusers` - Admin: list users

### callbackHandlers.js
Inline button handlers:
- Browse quizzes
- Start quiz
- View leaderboard
- Review answers
- Share quiz
- Answer questions

### menuHandlers.js
UI display functions:
- Main menu
- Quiz list
- Quiz details
- Answer review
- Leaderboard display

### utils.js
Helper functions:
- Generate shareable links
- Sleep/delay function

## Running the Bot

```bash
node bot.js
```

## Adding New Quizzes

Edit `quizData.js` and add a new quiz object to the `QUIZZES` constant:

```javascript
'quiz_3_23': {
  id: 'quiz_3_23',
  title: 'SB Canto 3 Chapter 23',
  description: 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 23',
  createdDate: '2025-01-09',
  live: true,
  questions: [
    {
      question: "Your question?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0  // Index of correct answer (0-3)
    }
  ]
}
```

## Benefits of Modular Structure

1. **Maintainability** - Each module has a single responsibility
2. **Testability** - Individual modules can be tested in isolation
3. **Scalability** - Easy to add new features without affecting existing code
4. **Readability** - Clear separation of concerns
5. **Reusability** - Functions can be reused across modules
6. **Debugging** - Easier to locate and fix issues
