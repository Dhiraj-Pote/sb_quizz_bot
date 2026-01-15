# Deployment Guide - New Bot Credentials

## New Bot Information
- **Bot Name**: Bhagavatam Quiz Bot
- **Username**: @Bhagavatam_quiz_bot
- **Bot Link**: https://t.me/Bhagavatam_quiz_bot
- **Token**: `8350271241:AAE5BmxK_3BRXKjbOB1xbwxuwsyiTZsPMQc`

## Railway Environment Variables

Set these in your Railway project dashboard under **Variables** tab:

```
BOT_TOKEN=8350271241:AAE5BmxK_3BRXKjbOB1xbwxuwsyiTZsPMQc
BOT_USERNAME=Bhagavatam_quiz_bot
ADMIN_USERNAMES=ys16108
DB_PATH=./quiz.db
```

## Deployment Steps

1. **Update Railway Variables**:
   - Go to Railway dashboard → Your project
   - Click "Variables" tab
   - Add/Update the variables above
   - Railway will auto-redeploy

2. **Push Code Changes**:
   ```bash
   git add .
   git commit -m "Update bot credentials to new bot"
   git push
   ```

3. **Verify Deployment**:
   - Check Railway logs for "🤖 Quiz Bot is running..."
   - Test bot: https://t.me/Bhagavatam_quiz_bot
   - Send `/start` command

## Share Links

New shareable quiz links format:
```
https://t.me/Bhagavatam_quiz_bot?start=quiz_3_23
https://t.me/Bhagavatam_quiz_bot?start=quiz_3_24
https://t.me/Bhagavatam_quiz_bot?start=quiz_3_25
```

## About Previous Leaderboard Data

**Important**: The leaderboard data is stored in `quiz.db` file on Railway.

- **If Railway volume persists**: Old data will remain
- **If Railway redeployed fresh**: Database will be empty (fresh start)
- **Database location**: Railway stores it in `/app/quiz.db`

Since you're on Railway free tier, the database likely resets on each deploy. To preserve data across deploys, you would need:
- Railway Pro with Volumes, OR
- External database (PostgreSQL/MySQL)

For now, each deployment starts with a fresh database.

## Security Notes

⚠️ **NEVER commit the bot token to Git**
- Token is now only in Railway environment variables
- Code uses `process.env.BOT_TOKEN` (no hardcoded values)
- `.env.example` shows structure but not real credentials

## Testing Checklist

- [ ] Bot responds to `/start`
- [ ] `/quizzes` shows all 3 quizzes
- [ ] Can start and complete a quiz
- [ ] Leaderboard displays correctly
- [ ] Share links work
- [ ] Admin commands work (if you're admin)
