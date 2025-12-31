import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { items } = await req.json();
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Chave de API do Groq não configurada." },
                { status: 500 }
            );
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ prices: [] });
        }

        // Limit batch size to avoid token limits
        const batch = items.slice(0, 30);

        const systemPrompt = `Você é um especialista em custos de construção civil no Brasil (Sinapi/Mercado).
Receba uma lista de itens e retorne o preço unitário médio de mercado em Reais (BRL).
Seja preciso e realista.
Retorne APENAS um JSON com o formato:
{
  "prices": [
    { "name": "Nome do item", "price": 123.45 },
    ...
  ]
}
Mantenha a ordem dos itens.`;

        const userPrompt = `Precifique estes itens para uma reforma:
${batch.map((i: any) => `- ${i.name} (${i.unit})`).join('\n')}`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.1,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error('Erro na API Groq');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);

        return NextResponse.json(parsed);

    } catch (error: any) {
        console.error("Batch Price Error:", error);
        // Fallback: return 0 prices to avoid crashing
        return NextResponse.json({ prices: [] });
    }
}
