export type Level = 'easy' | 'medium' | 'hard'

export interface Problem {
  id: string
  stem: string
  type: 'mcq' | 'short'
  choices?: string[]
  answer_key: string[]
  level: Level
  topic: string
  hints: string[]
}

export interface HistoryItem {
  problemId: string
  levelAtTime: Level
  correct: boolean
  timeMs: number
  usedHint: boolean
  submittedAt: number
}