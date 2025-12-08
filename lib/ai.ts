import { z } from 'zod';

// Rate Limiter Interface
interface RateLimiterOptions {
    limit: number;
    window: number; // in milliseconds
}

const rateLimitStore = new Map<string, { count: number; expires: number }>();

export function checkRateLimit(ip: string, options: RateLimiterOptions = { limit: 20, window: 60000 }): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.expires) {
        rateLimitStore.set(ip, { count: 1, expires: now + options.window });
        return true;
    }

    if (record.count >= options.limit) {
        return false;
    }

    record.count++;
    return true;
}

// AI Service Configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

// Validation Schemas
export const ChatMessageSchema = z.object({
    message: z.string().min(1).max(500),
});

export const SearchQuerySchema = z.object({
    query: z.string().min(1).max(200),
});

export const SuggestItemSchema = z.object({
    query: z.string().min(1).max(100),
});

interface GroqResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
    error?: {
        message: string;
    };
}

export async function callGroqApi(
    systemPrompt: string,
    userMessage: string,
    temperature: number = 0.7,
    maxTokens: number = 2000
) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Chave de API do Groq não configurada.");
    }

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature,
            max_tokens: maxTokens,
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        const errorData = await response.json() as GroqResponse;
        throw new Error(errorData.error?.message || 'Erro ao comunicar com a API do Groq');
    }

    const data = await response.json() as GroqResponse;
    const content = data.choices[0].message.content;

    return parseJsonContent(content);
}

function parseJsonContent(content: string) {
    try {
        let cleaned = content.trim();
        // Remove markdown code blocks if present
        cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
        cleaned = cleaned.replace(/^```\s*/i, "").replace(/\s*```$/i, "");
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Failed to parse AI response:", content);
        throw new Error("Falha ao processar resposta da IA");
    }
}
