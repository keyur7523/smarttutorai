import { HistoryItem } from '@/store/types'

export interface Metrics {
  accuracy: number
  fastRate: number
  avgTimeMs: number
  perLevel: { easy: number, medium: number, hard: number }
  streak: number
  speedScore: number
  overallGrade: 'excellent' | 'good' | 'ok' | 'poor'
  improved: boolean | null
}

/**
 * Calculate performance metrics from history with exact specifications
 */
export function deriveMetrics(history: HistoryItem[]): Metrics {
  console.log('📊 Metrics calculation started for', history.length, 'history items')
  
  if (history.length === 0) {
    return {
      accuracy: 0,
      fastRate: 0,
      avgTimeMs: 0,
      perLevel: { easy: 0, medium: 0, hard: 0 },
      streak: 0,
      speedScore: 0,
      overallGrade: 'poor',
      improved: null
    }
  }
  
  // Overall accuracy percentage
  const correctAnswers = history.filter(h => h.correct).length
  const accuracy = (correctAnswers / history.length) * 100
  
  // Speed score (based on time thresholds)
  const fastThreshold = 30000 // 30 seconds
  const fastAnswers = history.filter(h => h.timeMs <= fastThreshold).length
  const fastRate = (fastAnswers / history.length) * 100
  
  // Average time in milliseconds
  const avgTimeMs = history.reduce((sum, h) => sum + h.timeMs, 0) / history.length
  
  // Per-level performance
  const easyHistory = history.filter(h => h.levelAtTime === 'easy')
  const mediumHistory = history.filter(h => h.levelAtTime === 'medium')
  const hardHistory = history.filter(h => h.levelAtTime === 'hard')
  
  const perLevel = {
    easy: easyHistory.length > 0 ? (easyHistory.filter(h => h.correct).length / easyHistory.length) * 100 : 0,
    medium: mediumHistory.length > 0 ? (mediumHistory.filter(h => h.correct).length / mediumHistory.length) * 100 : 0,
    hard: hardHistory.length > 0 ? (hardHistory.filter(h => h.correct).length / hardHistory.length) * 100 : 0
  }
  
  // Current streak (consecutive correct)
  let streak = 0
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].correct) {
      streak++
    } else {
      break
    }
  }
  
  // Speed score (inverse of average time, normalized)
  const speedScore = avgTimeMs > 0 ? Math.max(0, 100 - (avgTimeMs / 1000)) : 0
  
  // Overall grade based on accuracy
  let overallGrade: 'excellent' | 'good' | 'ok' | 'poor'
  if (accuracy >= 90) overallGrade = 'excellent'
  else if (accuracy >= 75) overallGrade = 'good'
  else if (accuracy >= 60) overallGrade = 'ok'
  else overallGrade = 'poor'
  
  // Improved (compare first half vs second half)
  let improved: boolean | null = null
  if (history.length >= 4) {
    const firstHalf = history.slice(0, Math.floor(history.length / 2))
    const secondHalf = history.slice(Math.floor(history.length / 2))
    
    const firstHalfAccuracy = (firstHalf.filter(h => h.correct).length / firstHalf.length) * 100
    const secondHalfAccuracy = (secondHalf.filter(h => h.correct).length / secondHalf.length) * 100
    
    improved = secondHalfAccuracy > firstHalfAccuracy
  }
  
  const metrics: Metrics = {
    accuracy: Math.round(accuracy),
    fastRate: Math.round(fastRate),
    avgTimeMs: Math.round(avgTimeMs),
    perLevel: {
      easy: Math.round(perLevel.easy),
      medium: Math.round(perLevel.medium),
      hard: Math.round(perLevel.hard)
    },
    streak,
    speedScore: Math.round(speedScore),
    overallGrade,
    improved
  }
  
  console.log('✅ Metrics calculated:', metrics)
  return metrics
}

/**
 * Legacy MetricsCalculator class for backward compatibility
 */
export class MetricsCalculator {
  static getPerformanceLevel(accuracy: number): 'excellent' | 'good' | 'needs-work' {
    if (accuracy >= 90) return 'excellent'
    if (accuracy >= 75) return 'good'
    return 'needs-work'
  }
  
  static getSpeedLevel(speedScore: number): 'fast' | 'moderate' | 'slow' {
    if (speedScore >= 70) return 'fast'
    if (speedScore >= 40) return 'moderate'
    return 'slow'
  }
}