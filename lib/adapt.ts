import { Level, HistoryItem } from '@/store/types'

/**
 * Adaptive logic for determining the next difficulty level based on performance history
 * 
 * EXACT RULES:
 * 1. "2 consecutive right medium questions start asking high questions."
 * 2. "2 consecutive wrong hard or 3 wrong hard go to medium again."
 * 3. "2 consecutive wrong medium or 3 wrong medium go to easy, dont switch to medium again from easy until 2 consecutive easy are answered correct."
 */
export function getNextLevel(current: Level, history: HistoryItem[]): Level {
  console.log('🔄 Level adaptation check:', { current, historyLength: history.length })
  
  // Get recent history for the current level
  const recentHistory = history.filter(item => item.levelAtTime === current)
  
  if (recentHistory.length === 0) {
    console.log('📊 No history for current level, staying at:', current)
    return current // No history, stay at current level
  }

  // Get the last few items for consecutive analysis
  const lastTwo = recentHistory.slice(-2)
  
  // Check for consecutive patterns
  const hasTwoConsecutiveCorrect = lastTwo.length === 2 && 
    lastTwo.every(item => item.correct)
  
  const hasTwoConsecutiveWrong = lastTwo.length === 2 && 
    lastTwo.every(item => !item.correct)
  
  // Count total wrong answers at current level
  const totalWrong = recentHistory.filter(item => !item.correct).length

  console.log('📈 Analysis:', {
    current,
    recentHistory: recentHistory.length,
    hasTwoConsecutiveCorrect,
    hasTwoConsecutiveWrong,
    totalWrong
  })

  // Apply EXACT adaptation rules
  switch (current) {
    case 'medium':
      // Rule 1: "2 consecutive right medium questions start asking high questions."
      if (hasTwoConsecutiveCorrect) {
        console.log('📈 Medium → Hard: 2 consecutive correct')
        return 'hard'
      }
      // Rule 3: "2 consecutive wrong medium or 3 wrong medium go to easy"
      if (hasTwoConsecutiveWrong || totalWrong >= 3) {
        console.log('📉 Medium → Easy: 2 consecutive wrong OR 3 total wrong')
        return 'easy'
      }
      break
      
    case 'hard':
      // Rule 2: "2 consecutive wrong hard or 3 wrong hard go to medium again."
      if (hasTwoConsecutiveWrong || totalWrong >= 3) {
        console.log('📉 Hard → Medium: 2 consecutive wrong OR 3 total wrong')
        return 'medium'
      }
      break
      
    case 'easy':
      // Rule 3: "dont switch to medium again from easy until 2 consecutive easy are answered correct."
      if (hasTwoConsecutiveCorrect) {
        console.log('📈 Easy → Medium: 2 consecutive correct')
        return 'medium'
      }
      break
  }

  console.log('📊 No level change needed, staying at:', current)
  return current // No change needed
}