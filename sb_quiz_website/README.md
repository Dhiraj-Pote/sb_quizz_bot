# Śrīmad Bhāgavatam Quiz Platform 🙏

A beautiful, interactive quiz platform for ISKCON devotees to test their knowledge of Śrīmad Bhāgavatam. Built with Next.js, Tailwind CSS, and Supabase.

![Quiz Platform](https://img.shields.io/badge/Made%20with-Love-red?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square)

## ✨ Features

- 📚 **Chapter-wise Quizzes** - Organized by all 12 Cantos
- ⏱️ **Timed Questions** - 60 seconds per question
- 🏆 **Real-time Leaderboards** - Per-chapter and overall (Mahā) rankings
- 📝 **Answer Review** - See correct answers with explanations
- 👤 **User Profiles** - Track your progress over time
- 📱 **Mobile Responsive** - Beautiful on all devices
- 🎨 **Sacred Design** - Saffron and gold color scheme inspired by ISKCON

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account (free tier works!)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sb_quiz_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the schema from `supabase/schema.sql`
   - Copy your project URL and anon key from Settings > API

4. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
sb_quiz_website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── quizzes/           # Quiz listing
│   │   ├── quiz/[id]/         # Quiz player
│   │   ├── leaderboard/       # Leaderboards
│   │   └── profile/           # User profile
│   ├── components/
│   │   ├── ui/                # Header, Footer, etc.
│   │   ├── quiz/              # QuizCard, QuizPlayer, QuizResults
│   │   └── leaderboard/       # LeaderboardTable
│   ├── data/
│   │   └── quizData.ts        # Quiz content (migrated from Telegram bot)
│   ├── lib/
│   │   └── supabase/          # Supabase client setup
│   └── types/
│       └── database.ts        # TypeScript types
├── supabase/
│   └── schema.sql             # Database schema
└── public/                    # Static assets
```

## 🗄️ Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends Supabase auth) |
| `cantos` | 12 Cantos of Śrīmad Bhāgavatam |
| `chapters` | Chapters within each Canto |
| `questions` | Quiz questions with options |
| `quiz_results` | User quiz attempts and scores |

### Views

- `chapter_leaderboard` - Rankings per chapter
- `maha_leaderboard` - Overall rankings across all quizzes

## 🎨 Design System

The UI uses a sacred color palette:

- **Saffron** (#FF9933) - Primary actions, highlights
- **Gold** (#FFD700) - Achievements, medals
- **Cream** (#FFF8E7) - Background
- **Peacock Blue** (#00838F) - Accents
- **Tulsi Green** (#2E7D32) - Success states

## 🔧 Configuration

### Quiz Settings

Edit `src/data/quizData.ts` to:
- Add new quizzes
- Modify questions
- Set quiz visibility (`live: true/false`)

### Time Limit

Change `QUESTION_TIME_LIMIT` in `src/components/quiz/QuizPlayer.tsx`:
```typescript
const QUESTION_TIME_LIMIT = 60; // seconds
```

## 📦 Deployment

### Vercel (Recommended - Free)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

Works with any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📜 License

This project is created for the service of Śrīla Prabhupāda and ISKCON devotees.

---

**Hare Kṛṣṇa! 🙏**

*"One who knows the transcendental nature of My appearance and activities does not, upon leaving the body, take his birth again in this material world, but attains My eternal abode."* — Bhagavad-gītā 4.9
