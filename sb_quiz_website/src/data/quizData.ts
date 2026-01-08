// Quiz Data - Migrated from Telegram Bot
// This serves as initial data and can be synced to Supabase

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  verseReference?: string;
}

export interface Quiz {
  id: string;
  cantoNumber: number;
  chapterNumber: number;
  title: string;
  sanskritTitle?: string;
  description: string;
  createdDate: string;
  live: boolean;
  questions: QuizQuestion[];
}

export const CANTOS = [
  { number: 1, title: 'Creation', sanskritTitle: 'Sṛṣṭi', chapters: 19 },
  { number: 2, title: 'The Cosmic Manifestation', sanskritTitle: 'Viśva-sṛṣṭi', chapters: 10 },
  { number: 3, title: 'The Status Quo', sanskritTitle: 'Yathāvasthita', chapters: 33 },
  { number: 4, title: 'The Creation of the Fourth Order', sanskritTitle: 'Caturtha-sarga', chapters: 31 },
  { number: 5, title: 'The Creative Impetus', sanskritTitle: 'Sṛṣṭi-kāraṇa', chapters: 26 },
  { number: 6, title: 'Prescribed Duties for Mankind', sanskritTitle: 'Puṁsāṁ Vṛtti', chapters: 19 },
  { number: 7, title: 'The Science of God', sanskritTitle: 'Bhagavat-vijñāna', chapters: 15 },
  { number: 8, title: 'Withdrawal of the Cosmic Creations', sanskritTitle: 'Pralaya', chapters: 24 },
  { number: 9, title: 'Liberation', sanskritTitle: 'Mukti', chapters: 24 },
  { number: 10, title: 'The Summum Bonum', sanskritTitle: 'Āśraya', chapters: 90 },
  { number: 11, title: 'General History', sanskritTitle: 'Sāmānya-itihāsa', chapters: 31 },
  { number: 12, title: 'The Age of Deterioration', sanskritTitle: 'Kali-yuga', chapters: 13 },
];

