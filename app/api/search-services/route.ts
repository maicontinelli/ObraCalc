import { NextResponse } from "next/server";
import { callGroqApi, checkRateLimit, SearchQuerySchema } from "@/lib/ai";

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
        const validation = SearchQuerySchema.safeParse(body);

        if (!validation.success) {
             return NextResponse.json(
                { error: "Entrada inválida.", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { query } = validation.data;

        const systemPrompt = `Você é um especialista em orçamentos de obras civis no Brasil.
Sua tarefa é sugerir UMA LISTA de 3 a 5 itens de orçamento relevantes com base na descrição fornecida pelo usuário.
Cada item deve ter um preço de mercado realista (base SINAPI ou mercado atual) em Reais (BRL).

Retorne APENAS um objeto JSON com o seguinte formato, sem markdown ou texto adicional:
{
  "suggestions": [
    {
      "name": "Nome técnico e descritivo do serviço/item",
      "unit": "unidade (m², m³, un, kg, vb, etc)",
      "price": 123.45,
      "quantity": 1,
      "description": "Breve descrição opcional do que está incluso"
    }
  ]
}

Importante:
- Sugira de 3 a 5 itens relacionados à solicitação
- Use preços realistas do mercado brasileiro
- Seja específico nos nomes dos serviços
- Inclua unidades corretas`;

        const result = await callGroqApi(
            systemPrompt,
            `Usuário precisa: "${query}". Sugira serviços/itens relevantes com preços.`,
            0.5,
            1500
        );

        // Validate response structure
        if (!result.suggestions || !Array.isArray(result.suggestions)) {
            throw new Error("Resposta da IA em formato inválido");
        }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Error in search-services API:", error);
        return NextResponse.json(
            { error: error?.message || "Erro ao buscar serviços." },
            { status: 500 }
        );
    }
}
