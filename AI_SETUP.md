# AI Chatbot Setup Guide

## Overview
The AI chatbot is integrated into the ProGym website and can answer questions about fitness, workouts, nutrition, and gym-related topics only.

## Supported AI Providers

### 1. OpenAI (Recommended)
- Supports GPT-3.5-turbo, GPT-4, and other OpenAI models
- Add to your `.env.local` file:
  ```
  OPENAI_API_KEY=your_openai_api_key_here
  OPENAI_MODEL=gpt-3.5-turbo
  ```

### 2. Anthropic Claude
- Supports Claude 3 Sonnet and other Claude models
- Add to your `.env.local` file:
  ```
  ANTHROPIC_API_KEY=your_anthropic_api_key_here
  ANTHROPIC_MODEL=claude-3-sonnet-20240229
  ```

### 3. Generic AI API Key
- If you have a different AI provider with OpenAI-compatible API
- Add to your `.env.local` file:
  ```
  AI_API_KEY=your_ai_api_key_here
  OPENAI_MODEL=your_model_name
  ```

## Setup Instructions

1. **Get an API Key**
   - For OpenAI: Sign up at https://platform.openai.com/ and get an API key
   - For Anthropic: Sign up at https://www.anthropic.com/ and get an API key
   - For other providers: Check their documentation

2. **Add API Key to Environment Variables**
   - Create a `.env.local` file in the root of your project (if it doesn't exist)
   - Add your API key:
     ```
     OPENAI_API_KEY=sk-your-key-here
     ```
   - Or for Anthropic:
     ```
     ANTHROPIC_API_KEY=sk-ant-your-key-here
     ```

3. **Restart Development Server**
   - Stop your development server (Ctrl+C)
   - Run `npm run dev` again
   - The chatbot should now work!

## Important Notes

- **System Prompt**: The chatbot is configured to ONLY answer questions about fitness, workouts, nutrition, gym, health, and wellness. It will redirect users if they ask about other topics.
- **Authentication**: Users must be logged in to use the chatbot
- **API Costs**: Be aware that AI API calls cost money. Monitor your usage to avoid unexpected charges.
- **Rate Limiting**: Some AI providers have rate limits. The chatbot will show error messages if limits are exceeded.

## Testing

1. Log in to the website
2. Navigate to "AI Assistant" in the navigation
3. Ask a fitness-related question
4. The chatbot should respond with helpful fitness advice

## Troubleshooting

- **"AI API key not configured"**: Make sure your API key is in `.env.local` and the server is restarted
- **"Error communicating with AI"**: Check if your API key is valid and you have credits/usage remaining
- **Chatbot not responding**: Check the browser console and server logs for error messages

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration (already set up)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI API Key (choose one)
OPENAI_API_KEY=your_openai_api_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_api_key_here
# OR
AI_API_KEY=your_generic_ai_api_key_here

# Optional: Model selection
OPENAI_MODEL=gpt-3.5-turbo
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

## Security

- **Never commit `.env.local` to git** - It contains sensitive API keys
- The `.env.local` file is already in `.gitignore`
- API keys are only used server-side in the API route

