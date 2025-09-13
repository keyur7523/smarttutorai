/**
 * Offline fallback system for when API calls fail
 */

/**
 * Get fallback feedback when API fails
 */
export function getFallbackFeedback(
  stem: string,
  userAnswer: string,
  answerKey: string[],
  wasCorrect: boolean
): string {
  console.log('🔄 Using offline fallback feedback')
  
  if (wasCorrect) {
    const positiveMessages = [
      "That's correct! Excellent work.",
      "Great job! You solved this problem correctly.",
      "Perfect! You're getting the hang of this.",
      "Well done! That's the right answer.",
      "Excellent! You're making great progress."
    ]
    return positiveMessages[Math.floor(Math.random() * positiveMessages.length)]
  } else {
    // Analyze the topic from the stem for more specific feedback
    const topic = extractTopic(stem)
    
    switch (topic) {
      case 'addition':
        return "Not quite right. Remember to add the numerators and keep the same denominator for fractions with the same denominator."
      case 'subtraction':
        return "Not quite right. Remember to subtract the numerators and keep the same denominator for fractions with the same denominator."
      case 'multiplication':
        return "Not quite right. For multiplying fractions, multiply the numerators together and the denominators together."
      case 'division':
        return "Not quite right. For dividing fractions, multiply by the reciprocal of the second fraction."
      case 'simplification':
        return "Not quite right. Look for common factors in the numerator and denominator to simplify."
      case 'comparison':
        return "Not quite right. Try converting to equivalent fractions with the same denominator to compare."
      default:
        return "Not quite right. Let's review the steps for this type of problem. Take your time and think through each step carefully."
    }
  }
}

/**
 * Get fallback study plan
 */
export function getFallbackStudyPlan(): { plan: string[], challenge: string } {
  console.log('🔄 Using offline fallback study plan')
  
  return {
    plan: [
      "Review the problems you found challenging",
      "Practice similar problems to reinforce learning",
      "Focus on understanding concepts rather than memorizing",
      "Try solving problems without hints first",
      "Keep practicing regularly to maintain your skills"
    ],
    challenge: "Great work today. Keep practicing to improve your fraction skills!"
  }
}

/**
 * Get fallback dynamic hint
 */
export function getFallbackHint(topic: string): string {
  console.log('🔄 Using offline fallback hint for topic:', topic)
  
  const hints = {
    addition: "Remember to add the numerators and keep the same denominator when the denominators are equal.",
    subtraction: "Remember to subtract the numerators and keep the same denominator when the denominators are equal.",
    multiplication: "Multiply the numerators together and the denominators together.",
    division: "To divide fractions, multiply by the reciprocal of the second fraction.",
    simplification: "Look for common factors in both the numerator and denominator.",
    comparison: "Convert both fractions to have the same denominator to compare them easily.",
    default: "Break the problem into smaller steps and work through each one carefully."
  }
  
  return hints[topic as keyof typeof hints] || hints.default
}

/**
 * Extract topic from problem stem
 */
function extractTopic(stem: string): string {
  const lowerStem = stem.toLowerCase()
  
  if (lowerStem.includes('add') || lowerStem.includes('plus') || lowerStem.includes('+')) {
    return 'addition'
  }
  if (lowerStem.includes('subtract') || lowerStem.includes('minus') || lowerStem.includes('-')) {
    return 'subtraction'
  }
  if (lowerStem.includes('multiply') || lowerStem.includes('times') || lowerStem.includes('×')) {
    return 'multiplication'
  }
  if (lowerStem.includes('divide') || lowerStem.includes('÷')) {
    return 'division'
  }
  if (lowerStem.includes('simplify') || lowerStem.includes('reduce')) {
    return 'simplification'
  }
  if (lowerStem.includes('compare') || lowerStem.includes('greater') || lowerStem.includes('less')) {
    return 'comparison'
  }
  
  return 'default'
}

/**
 * Offline support class
 */
export class OfflineSupport {
  static getFeedback(stem: string, userAnswer: string, answerKey: string[], wasCorrect: boolean): string {
    return getFallbackFeedback(stem, userAnswer, answerKey, wasCorrect)
  }
  
  static getStudyPlan(): { plan: string[], challenge: string } {
    return getFallbackStudyPlan()
  }
  
  static getHint(topic: string): string {
    return getFallbackHint(topic)
  }
}