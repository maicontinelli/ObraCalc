import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { query } = await req.json();
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Chave de API do Groq não configurada." },
                { status: 500 }
            );
        }

        const systemPrompt = `Você é um especialista em orçamentos de obras civis no Brasil.
Sua tarefa é sugerir UM ÚNICO item de orçamento com base no termo pesquisado pelo usuário.
O item deve ter um preço de mercado realista (base SINAPI ou mercado atual) em Reais (BRL).

Retorne APENAS um objeto JSON com o seguinte formato, sem markdown ou texto adicional:
{
  "name": "Nome técnico e descritivo do item",
  "unit": "unidade (m², m³, un, kg, vb, etc)",
  "price": 123.45,
  "category": "Itens Adicionais"
}

Se o termo for vago, faça sua melhor estimativa para um serviço comum relacionado.`;

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
                        content: `Sugira um item para: "${query}"`
                    }
                ],
                temperature: 0.3,
                max_tokens: 500,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Erro ao comunicar com a API do Groq');
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        let parsedResponse;
        try {
            let cleanedResponse = aiResponse.trim();
            // Remove markdown code blocks if present
            cleanedResponse = cleanedResponse.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
            cleanedResponse = cleanedResponse.replace(/^```\s*/i, "").replace(/\s*```$/i, "");
            
            parsedResponse = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error("Failed to parse AI response:", aiResponse);
            throw new Error("Falha ao processar resposta da IA");
        }

        return NextResponse.json(parsedResponse);

    } catch (error: any) {
        console.error("Error in suggest-item API:", error);
        return NextResponse.json(
            { error: error?.message || "Erro ao gerar sugestão." },
            { status: 500 }
        );
    }
}