export const QUIZZES: Record<string, Quiz> = {
  'canto_3_chapter_17': {
    id: 'canto_3_chapter_17',
    cantoNumber: 3,
    chapterNumber: 17,
    title: 'Victory of Hiraṇyākṣa Over All the Directions of the Universe',
    sanskritTitle: 'Hiraṇyākṣa Digvijaya',
    description: 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 17',
    createdDate: '2025-12-23',
    live: true,
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
  'canto_3_chapter_18': {
    id: 'canto_3_chapter_18',
    cantoNumber: 3,
    chapterNumber: 18,
    title: 'The Battle Between Lord Boar and the Demon Hiraṇyākṣa',
    sanskritTitle: 'Varāha-Hiraṇyākṣa Yuddha',
    description: 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 18',
    createdDate: '2025-12-24',
    live: true,
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
  'canto_3_chapter_19': {
    id: 'canto_3_chapter_19',
    cantoNumber: 3,
    chapterNumber: 19,
    title: 'The Killing of the Demon Hiraṇyākṣa',
    sanskritTitle: 'Hiraṇyākṣa-vadha',
    description: 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 19',
    createdDate: '2025-12-25',
    live: true,
    questions: [
      {
        question: "What spiritual benefit is gained by hearing or telling this story?",
        options: ["They will gain the physical strength of a boar.", "They will never face any financial loss.", "They are freed from even the sin of killing a brahmana and gain Vaikuṇṭha.", "They will become the next Lord Brahma."],
        correct: 2
      },
      {
        question: "Why did Brahmā call Hiraṇyākṣa 'blessed'?",
        options: ["Because his brother would eventually avenge him.", "Because he died while seeing the face of the Supreme Lord.", "Because he was the strongest demon to ever live.", "Because he was granted a place in the sun planet."],
        correct: 1
      },
      {
        question: "How was Hiraṇyākṣa finally killed by the Lord?",
        options: ["By the striking of His mace", "By the Sudarśana Cakra", "By a simple slap at the root of the ear", "By the crushing of His forefeet"],
        correct: 2
      },
      {
        question: "How did the Lord feel the impact of the demon's hard fist?",
        options: ["Like a mountain struck by a thunderbolt", "Like an elephant struck by flowers", "It caused Him great pain", "He felt a slight scratch on His chest"],
        correct: 1
      },
      {
        question: "What did Hiraṇyākṣa do when all his weapons were broken and his magic failed?",
        options: ["He tried to crush the Lord in embrace.", "He begged for a boon of immortality.", "He dove back into the depths of the ocean to hide.", "He threw a mountain at the Lord."],
        correct: 0
      },
      {
        question: "How did the Lord bring an end to all the demon's mystic conjuring tricks?",
        options: ["By drinking the rain of blood and pus.", "By blowing His conchshell, the Pāñcajanya.", "By striking the ground with His hoof.", "By casting His Sudarśana Cakra."],
        correct: 3
      },
      {
        question: "How did Hiraṇyākṣa react when the Lord stood before him unarmed after losing His mace?",
        options: ["He laughed and tried to grab the Earth.", "He immediately struck the Lord's chest.", "He respected the laws of combat and did not strike.", "He surrendered out of respect for the Lord's bravery."],
        correct: 2
      },
      {
        question: "What distinguishes the Lord from the inhabitants of Vaikuṇṭha?",
        options: ["They have distinct bodily form", "His wearing of a golden Mukuta", "His wearing of a peacock feather", "The Śrīvatsa mark on His chest"],
        correct: 3
      }
    ]
  },
  'canto_3_chapter_20': {
    id: 'canto_3_chapter_20',
    cantoNumber: 3,
    chapterNumber: 20,
    title: 'Conversation Between Maitreya and Vidura',
    sanskritTitle: 'Maitreya-Vidura Saṁvāda',
    description: 'Śrīmad Bhāgavatam Quiz - Canto 3 Chapter 20',
    createdDate: '2025-12-26',
    live: true,
    questions: [
      {
        question: "What happened to Brahmā's body when his sons, the Kumāras, refused to follow his orders?",
        options: ["He became filled with a terrible anger that he tried to suppress.", "He immediately gave up his life and took a new body.", "He laughed at their determination.", "He fell into a deep sleep out of disappointment."],
        correct: 0
      },
      {
        question: "Who was born from between the eyebrows of Brahmā as a result of his suppressed anger?",
        options: ["Lord Rudra (Śiva)", "Nārada Muni", "Dakṣa", "Kardama Muni"],
        correct: 0
      },
      {
        question: "Which group of beings was created from Brahmā's 'shining' and 'jovial' form, associated with the daytime?",
        options: ["The ghosts and spirits.", "The Demigods (Devas).", "The Rakshasas (Man-eaters).", "The Pitṛs (Ancestors)."],
        correct: 1
      },
      {
        question: "From which part of Brahmā were the sages (like Marīci, Atri, and Vasiṣṭha) born?",
        options: ["From various limbs and parts of his body.", "From his breath (Prāna).", "From his hair.", "From his tears."],
        correct: 0
      },
      {
        question: "When the Yakṣas and Rākṣasas were born, what was their immediate reaction toward Brahma?",
        options: ["They offered him prayers and flowers.", "They ran to Eat him out of extreme hunger and thirst.", "They asked him for a kingdom to rule.", "They immediately began performing severe penance."],
        correct: 1
      },
      {
        question: "What entities were created from the hair that dropped from Brahma's body while he was crawling in a frustrated state?",
        options: ["Birds and flying insects.", "Ferocious snakes and cobras (Nāgas).", "The forest trees and medicinal herbs.", "Small animals like rabbits and deer."],
        correct: 1
      },
      {
        question: "From which part of Brahma's body were the ghosts (Bhūtas) and fiends (Piśācas) evolved?",
        options: ["From his sloth and laziness.", "From his laughter.", "From his shadow.", "From his fingernails."],
        correct: 0
      },
      {
        question: "The more one is free from the desire for sex, the more he is promoted to the level of the demigods.",
        options: ["True", "False"],
        correct: 0
      }
    ]
  }
};

// Helper functions
export function getQuiz(quizId: string): Quiz | null {
  return QUIZZES[quizId] || null;
}

export function getAllQuizzes(): Quiz[] {
  return Object.values(QUIZZES);
}

export function getAvailableQuizzes(): Quiz[] {
  return Object.values(QUIZZES).filter(quiz => quiz.live);
}

export function getQuizzesByCanto(cantoNumber: number): Quiz[] {
  return Object.values(QUIZZES).filter(quiz => quiz.cantoNumber === cantoNumber && quiz.live);
}

export function getCantoInfo(cantoNumber: number) {
  return CANTOS.find(c => c.number === cantoNumber);
}
