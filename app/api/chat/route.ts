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
SEMPRE retorne uma resposta em formato JSON.

Se o usuário descrever um serviço ou pedir orçamento:
1. IDENTIFIQUE se a solicitação inclui materiais ou apenas mão de obra. Se não estiver claro, assuma AMBOS (Material + Mão de Obra) mas mencione na explicação que pode ser ajustado.
2. SUGIRA ITENS NECESSÁRIOS E CORRELATOS:
   - Quebre o serviço em etapas lógicas.
   - Inclua serviços preparatórios (demolição, limpeza) e de acabamento (pintura, limpeza final).
   - Sugira itens correlatos que geralmente são esquecidos (ex: rejunte para piso, primer para pintura).
   - NÃO se limite a 5 itens. Liste quantos forem necessários para uma estimativa correta.
3. MARQUE ITENS INCERTOS COMO OPCIONAIS:
   - Se houver dúvida se um item é necessário, inclua-o mas defina "included": false.
   
O formato do JSON deve ser EXATAMENTE este:
{
  "text": "Sua explicação técnica. Se relevante, pergunte se prefere apenas Mão de Obra ou Completo. Mencione itens opcionais sugeridos.",
  "suggestedBudget": {
    "title": "Título Sugerido do Projeto",
    "type": "material_labor" | "labor_only", // Identificado pelo contexto
    "items": [
      {
        "name": "Nome do Serviço",
        "unit": "unidade (m², m³, un, vb, etc)",
        "quantity": 1,
        "price": 0,
        "category": "Itens Adicionais",
        "included": true, // false se for uma sugestão opcional/incerta
        "type": "material" | "service" | "equipment" // Categorize o item
      }
    ]
  }
}

Se a pergunta for puramente teórica, retorne apenas "text" e "suggestedBudget": null.
Responda em Português do Brasil. Use preços SINAPI/Mercado atualizados.
SEMPRE retorne APENAS JSON válido.`;

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
