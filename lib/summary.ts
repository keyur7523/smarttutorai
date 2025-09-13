import { HistoryItem } from '@/store/types'

/**
 * Weak areas analysis with exact specifications:
 * - Analyze wrong answers by topic
 * - Return top 2-3 weak areas
 * - Fallback to generic suggestions
 */
export function weakAreas(history: HistoryItem[]): string[] {
  console.log('🔍 Weak areas analysis started for', history.length, 'history items')
  
  if (history.length === 0) {
    return ["No data available for analysis"]
  }
  
  // Get incorrect answers
  const incorrectAnswers = history.filter(h => !h.correct)
  
  if (incorrectAnswers.length === 0) {
    return ["No major weak areas detected - great job!"]
  }
  
  // Analyze by topic (we'll need to extract topic from problem data)
  const topicErrors: { [key: string]: number } = {}
  
  // For now, we'll use a simple analysis based on problem IDs
  // In a real implementation, you'd have topic information in the problem data
  incorrectAnswers.forEach(item => {
    // Simple topic extraction based on problem ID patterns
    const topic = extractTopicFromProblemId(item.problemId)
    topicErrors[topic] = (topicErrors[topic] || 0) + 1
  })
  
  // Sort topics by error count
  const sortedTopics = Object.entries(topicErrors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3) // Top 3 weak areas
  
  const weakAreasList: string[] = []
  
  sortedTopics.forEach(([topic, count]) => {
    const percentage = Math.round((count / incorrectAnswers.length) * 100)
    weakAreasList.push(`${topic} problems (${percentage}% of errors)`)
  })
  
  // Add generic suggestions if we have few specific areas
  if (weakAreasList.length < 2) {
    weakAreasList.push("Focus on accuracy over speed")
    weakAreasList.push("Review basic fraction concepts")
  }
  
  console.log('✅ Weak areas identified:', weakAreasList)
  return weakAreasList
}

/**
 * Extract topic from problem ID (simple heuristic)
 */
function extractTopicFromProblemId(problemId: string): string {
  // This is a simple heuristic - in a real system, you'd have topic data
  const id = problemId.toLowerCase()
  
  if (id.includes('add') || id.includes('plus')) return 'Addition'
  if (id.includes('sub') || id.includes('minus')) return 'Subtraction'
  if (id.includes('mult') || id.includes('times')) return 'Multiplication'
  if (id.includes('div') || id.includes('divide')) return 'Division'
  if (id.includes('simplify') || id.includes('reduce')) return 'Simplification'
  if (id.includes('compare') || id.includes('greater')) return 'Comparison'
  if (id.includes('convert') || id.includes('mixed')) return 'Conversion'
  if (id.includes('word') || id.includes('problem')) return 'Word Problems'
  
  return 'General Fractions'
}

/**
 * Generate performance insights
 */
export function generateInsights(history: HistoryItem[]): {
  strengths: string[]
  improvements: string[]
} {
  console.log('💡 Generating performance insights')
  
  if (history.length === 0) {
    return {
      strengths: [],
      improvements: ["Start practicing to see your strengths and areas for improvement"]
    }
  }
  
  const correctAnswers = history.filter(h => h.correct).length
  const accuracy = (correctAnswers / history.length) * 100
  const averageTime = history.reduce((sum, h) => sum + h.timeMs, 0) / history.length
  const hintsUsed = history.filter(h => h.usedHint).length
  const hintUsageRate = (hintsUsed / history.length) * 100
  
  const strengths: string[] = []
  const improvements: string[] = []
  
  // Analyze strengths
  if (accuracy >= 80) {
    strengths.push("High accuracy rate")
  }
  if (averageTime < 30000) {
    strengths.push("Good problem-solving speed")
  }
  if (hintUsageRate < 30) {
    strengths.push("Independent problem solving")
  }
  
  // Analyze areas for improvement
  if (accuracy < 70) {
    improvements.push("Focus on accuracy over speed")
  }
  if (averageTime > 60000) {
    improvements.push("Work on problem-solving speed")
  }
  if (hintUsageRate > 50) {
    improvements.push("Try solving more problems without hints")
  }
  
  // Add generic suggestions if lists are empty
  if (strengths.length === 0) {
    strengths.push("Consistent effort in practice")
  }
  if (improvements.length === 0) {
    improvements.push("Keep practicing to maintain your skills")
  }
  
  console.log('✅ Insights generated:', { strengths, improvements })
  return { strengths, improvements }
}