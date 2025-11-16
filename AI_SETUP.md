# AI Chatbot Setup Guide

## Overview
The AI chatbot is integrated into the ProGym website and can answer questions about fitness, workouts, nutrition, and gym-related topics only.

## Supported AI Providers

### 🌟 RECOMMENDED: OpenRouter (UNIFIED INTERFACE) ⭐
- **Access to 500+ models** from all major providers (Google, OpenAI, Anthropic, etc.)
- Better prices, better uptime, no subscription required
- **1 million free BYOK requests per month** (Bring Your Own Key)
- **Default model: `openai/gpt-oss-20b:free`** - 100% FREE, 21B parameter model
- Get API key: https://openrouter.ai/keys
- Add to your `.env.local` file:
  ```
  OPENROUTER_API_KEY=your_openrouter_api_key_here
  OPENROUTER_MODEL=openai/gpt-oss-20b:free
  ```
- Popular model options:
  - `openai/gpt-oss-20b:free` (default - 100% FREE, 21B parameters)
  - `google/gemini-2.0-flash-exp` (fast, free tier available)
  - `anthropic/claude-3.5-sonnet` (high quality)
  - `openai/gpt-4o-mini` (balanced)
  - See all models: https://openrouter.ai/models

### 🆓 FREE OPTIONS (Alternative)

#### 1. Google Gemini (BEST FREE OPTION)
- **100% FREE** - Generous free tier, no credit card required
- Fast and reliable
- Get API key: https://aistudio.google.com/apikey
- Add to your `.env.local` file:
  ```
  GEMINI_API_KEY=your_gemini_api_key_here
  GEMINI_MODEL=gemini-pro
  ```

#### 2. Groq (FREE & VERY FAST)
- **FREE** - Fast inference, good for real-time chat
- Get API key: https://console.groq.com/keys
- Add to your `.env.local` file:
  ```
  GROQ_API_KEY=your_groq_api_key_here
  GROQ_MODEL=llama-3.1-8b-instant
  ```

#### 3. Hugging Face (FREE)
- **FREE** - Open source models
- Get API key: https://huggingface.co/settings/tokens
- Add to your `.env.local` file:
  ```
  HUGGINGFACE_API_KEY=your_hf_api_key_here
  HUGGINGFACE_MODEL=meta-llama/Llama-3.1-8B-Instruct
  ```

### 💰 PAID OPTIONS (Better Quality)

#### 4. OpenAI
- Supports GPT-3.5-turbo, GPT-4, and other OpenAI models
- Has free tier but limited (requires credit card)
- Add to your `.env.local` file:
  ```
  OPENAI_API_KEY=your_openai_api_key_here
  OPENAI_MODEL=gpt-3.5-turbo
  ```

#### 5. Anthropic Claude
- Supports Claude 3 Sonnet and other Claude models
- Paid service
- Add to your `.env.local` file:
  ```
  ANTHROPIC_API_KEY=your_anthropic_api_key_here
  ANTHROPIC_MODEL=claude-3-sonnet-20240229
  ```

## Setup Instructions

1. **Get an API Key**
   - **OpenRouter (Recommended)**: 
     - Go to https://openrouter.ai
     - Sign up with Google, GitHub, or MetaMask
     - Buy credits (or use BYOK - Bring Your Own Key for free tier)
     - Go to https://openrouter.ai/keys and create an API key
     - Copy the key
   - **Google Gemini (Alternative FREE)**: 
     - Go to https://aistudio.google.com/apikey
     - Sign in with Google account
     - Click "Create API Key"
     - Copy the key (starts with `AIza...`)
   - **Groq**: 
     - Go to https://console.groq.com/keys
     - Sign up for free account
     - Create API key
   - **Hugging Face**: 
     - Go to https://huggingface.co/settings/tokens
     - Create account and generate token

2. **Add API Key to Environment Variables**
   - Create a `.env.local` file in the root of your project (if it doesn't exist)
   - Add your API key based on provider:
     ```
     # For OpenRouter (Recommended - Access to 500+ models)
     OPENROUTER_API_KEY=sk-or-v1-your-key-here
     OPENROUTER_MODEL=openai/gpt-oss-20b:free
     
     # OR for Google Gemini (FREE - Alternative)
     GEMINI_API_KEY=AIza-your-key-here
     
     # OR for Groq (FREE)
     GROQ_API_KEY=gsk-your-key-here
     
     # OR for Hugging Face (FREE)
     HUGGINGFACE_API_KEY=hf-your-key-here
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

# AI API Key (choose one - OpenRouter recommended)
# RECOMMENDED: OpenRouter (unified interface for 500+ models)
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-oss-20b:free
# Popular models: openai/gpt-oss-20b:free (FREE), google/gemini-2.0-flash-exp, anthropic/claude-3.5-sonnet, openai/gpt-4o-mini

# FREE OPTIONS (Alternative):
# GEMINI_API_KEY=your_gemini_api_key_here
# GROQ_API_KEY=your_groq_api_key_here
# HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# PAID OPTIONS:
# OPENAI_API_KEY=your_openai_api_key_here
# ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Model selection (for non-OpenRouter providers)
# GEMINI_MODEL=gemini-pro
# GROQ_MODEL=llama-3.1-8b-instant
# HUGGINGFACE_MODEL=meta-llama/Llama-3.1-8B-Instruct
```

## Security

- **Never commit `.env.local` to git** - It contains sensitive API keys
- The `.env.local` file is already in `.gitignore`
- API keys are only used server-side in the API route

