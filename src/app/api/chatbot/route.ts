import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `
You are a helpful AI fitness assistant for ProGym, a professional fitness training facility.
Your role is to assist users with:
1. Fitness and workout questions
2. Exercise techniques and form advice
3. Nutrition and diet recommendations
4. Gym equipment usage
5. Workout program suggestions
6. Fitness goal setting
7. Health and wellness tips related to fitness
8. Gym etiquette and safety

IMPORTANT RULES:
- ONLY answer questions related to fitness, workouts, nutrition, gym, health, and wellness
- If asked about unrelated topics, reply:
  "I'm a fitness assistant and can only help with gym and fitness-related questions. Is there anything about workouts, nutrition, or fitness I can help you with?"
- Be friendly, accurate, and motivational.
- Prioritize safety and proper form.
`

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const GEMINI_MODEL = 'google/gemini-2.0-flash-exp:free'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get and trim API key to remove any whitespace
    const apiKey = process.env.OPENROUTER_API_KEY?.trim()
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY is not set in environment variables')
      return NextResponse.json(
        {
          error: 'API key not configured',
          response:
            'Please add your OpenRouter API key (OPENROUTER_API_KEY) in .env.local and restart the server.',
        },
        { status: 500 }
      )
    }

    // Validate API key format (should start with sk-or-v1-)
    if (!apiKey.startsWith('sk-or-v1-')) {
      console.error('Invalid API key format. OpenRouter keys should start with "sk-or-v1-"')
      return NextResponse.json(
        {
          error: 'Invalid API key format',
          response:
            'The API key format is incorrect. OpenRouter API keys should start with "sk-or-v1-". Please check your OPENROUTER_API_KEY in .env.local.',
        },
        { status: 500 }
      )
    }

    // Log API key presence (first 15 chars only for security)
    console.log('API Key found:', apiKey.substring(0, 15) + '...', 'Length:', apiKey.length)

    // Build conversation history with system prompt
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(conversationHistory || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ]

    const requestBody = {
      model: GEMINI_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }

    console.log('Sending request to OpenRouter:', {
      url: OPENROUTER_API_URL,
      model: GEMINI_MODEL,
      messagesCount: messages.length,
    })

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.OPENROUTER_REFERER || 'https://progym.com',
        'X-Title': process.env.OPENROUTER_TITLE || 'ProGym AI Assistant',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenRouter API Error:', errorData)
      
      // Handle authentication errors specifically
      if (response.status === 401 || response.status === 403) {
        const authError = errorData?.error?.message || errorData?.message || 'Invalid API key'
        console.error('Authentication failed. Error details:', authError)
        return NextResponse.json(
          {
            error: 'Authentication failed',
            response: `Invalid API key: ${authError}. Please verify your OPENROUTER_API_KEY in .env.local is correct and restart the server. You can get a new API key from https://openrouter.ai/keys`,
          },
          { status: response.status }
        )
      }
      
      // Handle rate limit errors
      if (response.status === 429) {
        const errorMessage = errorData?.error?.metadata?.raw || errorData?.error?.message || ''
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            response: errorMessage.includes('rate-limited')
              ? 'The free Gemini model is currently rate-limited. Please add your Google API key to OpenRouter: https://openrouter.ai/settings/integrations, or try again in a few moments.'
              : 'Too many requests. Please try again in a few moments.',
          },
          { status: 429 }
        )
      }
      
      // Handle other errors
      const errorMessage = errorData?.error?.message || errorData?.message || 'Unknown error'
      return NextResponse.json(
        {
          error: 'API request failed',
          response: `AI service error: ${errorMessage}. Please check your API key and try again.`,
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    const aiResponse =
      data.choices?.[0]?.message?.content ||
      data.choices?.[0]?.text ||
      'No response received.'

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('Chatbot API Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        response: 'AI service failed. Try again later.',
      },
      { status: 500 },
    )
  }
}
