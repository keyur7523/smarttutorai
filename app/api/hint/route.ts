import { NextResponse } from 'next/server'
import { callLLM } from '@/lib/llm'
import { getFallbackHint } from '@/lib/offline'

export const runtime = 'edge'

/**
 * Dynamic hint generation API with exact specifications:
 * - POST endpoint for dynamic hints
 * - Input: { stem, userAnswer, answerKey, topic, level }
 * - Context-aware hint generation
 * - 3-second timeout
 * - Fallback to generic encouragement
 */
export async function POST(request: Request) {
  console.log('💡 Hint API called')
  
  try {
    const { stem, userAnswer, answerKey, topic, level } = await request.json()
    
    if (!stem || !answerKey) {
      return NextResponse.json(
        { error: 'Missing required fields: stem and answerKey are required' },
        { status: 400 }
      )
    }
    
    console.log('📝 Hint request:', { stem: stem.substring(0, 50) + '...', userAnswer, topic, level })
    
    // Create LLM prompt for hint generation
    const messages = [
      {
        role: 'system' as const,
        content: `You are a helpful math tutor. Generate a specific, encouraging hint for a student working on a fraction problem. The hint should guide them toward the correct answer without giving it away. Keep it concise and supportive.`
      },
      {
        role: 'user' as const,
        content: `Problem: ${stem}
${userAnswer ? 'Student\'s answer: ' + userAnswer : 'Student hasn\'t answered yet'}
Correct answer: ${Array.isArray(answerKey) ? answerKey.join(', ') : answerKey}
Topic: ${topic}
Level: ${level}

Generate a helpful hint that guides the student toward the correct approach.`
      }
    ]
    
    try {
      const hint = await callLLM(messages)
      
      console.log('✅ LLM hint generated:', hint)
      return NextResponse.json({ 
        hint,
        source: 'llm'
      })
      
    } catch (llmError) {
      console.error('❌ LLM hint generation failed:', llmError)
      
      // Fallback to offline hint
      const fallbackHint = getFallbackHint(topic || 'default')
      return NextResponse.json({ 
        hint: fallbackHint,
        source: 'offline_fallback'
      })
    }
    
  } catch (error) {
    console.error('❌ Hint API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}