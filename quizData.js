// Quiz Library - All quiz data
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

function getQuiz(quizId) {
  return QUIZZES[quizId] || null;
}

function getAllQuizzes() {
  return Object.values(QUIZZES);
}

function getAvailableQuizzes() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison
  
  return Object.values(QUIZZES).filter(quiz => {
    const quizDate = new Date(quiz.createdDate);
    quizDate.setHours(0, 0, 0, 0);
    return quizDate <= today; // Only show quizzes from today or earlier
  });
}

module.exports = {
  QUIZZES,
  getQuiz,
  getAllQuizzes,
  getAvailableQuizzes
};
