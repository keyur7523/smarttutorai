interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * LLM Integration with support for OpenAI and Anthropic
 * - OpenAI: GPT-4o-mini model
 * - Anthropic: Claude model
 * - Environment variables: OPENAI_API_KEY, ANTHROPIC_API_KEY
 * - Provider selection: LLM_PROVIDER or NEXT_PUBLIC_LLM
 * - 20-second timeout
 * - Proper error handling
 */
export async function callLLM(messages: Message[]): Promise<string> {
  console.log('🤖 LLM call started with', messages.length, 'messages')
  
  const provider = process.env.LLM_PROVIDER || process.env.NEXT_PUBLIC_LLM || 'openai'
  console.log('🔧 Using LLM provider:', provider)
  
  try {
    let response: string
    
    if (provider === 'anthropic') {
      response = await callAnthropic(messages)
    } else {
      response = await callOpenAI(messages)
    }
    
    console.log('✅ LLM response received:', response.substring(0, 100) + '...')
    return response
    
  } catch (error) {
    console.error('❌ LLM call failed:', error)
    throw new Error(`LLM call failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(messages: Message[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20000) // 20-second timeout
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.choices[0]?.message?.content || 'No response generated'
    
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('OpenAI API timeout')
    }
    throw error
  }
}

/**
 * Call Anthropic API
 */
async function callAnthropic(messages: Message[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required')
  }
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20000) // 20-second timeout
  
  try {
    // Convert messages to Anthropic format
    const systemMessage = messages.find(m => m.role === 'system')
    const userMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant')
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        system: systemMessage?.content || 'You are a helpful AI tutor.',
        messages: userMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
      }),
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.content[0]?.text || 'No response generated'
    
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Anthropic API timeout')
    }
    throw error
  }
}