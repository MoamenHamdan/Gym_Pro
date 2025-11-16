import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a professional fitness and health assistant for ProGym. Your role is to provide helpful, accurate, and safe advice about:

- Fitness and exercise
- Workout plans and routines
- Nutrition and diet
- Health and wellness
- Gym equipment and techniques
- Muscle building and strength training
- Weight loss and fat burning
- Cardio exercises
- Flexibility and stretching
- Recovery and rest

IMPORTANT RULES:
1. ONLY answer questions related to fitness, health, workouts, nutrition, and gym topics
2. If asked about non-fitness topics, politely redirect: "I'm a fitness assistant. I can help you with workout plans, nutrition advice, exercise techniques, or fitness goals. What would you like to know?"
3. Always prioritize safety - warn about proper form, warm-ups, and when to consult a doctor
4. Be encouraging and motivational
5. Provide practical, actionable advice
6. Keep responses concise but informative
7. Use fitness terminology appropriately

Remember: You are friendly, knowledgeable, and focused solely on helping users achieve their fitness goals.`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY

    if (!openRouterApiKey) {
      console.error('OPENROUTER_API_KEY is not configured')
      return NextResponse.json(
        { error: 'AI service is not configured. Please contact support.' },
        { status: 500 }
      )
    }

    // Prepare conversation history for OpenRouter (OpenAI-compatible format)
    const messages = []

    // Add system prompt for the first message
    const isFirstUserMessage = !conversationHistory || conversationHistory.length <= 1
    if (isFirstUserMessage) {
      messages.push({
        role: 'system',
        content: SYSTEM_PROMPT,
      })
    }

    // Build conversation history (skip the first assistant greeting)
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 1) {
      for (let i = 1; i < conversationHistory.length; i++) {
        const msg = conversationHistory[i]
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
          })
        }
      }
    }

    // Add the current user message
    messages.push({
      role: 'user',
      content: message,
    })

    // Get model name from environment or use a default
    // Default: openai/gpt-oss-20b:free (free, 21B parameter model)
    // Other options: google/gemini-2.0-flash-exp, anthropic/claude-3.5-sonnet, openai/gpt-4o-mini
    const modelName = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free'
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions'
    
    console.log('Calling OpenRouter API:', apiUrl)
    console.log('Model:', modelName)
    console.log('Messages count:', messages.length)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'ProGym Fitness Assistant',
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      let errorMessage = 'Failed to get AI response. Please try again.'
      try {
        const errorJson = JSON.parse(errorData)
        errorMessage = errorJson.error?.message || errorJson.error?.error?.message || errorMessage
        console.error('OpenRouter API Error:', response.status, errorJson)
      } catch {
        console.error('OpenRouter API Error:', response.status, errorData)
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0]) {
      console.error('Invalid OpenRouter API response:', JSON.stringify(data, null, 2))
      return NextResponse.json(
        { error: 'Invalid response from AI service. Please check the server logs.' },
        { status: 500 }
      )
    }

    const aiResponse = data.choices[0].message?.content

    if (!aiResponse) {
      console.error('Empty response from OpenRouter:', JSON.stringify(data, null, 2))
      return NextResponse.json(
        { error: 'Received empty response from AI service.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ response: aiResponse })
  } catch (error: any) {
    console.error('Chatbot API Error:', error)
    return NextResponse.json(
      { error: error?.message || 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

