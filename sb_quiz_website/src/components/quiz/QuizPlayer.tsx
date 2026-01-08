'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import type { Quiz, QuizQuestion } from '@/data/quizData';
import QuizResults from './QuizResults';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete?: (score: number, timeSpent: number, answers: (number | null)[]) => void;
}

const QUESTION_TIME_LIMIT = 60; // seconds

export default function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestion) / totalQuestions) * 100;

  // Handle answer submission
  const handleAnswer = useCallback((answerIndex: number | null) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === question.correct;
    const newAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newAnswers);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion + 1 >= totalQuestions) {
        // Quiz complete
        const endTime = Date.now();
        const timeSpent = Math.floor((endTime - startTime) / 1000);
        setTotalTime(timeSpent);
        setIsComplete(true);
        onComplete?.(isCorrect ? score + 1 : score, timeSpent, newAnswers);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(QUESTION_TIME_LIMIT);
        setIsTimedOut(false);
      }
    }, 2000);
  }, [showFeedback, question.correct, userAnswers, currentQuestion, totalQuestions, startTime, score, onComplete]);

  // Timer effect
  useEffect(() => {
    if (showFeedback || isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimedOut(true);
          handleAnswer(null); // Time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, showFeedback, isComplete, handleAnswer]);

  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setIsComplete(false);
    setIsTimedOut(false);
  };

  if (isComplete) {
    return (
      <QuizResults
        quiz={quiz}
        score={score}
        totalTime={totalTime}
        userAnswers={userAnswers}
        onRetry={resetQuiz}
      />
    );
  }

  const getOptionClass = (index: number) => {
    if (!showFeedback) {
      return selectedAnswer === index ? 'selected' : '';
    }
    if (index === question.correct) return 'correct';
    if (index === selectedAnswer && selectedAnswer !== question.correct) return 'incorrect';
    return '';
  };

  const timerColor = timeLeft <= 10 ? 'text-red-500' : timeLeft <= 30 ? 'text-orange-500' : 'text-gray-600';
  const timerClass = timeLeft <= 10 ? 'timer-warning' : '';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Header */}
      <div className="card-sacred p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-sm text-gray-500">Question</span>
            <span className="ml-2 font-bold text-lg text-gray-800">
              {currentQuestion + 1} / {totalQuestions}
            </span>
          </div>
          <div className={`flex items-center gap-2 ${timerColor} ${timerClass}`}>
            <Clock size={20} />
            <span className="font-mono font-bold text-xl">{timeLeft}s</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="card-sacred p-6 mb-6 slide-up">
        {/* Quiz Title */}
        <div className="text-sm text-orange-600 font-medium mb-4">
          Canto {quiz.cantoNumber} • Chapter {quiz.chapterNumber}
        </div>

        {/* Question */}
        <h2 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showFeedback && handleAnswer(index)}
              disabled={showFeedback}
              className={`option-btn ${getOptionClass(index)}`}
            >
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-700 pt-1">{option}</span>
                {showFeedback && index === question.correct && (
                  <CheckCircle className="ml-auto text-green-500 shrink-0" size={24} />
                )}
                {showFeedback && index === selectedAnswer && selectedAnswer !== question.correct && (
                  <XCircle className="ml-auto text-red-500 shrink-0" size={24} />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-xl fade-in ${
            selectedAnswer === question.correct 
              ? 'bg-green-50 border border-green-200' 
              : isTimedOut
                ? 'bg-orange-50 border border-orange-200'
                : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {selectedAnswer === question.correct ? (
                <>
                  <CheckCircle className="text-green-500" size={24} />
                  <span className="font-bold text-green-700">Correct!</span>
                </>
              ) : isTimedOut ? (
                <>
                  <Clock className="text-orange-500" size={24} />
                  <span className="font-bold text-orange-700">Time&apos;s Up!</span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-500" size={24} />
                  <span className="font-bold text-red-700">Incorrect</span>
                </>
              )}
            </div>
            {selectedAnswer !== question.correct && (
              <p className="text-gray-600 text-sm">
                The correct answer is: <strong>{question.options[question.correct]}</strong>
              </p>
            )}
            {question.explanation && (
              <p className="text-gray-600 text-sm mt-2 italic">{question.explanation}</p>
            )}
          </div>
        )}
      </div>

      {/* Score Display */}
      <div className="text-center text-gray-500">
        Current Score: <span className="font-bold text-orange-600">{score}</span> / {currentQuestion + (showFeedback ? 1 : 0)}
      </div>
    </div>
  );
}
