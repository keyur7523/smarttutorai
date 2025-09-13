import { NextResponse } from 'next/server'
import { callLLM } from '@/lib/llm'
import { getFallbackFeedback } from '@/lib/offline'

export const runtime = 'edge'

/**
 * Tutor feedback API with exact specifications:
 * - POST endpoint for tutor feedback
 * - Input: { stem, userAnswer, answerKey, wasCorrect }
 * - Use LLM to generate personalized explanations
 * - Fallback to offline feedback on error
 * - Edge runtime for performance
 */
export async function POST(request: Request) {
  console.log('🎓 Tutor API called')
  
  try {
    const { stem, userAnswer, answerKey, wasCorrect } = await request.json()
    
    if (!stem || userAnswer === undefined || !answerKey || wasCorrect === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    console.log('📝 Tutor request:', { 
      stem: stem.substring(0, 50) + '...', 
      userAnswer, 
      wasCorrect 
    })
    
    // Create LLM prompt for feedback generation
    const messages = [
      {
        role: 'system' as const,
        content: `You are a supportive math tutor. Provide personalized feedback for a student's answer to a fraction problem. Be encouraging and educational, explaining why the answer is correct or incorrect and how to improve. Keep it concise and helpful.`
      },
      {
        role: 'user' as const,
        content: `Problem: ${stem}
Student's answer: ${userAnswer}
Correct answer: ${Array.isArray(answerKey) ? answerKey.join(', ') : answerKey}
Was correct: ${wasCorrect}

Provide personalized feedback that explains the result and helps the student learn.`
      }
    ]
    
    try {
      const feedback = await callLLM(messages)
      
      console.log('✅ LLM feedback generated:', feedback)
      return NextResponse.json({ 
        feedback,
        source: 'llm'
      })
      
    } catch (llmError) {
      console.error('❌ LLM feedback generation failed:', llmError)
      
      // Fallback to offline feedback
      const fallbackFeedback = getFallbackFeedback(stem, userAnswer, Array.isArray(answerKey) ? answerKey : [answerKey], wasCorrect)
      return NextResponse.json({ 
        feedback: fallbackFeedback,
        source: 'offline_fallback'
      })
    }
    
  } catch (error) {
    console.error('❌ Tutor API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}