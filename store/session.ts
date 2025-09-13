import { create } from 'zustand'
import { Problem, HistoryItem, Level } from './types'
import { pickNext } from '@/lib/itemBank'
import { isCorrect } from '@/lib/check'
import { getNextLevel } from '@/lib/adapt'
import { deriveMetrics, Metrics } from '@/lib/metrics'

interface SessionState {
  // Core state
  currentLevel: Level
  history: HistoryItem[]
  problemStartAt: number | null
  recentProblemIds: string[]
  judgeMode: boolean
  problems: Problem[]
  
  // Current problem state
  currentProblem: Problem | null
  isSubmitting: boolean
  feedback: { correct: boolean; explanation: string } | null
  
  // Hint state
  hints: string[]
  dynamicHints: string[]
  currentHintIndex: number
  isLoadingHint: boolean
  
  // Session state
  sessionComplete: boolean
  sessionId: string
  
  // Actions
  setProblems: (problems: Problem[]) => void
  startNewProblem: (level?: Level) => void
  record: (historyItem: HistoryItem) => void
  setLevel: (level: Level) => void
  setJudgeMode: (on: boolean) => void
  hydrateFromStorage: () => void
  clearSession: () => void
  
  // New actions for enhanced functionality
  loadNextProblem: () => Promise<void>
  submitAnswer: (answer: string) => Promise<void>
  requestHint: () => Promise<void>
  getPerformanceMetrics: () => Metrics
  resetSession: () => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  // Initial state
  currentLevel: 'medium',
  history: [],
  problemStartAt: null,
  recentProblemIds: [],
  judgeMode: false,
  problems: [],
  currentProblem: null,
  isSubmitting: false,
  feedback: null,
  hints: [],
  dynamicHints: [],
  currentHintIndex: 0,
  isLoadingHint: false,
  sessionComplete: false,
  sessionId: generateSessionId(),

  setProblems: (problems: Problem[]) => {
    console.log('📚 Setting problems:', problems.length)
    console.log('📊 Problems data:', problems.slice(0, 2).map(p => ({ id: p.id, level: p.level, topic: p.topic })))
    set({ problems })
    const updatedState = get()
    console.log('📊 Problems set in store - new count:', updatedState.problems.length)
  },

  startNewProblem: (level?: Level) => {
    const currentLevel = level || get().currentLevel
    console.log('🚀 Starting new problem at level:', currentLevel)
    set({ 
      problemStartAt: Date.now(),
      currentLevel 
    })
  },

  record: (historyItem: HistoryItem) => {
    const state = get()
    const newHistory = [...state.history, historyItem]
    const newRecentIds = [...state.recentProblemIds, historyItem.problemId].slice(-5)
    
    console.log('📝 Recording history item:', historyItem)
    
    set({ 
      history: newHistory,
      recentProblemIds: newRecentIds,
      problemStartAt: null
    })
  },

  setLevel: (level: Level) => {
    console.log('📊 Setting level to:', level)
    set({ currentLevel: level })
  },

  setJudgeMode: (on: boolean) => {
    console.log('⚖️ Setting judge mode:', on)
    set({ judgeMode: on })
  },

  hydrateFromStorage: () => {
    // No persistence - fresh start each session
    console.log('💾 Hydrating from storage (no-op)')
  },

  clearSession: () => {
    const currentState = get()
    console.log('🔄 Clearing session - Current state:', {
      currentLevel: currentState.currentLevel,
      historyLength: currentState.history.length,
      currentProblem: currentState.currentProblem?.id || 'none',
      sessionComplete: currentState.sessionComplete,
      sessionId: currentState.sessionId
    })
    
    const newSessionId = generateSessionId()
    console.log('🆔 Generating new session ID:', newSessionId)
    
    set({
      currentLevel: 'medium',
      history: [],
      problemStartAt: null,
      recentProblemIds: [],
      judgeMode: false,
      // Don't clear problems - they should persist across sessions
      currentProblem: null,
      isSubmitting: false,
      feedback: null,
      hints: [],
      dynamicHints: [],
      currentHintIndex: 0,
      isLoadingHint: false,
      sessionComplete: false,
      sessionId: newSessionId
    })
    
    const updatedState = get()
    console.log('✅ Session cleared successfully - New state:', {
      currentLevel: updatedState.currentLevel,
      historyLength: updatedState.history.length,
      currentProblem: updatedState.currentProblem?.id || 'none',
      sessionComplete: updatedState.sessionComplete,
      sessionId: updatedState.sessionId,
      problemsCount: updatedState.problems.length
    })
  },

