-- Śrīmad Bhāgavatam Quiz Platform - Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- CANTOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.cantos (
    id SERIAL PRIMARY KEY,
    number INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    sanskrit_title TEXT,
    description TEXT,
    total_chapters INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CHAPTERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.chapters (
    id TEXT PRIMARY KEY, -- e.g., 'canto_3_chapter_17'
    canto_id INTEGER REFERENCES public.cantos(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    sanskrit_title TEXT,
    description TEXT,
    is_live BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(canto_id, chapter_number)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chapters_canto ON public.chapters(canto_id);
CREATE INDEX IF NOT EXISTS idx_chapters_live ON public.chapters(is_live);

-- ============================================
-- QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of option strings
    correct_option INTEGER NOT NULL, -- Index of correct answer (0-3)
    explanation TEXT,
    verse_reference TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON public.questions(chapter_id);

-- ============================================
-- QUIZ RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_taken INTEGER NOT NULL, -- in seconds
    user_answers JSONB NOT NULL, -- Array of answer indices (null for timeout)
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_results_chapter_score 
    ON public.quiz_results(chapter_id, score DESC, time_taken ASC);
CREATE INDEX IF NOT EXISTS idx_results_user 
    ON public.quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_results_completed 
    ON public.quiz_results(completed_at DESC);

-- Enable RLS
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Policies for quiz_results
CREATE POLICY "Quiz results are viewable by everyone"
    ON public.quiz_results FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own results"
    ON public.quiz_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- VIEWS FOR LEADERBOARDS
-- ============================================

-- Chapter Leaderboard View
CREATE OR REPLACE VIEW public.chapter_leaderboard AS
SELECT 
    qr.id,
    qr.chapter_id,
    qr.user_id,
    p.display_name,
    p.avatar_url,
    qr.score,
    qr.total_questions,
    qr.time_taken,
    qr.completed_at,
    ROW_NUMBER() OVER (
        PARTITION BY qr.chapter_id 
        ORDER BY qr.score DESC, qr.time_taken ASC
    ) as rank
FROM public.quiz_results qr
JOIN public.profiles p ON qr.user_id = p.id;

-- Maha (Overall) Leaderboard View
CREATE OR REPLACE VIEW public.maha_leaderboard AS
SELECT 
    p.id as user_id,
    p.display_name,
    p.avatar_url,
    SUM(qr.score) as total_score,
    SUM(qr.total_questions) as total_questions,
    COUNT(DISTINCT qr.chapter_id) as quizzes_completed,
    AVG(qr.time_taken)::INTEGER as average_time
FROM public.profiles p
JOIN public.quiz_results qr ON p.id = qr.user_id
GROUP BY p.id, p.display_name, p.avatar_url
ORDER BY total_score DESC, average_time ASC;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for quiz_results (for live leaderboard updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_results;

-- ============================================
-- SEED DATA: CANTOS
-- ============================================
INSERT INTO public.cantos (number, title, sanskrit_title, total_chapters) VALUES
(1, 'Creation', 'Sṛṣṭi', 19),
(2, 'The Cosmic Manifestation', 'Viśva-sṛṣṭi', 10),
(3, 'The Status Quo', 'Yathāvasthita', 33),
(4, 'The Creation of the Fourth Order', 'Caturtha-sarga', 31),
(5, 'The Creative Impetus', 'Sṛṣṭi-kāraṇa', 26),
(6, 'Prescribed Duties for Mankind', 'Puṁsāṁ Vṛtti', 19),
(7, 'The Science of God', 'Bhagavat-vijñāna', 15),
(8, 'Withdrawal of the Cosmic Creations', 'Pralaya', 24),
(9, 'Liberation', 'Mukti', 24),
(10, 'The Summum Bonum', 'Āśraya', 90),
(11, 'General History', 'Sāmānya-itihāsa', 31),
(12, 'The Age of Deterioration', 'Kali-yuga', 13)
ON CONFLICT (number) DO NOTHING;

-- ============================================
-- SEED DATA: SAMPLE CHAPTERS (Canto 3)
-- ============================================
INSERT INTO public.chapters (id, canto_id, chapter_number, title, sanskrit_title, description, is_live) VALUES
('canto_3_chapter_17', 3, 17, 'Victory of Hiraṇyākṣa Over All the Directions of the Universe', 'Hiraṇyākṣa Digvijaya', 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 17', true),
('canto_3_chapter_18', 3, 18, 'The Battle Between Lord Boar and the Demon Hiraṇyākṣa', 'Varāha-Hiraṇyākṣa Yuddha', 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 18', true),
('canto_3_chapter_19', 3, 19, 'The Killing of the Demon Hiraṇyākṣa', 'Hiraṇyākṣa-vadha', 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 19', true),
('canto_3_chapter_20', 3, 20, 'Conversation Between Maitreya and Vidura', 'Maitreya-Vidura Saṁvāda', 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 20', true)
ON CONFLICT (id) DO NOTHING;

-- Note: Questions should be inserted separately or via the admin interface
-- The quiz data from quizData.ts can be migrated using a script
