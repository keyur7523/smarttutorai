import { Problem } from '@/store/types'

/**
 * Answer checking logic with exact specifications:
 * - For MCQ: Check if userAnswer matches any answer_key value
 * - For short answer: Case-insensitive comparison with answer_key
 * - Handle multiple correct answers
 * - Add debug logging
 */
export function isCorrect(problem: Problem, userAnswer: string): boolean {
  console.log('🔍 Answer checking started:', {
    problemId: problem.id,
    problemType: problem.type,
    userAnswer,
    answerKey: problem.answer_key
  })
  
  if (!userAnswer || !problem.answer_key || problem.answer_key.length === 0) {
    console.log('❌ Invalid input for answer checking')
    return false
  }
  
  const normalizedUserAnswer = userAnswer.toLowerCase().trim()
  const normalizedAnswerKeys = problem.answer_key.map(key => key.toLowerCase().trim())
  
  console.log('📝 Normalized answers:', {
    userAnswer: normalizedUserAnswer,
    answerKeys: normalizedAnswerKeys
  })
  
  // Check if user answer matches any of the correct answers
  const isCorrect = normalizedAnswerKeys.some(key => key === normalizedUserAnswer)
  
  console.log('✅ Answer check result:', isCorrect)
  
  return isCorrect
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use isCorrect instead
 */
export function checkAnswer(problem: Problem, userAnswer: string | string[]): boolean {
  console.log('⚠️ Using deprecated checkAnswer function, consider using isCorrect')
  
  const answer = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer
  return isCorrect(problem, answer)
}