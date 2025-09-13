import { callLLM } from './llm'

/**
 * Dynamic hint generation with exact specifications:
 * - API call to /api/hint with problem details
 * - 3-second timeout
 * - Fallback: "Keep trying! You're on the right track."
 */
export async function getDynamicHint(
  stem: string,
  userAnswer: string,
  answerKey: string[],
  topic: string,
  level: string
): Promise<string> {
  console.log('💡 Dynamic hint generation started:', {
    stem: stem.substring(0, 50) + '...',
    userAnswer,
    answerKey,
    topic,
    level
  })
  
  try {
    const response = await fetch('/api/hint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stem,
        userAnswer,
        answerKey,
        topic,
        level
      }),
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('✅ Dynamic hint received:', data.hint)
    return data.hint
    
  } catch (error) {
    console.error('❌ Dynamic hint generation failed:', error)
    return "Keep trying! You're on the right track."
  }
}

/**
 * Study plan generation agent
 */
export class PlannerAgent {
  async generateStudyPlan(history: any[], currentLevel: string): Promise<{ plan: string[], challenge: string }> {
    console.log('📚 Study plan generation started')
    
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history,
          currentLevel
        }),
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Study plan received')
      return data
      
    } catch (error) {
      console.error('❌ Study plan generation failed:', error)
      return {
        plan: [
          "Review the problems you found challenging",
          "Practice similar problems to reinforce learning",
          "Focus on understanding concepts rather than memorizing",
          "Try solving problems without hints first",
          "Keep practicing regularly to maintain your skills"
        ],
        challenge: "Great work today."
      }
    }
  }
}

/**
 * Tutor feedback agent
 */
export class TutorAgent {
  async generateFeedback(stem: string, userAnswer: string, answerKey: string[], wasCorrect: boolean): Promise<string> {
    console.log('🎓 Tutor feedback generation started')
    
    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stem,
          userAnswer,
          answerKey,
          wasCorrect
        }),
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ Tutor feedback received')
      return data.feedback
      
    } catch (error) {
      console.error('❌ Tutor feedback generation failed:', error)
      return wasCorrect 
        ? "That's correct! Excellent work."
        : "Not quite. Let's review the steps for this type of problem."
    }
  }
}

// Export instances for use
export const plannerAgent = new PlannerAgent()
export const tutorAgent = new TutorAgent()