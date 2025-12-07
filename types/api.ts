// User Types
export interface User {
  id: string
  name: string
  phoneNumber: string
  email?: string
  role: 'user' | 'admin'
  points: number
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export interface LoginRequest {
  phoneNumber: string
  password: string
}

export interface RegisterRequest {
  name: string
  phoneNumber: string
  password: string
}

export interface VerifyOTPRequest {
  phoneNumber: string
  code: string
}

export interface ResendOTPRequest {
  phoneNumber: string
}

// Category Types
export interface Category {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface CategoriesResponse {
  success: boolean
  count: number
  data: Category[]
}

// Article Types
export interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  category?: Category
  createdAt: string
  updatedAt: string
  hasRead?: boolean
}

export interface ArticlesResponse {
  success: boolean
  count: number
  data: Article[]
}

export interface ArticleResponse {
  success: boolean
  data: Article
}

// Survey Types (MCQ after article)
export interface SurveyOption {
  id: string
  optionText: string
}

export interface SurveyQuestion {
  id: string
  questionText: string
  options: SurveyOption[]
}

export interface Survey {
  id: string
  articleId: string
  title: string
  questions: SurveyQuestion[]
}

export interface SurveyResponse {
  success: boolean
  data: Survey
}

export interface SurveyAnswer {
  questionId: string
  optionId: string
}

export interface SurveySubmitRequest {
  answers: SurveyAnswer[]
}

export interface SurveySubmitResponse {
  success: boolean
  message: string
  data: {
    points: number
    percentage: number
    passed: boolean
    correctAnswers: number
    totalQuestions: number
  }
}

// Discussion Session Types
export interface DiscussionAttendance {
  id: string
  userId: string
  attended: boolean
}

export interface DiscussionAdmin {
  id: string
  name: string
}

export interface Discussion {
  id: string
  title: string
  description: string
  meetLink: string
  dateTime: string
  pointsReward: number
  adminId: string
  createdAt: string
  updatedAt: string
  admin: DiscussionAdmin
  attendances: DiscussionAttendance[]
}

export interface DiscussionsResponse {
  success: boolean
  count: number
  data: Discussion[]
}

// Poll Types (for discussion sessions)
export interface PollOption {
  id: string
  optionText: string
  voteCount: number
}

export interface SessionPoll {
  id: string
  sessionId: string
  title: string
  endDate: string
  isActive: boolean
  pointsReward: number
  createdAt: string
  updatedAt: string
  options: PollOption[]
}

export interface SessionPollResponse {
  success: boolean
  data: SessionPoll
}

export interface PollVoteRequest {
  optionId: string
}

export interface PollVoteResponse {
  success: boolean
  message: string
  data: {
    points: number
  }
}

// Discussion Meet Link Types
export interface MeetLinkResponse {
  success: boolean
  message?: string
  data?: {
    sessionId: string
    title: string
    meetLink: string
    dateTime: string
  }
}

// Game Types
export type GameType = 'puzzle' | 'crossword'
export type GameDifficulty = 'easy' | 'medium' | 'hard'

export interface PuzzleData {
  imageUrl: string
  pieces: number
  solution?: string
}

export interface CrosswordWord {
  number: number
  direction: 'across' | 'down'
  question: string
  answer: string
  position: {
    row: number
    col: number
  }
}

export interface CrosswordClue {
  clue: string
  answer: string
  position: {
    row: number
    col: number
  }
}

export interface CrosswordData {
  words?: CrosswordWord[]
  grid?: string[][]
  clues?: {
    across?: string[]
    down?: string[]
  }
}

export interface Game {
  id: string
  type: GameType
  title: string
  content: string
  educationalMessage: string
  pointsReward: number
  createdAt: string
  updatedAt: string
  isCompleted?: boolean
}

export interface GamesResponse {
  success: boolean
  count: number
  data: Game[]
}

export interface GameResponse {
  success: boolean
  data: Game
}

export interface UserGameHistory {
  id: string
  userId: string
  gameId: string
  completed: boolean
  pointsEarned: number
  completedAt: string
  createdAt: string
  updatedAt: string
  game: {
    id: string
    type: GameType
    title: string
    educationalMessage: string
  }
}

export interface UserGameHistoryResponse {
  success: boolean
  count: number
  totalPoints: number
  data: UserGameHistory[]
}

export interface GameCompleteRequest {
  score: number
  completionTime: number
}

// User Activity Types
export interface UserActivity {
  articlesRead: {
    articleId: string
    articleTitle: string
    completedAt: string
    surveyPassed: boolean
  }[]
  puzzlesSolved: {
    gameId: string
    gameTitle: string
    completedAt: string
  }[]
  crosswordsSolved: {
    gameId: string
    gameTitle: string
    completedAt: string
  }[]
  pollsVoted: {
    pollId: string
    pollQuestion: string
    votedAt: string
  }[]
  meetingsAttended: {
    sessionId: string
    sessionTitle: string
    attendedAt: string
  }[]
}

export interface UserPointsResponse {
  success: boolean
  data: {
    id: string
    name: string
    points: number
    rank: number
  }
}

export interface UserDetailsResponse {
  success: boolean
  data: {
    id: string
    name: string
    phoneNumber: string
    isPhoneVerified?: boolean
    points: number
    role: string
    createdAt: string
    updatedAt: string
  }
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  phoneNumber: string
  points: number
  memberSince: string
}

export interface LeaderboardResponse {
  success: boolean
  count: number
  data: LeaderboardEntry[]
}

// API Error
export interface APIError {
  message: string
  errors?: { [key: string]: string[] }
}
