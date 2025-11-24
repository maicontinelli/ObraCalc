import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Chave de API do Gemini não configurada." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
      Você é um assistente especialista em Engenharia Civil e Orçamentos de Obras.
      Seu objetivo é ajudar usuários a tirar dúvidas técnicas e criar estimativas de custos.
      
      IMPORTANTE:
      Sempre que o usuário descrever um serviço ou pedir um orçamento (ex: "quanto custa um muro", "reformar banheiro", "pintar casa"),
      você DEVE retornar uma resposta em formato JSON estrito que contenha tanto a explicação em texto quanto uma lista de itens sugeridos para o orçamento.
      
      O formato do JSON deve ser EXATAMENTE este:
      {
        "text": "Sua explicação técnica, conselhos e ressalvas aqui...",
        "suggestedBudget": {
          "title": "Título Sugerido do Projeto",
          "items": [
            {
              "name": "Nome do Serviço",
              "unit": "unidade (m², m³, un, vb, etc)",
              "quantity": 0, // Tente estimar a quantidade com base no input do usuário, ou use 1 se incerto
              "price": 0, // Preço unitário estimado de mercado (BRL). Se não souber, use 0.
              "category": "Categoria (Preliminares, Fundação, Estrutura, Alvenaria, Cobertura, Instalações, Acabamentos, ou Outros)"
            }
          ]
        }
      }

      Se a pergunta for puramente teórica (ex: "o que é fck?"), retorne apenas o campo "text" no JSON, com "suggestedBudget" como null.
      
      Responda sempre em Português do Brasil.
      Seja técnico mas acessível.
      Use preços de mercado realistas para o Brasil (base SINAPI/média de mercado) quando possível.
    `;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Entendido. Estou configurado para atuar como especialista em Engenharia Civil e Orçamentos, retornando respostas em JSON estruturado com sugestões de orçamento quando apropriado." }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        let text = response.text();

        // Clean up markdown code blocks if present to ensure valid JSON parsing
        text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");

        return NextResponse.json(JSON.parse(text));

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return NextResponse.json(
            { error: "Falha ao processar solicitação com a IA." },
            { status: 500 }
        );
    }
}
