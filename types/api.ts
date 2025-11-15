// User Types
export interface User {
  id: string
  name: string
  email: string
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
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
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
  isCorrect: boolean
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
  createdAt: string
  updatedAt: string
}

export interface SurveyResponse {
  survey: Survey
}

export interface SurveyAnswer {
  questionId: string
  optionId: string
}

export interface SurveySubmitRequest {
  answers: SurveyAnswer[]
}

export interface SurveyResult {
  score: number
  totalQuestions: number
  percentage: number
  passed: boolean
  pointsEarned: number
}

export interface SurveyResultResponse {
  result: SurveyResult
  userAnswers?: {
    questionId: string
    selectedOptionId: string
    isCorrect: boolean
  }[]
}

// Poll Types (for voting on problems)
export interface Poll {
  id: string
  question: string
  options: string[]
  votes: { [option: string]: number }
  endDate: string
  createdAt: string
  updatedAt: string
  hasVoted?: boolean
  userVote?: string
}

export interface PollsResponse {
  polls: Poll[]
}

export interface PollResponse {
  poll: Poll
}

export interface PollVoteRequest {
  option: string
}

export interface PollResultsResponse {
  results: {
    option: string
    votes: number
    percentage: number
  }[]
  totalVotes: number
}

// Discussion Session Types (Google Meet)
export interface DiscussionSession {
  id: string
  title: string
  description: string
  meetLink?: string
  scheduledDate: string
  duration: number
  status: 'upcoming' | 'active' | 'ended'
  createdAt: string
  updatedAt: string
  hasAttended?: boolean
}

export interface DiscussionSessionsResponse {
  sessions: DiscussionSession[]
}

export interface DiscussionSessionResponse {
  session: DiscussionSession
}

// Game Types
export type GameType = 'puzzle' | 'crossword'
export type GameDifficulty = 'easy' | 'medium' | 'hard'

export interface PuzzleData {
  imageUrl: string
  pieces: number
  solution?: string
}

export interface CrosswordClue {
  number: number
  direction: 'across' | 'down'
  clue: string
  answer: string
  startRow?: number
  startCol?: number
}

export interface CrosswordData {
  clues: CrosswordClue[]
  grid?: string[][]
}

export interface Game {
  id: string
  title: string
  description: string
  type: GameType
  difficulty: GameDifficulty
  gameData: PuzzleData | CrosswordData
  createdAt: string
  updatedAt: string
  isCompleted?: boolean
}

export interface GamesResponse {
  games: Game[]
}

export interface GameResponse {
  game: Game
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
  points: number
  breakdown: {
    articles: number
    games: number
    polls: number
    discussions: number
  }
}

// Leaderboard Types
export interface LeaderboardEntry {
  userId: string
  userName: string
  points: number
  rank: number
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[]
}

// API Error
export interface APIError {
  message: string
  errors?: { [key: string]: string[] }
}
