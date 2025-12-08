import { NextResponse } from "next/server";
import { callGroqApi, checkRateLimit, ChatMessageSchema } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        // Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Muitas requisições. Tente novamente em alguns segundos." },
                { status: 429 }
            );
        }

        // Input Validation
        const body = await req.json();
        const validation = ChatMessageSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Entrada inválida.", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { message } = validation.data;

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

        try {
            const result = await callGroqApi(systemPrompt, message, 0.7, 2000);
            return NextResponse.json(result);
        } catch (parseError) {
             // Fallback for when JSON parsing fails inside callGroqApi or if it returns invalid structure
             // (Though callGroqApi handles JSON parse errors, we might want a fallback response structure here if it failed)
             return NextResponse.json({
                text: "Desculpe, ocorreu um erro ao processar a resposta da IA.",
                suggestedBudget: null
            });
        }

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
