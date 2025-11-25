# OpenAI Configuration for AI Assistant

This application now uses **OpenAI GPT-4o-mini** for the AI Assistant feature.

## Setup Instructions

1. **Get your OpenAI API Key**:
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key (starts with `sk-...`)

2. **Configure the environment variable**:
   - Open or create `.env.local` in the project root
   - Add the following line:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```
   - Replace `sk-your-api-key-here` with your actual API key

3. **Restart the development server**:
   ```bash
   npm run dev
   ```

## Why OpenAI instead of Gemini?

- ✅ More stable API with better uptime
- ✅ Native JSON mode support (`response_format: { type: "json_object" }`)
- ✅ Better free tier quota management
- ✅ Excellent for structured data generation (perfect for budget estimates)
- ✅ More predictable pricing

## Model Used

- **gpt-4o-mini**: Fast, cost-effective, and perfect for this use case
- Alternative: You can change to `gpt-4o` for even better results (but higher cost)

## Pricing (as of 2024)

**GPT-4o-mini**:
- Input: $0.150 / 1M tokens
- Output: $0.600 / 1M tokens

For typical usage (10-20 queries per day), this will cost less than $1/month.

## Testing

Try asking the AI Assistant:
- "Quanto custa construir uma piscina de 8x4 metros?"
- "Preciso reformar um banheiro de 6m²"
- "Quanto custa fazer um muro de 20 metros?"

The AI will return a structured budget with items, quantities, and estimated prices.
