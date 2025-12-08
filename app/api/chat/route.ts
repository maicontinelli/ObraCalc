import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Chave de API do Groq não configurada." },
                { status: 500 }
            );
        }

        const systemPrompt = `Você é um assistente especialista em Engenharia Civil e Orçamentos de Obras.
Seu objetivo é ajudar usuários a tirar dúvidas técnicas e criar estimativas de custos.

IMPORTANTE:
Sempre que o usuário descrever um serviço ou pedir um orçamento (ex: "quanto custa um muro", "reformar banheiro", "pintar casa"),
você DEVE retornar uma resposta em formato JSON que contenha tanto a explicação em texto quanto uma lista de itens sugeridos para o orçamento.

O formato do JSON deve ser EXATAMENTE este:
{
  "text": "Sua explicação técnica, conselhos e ressalvas aqui...",
  "suggestedBudget": {
    "title": "Título Sugerido do Projeto",
    "items": [
      {
        "name": "Nome do Serviço",
        "unit": "unidade (m², m³, un, vb, etc)",
        "quantity": 1,
        "price": 0,
        "category": "Itens Adicionais"
      }
    ]
  }
}

Se a pergunta for puramente teórica (ex: "o que é fck?"), retorne apenas o campo "text" no JSON, com "suggestedBudget" como null.

Responda sempre em Português do Brasil.
Seja técnico mas acessível.
Use preços de mercado realistas para o Brasil (base SINAPI/média de mercado) quando possível.
SEMPRE retorne APENAS JSON válido, sem texto adicional antes ou depois, sem markdown.`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Erro ao comunicar com a API do Groq');
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Parse the JSON response
        let parsedResponse;
        try {
            // Clean up any potential markdown or extra text
            let cleanedResponse = aiResponse.trim();
            cleanedResponse = cleanedResponse.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
            cleanedResponse = cleanedResponse.replace(/^```\s*/i, "").replace(/\s*```$/i, "");

            parsedResponse = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", aiResponse);
            // Fallback: return text-only response
            parsedResponse = {
                text: aiResponse,
                suggestedBudget: null
            };
        }

        return NextResponse.json(parsedResponse);

    } catch (error: any) {
        console.error("Error calling Groq API:", error);
        return NextResponse.json(
            {
                error: error?.message || "Falha ao processar solicitação com a IA.",
                text: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
                suggestedBudget: null
            },
            { status: 500 }
        );
    }
}
