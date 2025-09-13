import { NextResponse } from 'next/server'
import { callLLM } from '@/lib/llm'
import { getFallbackStudyPlan } from '@/lib/offline'

export const runtime = 'edge'

/**
 * Study plan generation API with exact specifications:
 * - POST endpoint for study plan generation
 * - Input: { history }
 * - Generate 5-step plan and challenge problem
 * - Structured JSON response
 * - 5-second timeout
 * - Disable caching for fresh results
 */
export async function POST(request: Request) {
  console.log('📚 Plan API called')
  
  try {
    const { history, currentLevel } = await request.json()
    
    if (!history || !Array.isArray(history)) {
      return NextResponse.json(
        { error: 'Invalid history data' },
        { status: 400 }
      )
    }
    
    console.log('📊 Plan request for', history.length, 'history items, level:', currentLevel)
    
    // Create LLM prompt for study plan generation
    const messages = [
      {
        role: 'system' as const,
        content: `You are an expert math tutor. Generate a personalized 5-step study plan based on a student's fraction practice history. Return each step as a clean sentence WITHOUT numbering. For the challenge, format as: "Problem text (Hint: hint text)" if including a hint. Return valid JSON only.`
      },
      {
        role: 'user' as const,
        content: `Generate a 5-step study plan based on student's fraction practice history.
Return each step as a clean sentence WITHOUT numbering.
For challenge, format as: "Problem text (Hint: hint text)" if including hint.
Return JSON: {"plan": string[], "challenge": string}

Student's practice history:
- Total problems: ${history.length}
- Correct answers: ${history.filter(h => h.correct).length}
- Current level: ${currentLevel}
- Average time: ${history.length > 0 ? Math.round(history.reduce((sum, h) => sum + h.timeMs, 0) / history.length / 1000) : 0} seconds
- Hints used: ${history.filter(h => h.usedHint).length}

Generate a personalized study plan and challenge problem.`
      }
    ]
    
    try {
      const response = await callLLM(messages)
      
      // Parse JSON response
      let planData
      try {
        planData = JSON.parse(response)
      } catch (parseError) {
        console.error('❌ Failed to parse LLM response as JSON:', parseError)
        throw new Error('Invalid JSON response from LLM')
      }
      
      // Validate response structure
      if (!planData.plan || !Array.isArray(planData.plan) || !planData.challenge) {
        throw new Error('Invalid response structure from LLM')
      }
      
      console.log('✅ Study plan generated:', planData)
      return NextResponse.json(planData)
      
    } catch (error) {
      console.error('❌ LLM plan generation failed:', error)
      
      // Fallback to offline plan
      const fallbackPlan = getFallbackStudyPlan()
      return NextResponse.json(fallbackPlan)
    }
    
  } catch (error) {
    console.error('❌ Plan API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}