  // Enhanced functionality
  loadNextProblem: async () => {
    const state = get()
    console.log('🔄 Loading next problem')
    
    if (state.history.length >= 10) {
      console.log('✅ Session complete - 10 problems reached')
      set({ sessionComplete: true })
      return
    }
    
    const nextProblem = pickNext(state.currentLevel, state.recentProblemIds, state.problems)
    
    if (!nextProblem) {
      console.log('❌ No problems available')
      return
    }
    
    console.log('🎯 Loading problem:', nextProblem.id)
    
    set({
      currentProblem: nextProblem,
      hints: nextProblem.hints || [],
      dynamicHints: [],
      currentHintIndex: 0,
      feedback: null,
      isSubmitting: false
    })
    
    get().startNewProblem(state.currentLevel)
  },

  submitAnswer: async (answer: string) => {
    const state = get()
    
    if (!state.currentProblem || state.isSubmitting || state.problemStartAt === null) {
      console.log('❌ Cannot submit answer - invalid state')
      return
    }
    
    console.log('📤 Submitting answer:', answer)
    set({ isSubmitting: true })
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const correct = isCorrect(state.currentProblem, answer)
      const timeMs = Date.now() - state.problemStartAt
      
      // Generate feedback
      const explanation = correct 
        ? "Great job! You solved this problem correctly."
        : "Not quite right. Let's review the steps for this type of problem."
      
      set({ feedback: { correct, explanation } })
      
      const historyItem: HistoryItem = {
        problemId: state.currentProblem.id,
        levelAtTime: state.currentLevel,
        correct,
        timeMs,
        usedHint: state.currentHintIndex > 0,
        submittedAt: Date.now()
      }
      
      get().record(historyItem)
      
      // Check if session is complete after recording this answer
      const newHistoryLength = state.history.length + 1
      if (newHistoryLength >= 10) {
        console.log('✅ Session complete - 10 problems reached')
        set({ sessionComplete: true, isSubmitting: false })
        return
      }
      
      // Check if we should adapt the level
      const newLevel = getNextLevel(state.currentLevel, [...state.history, historyItem])
      if (newLevel !== state.currentLevel) {
        console.log('📈 Level adaptation:', state.currentLevel, '->', newLevel)
        get().setLevel(newLevel)
      }
      
      set({ isSubmitting: false })
      
      // Load next problem after a short delay
      setTimeout(() => {
        get().loadNextProblem()
      }, 2000)
      
    } catch (error) {
      console.error('❌ Error submitting answer:', error)
      set({ isSubmitting: false })
    }
  },

  requestHint: async () => {
    const state = get()
    
    if (!state.currentProblem || state.isLoadingHint) {
      console.log('❌ Cannot request hint - invalid state')
      return
    }
    
    console.log('💡 Requesting hint:', state.currentHintIndex)
    set({ isLoadingHint: true })
    
    try {
      if (state.currentHintIndex === 0) {
        // First hint: Use only the first static hint from JSON
        console.log('📝 Showing first static hint from JSON')
        set({ 
          currentHintIndex: state.currentHintIndex + 1,
          isLoadingHint: false 
        })
      } else if (state.currentHintIndex === 1) {
        // Second hint: Generate LLM customized hint
        console.log('🤖 Generating LLM customized hint')
        const response = await fetch('/api/hint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stem: state.currentProblem.stem,
            userAnswer: '', // We don't have user's answer yet
            answerKey: state.currentProblem.answer_key,
            topic: state.currentProblem.topic,
            level: state.currentProblem.level
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          set({
            dynamicHints: [...state.dynamicHints, data.hint],
            currentHintIndex: state.currentHintIndex + 1,
            isLoadingHint: false
          })
        } else {
          throw new Error('Failed to get hint')
        }
      }
    } catch (error) {
      console.error('❌ Error requesting hint:', error)
      set({ isLoadingHint: false })
    }
  },

  getPerformanceMetrics: () => {
    const state = get()
    return deriveMetrics(state.history)
  },

  resetSession: () => {
    console.log('🔄 Resetting session')
    get().clearSession()
  }
}))

// Helper function to generate session ID
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}