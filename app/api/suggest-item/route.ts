import { NextResponse } from "next/server";
import { callGroqApi, checkRateLimit, SuggestItemSchema } from "@/lib/ai";

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
        const validation = SuggestItemSchema.safeParse(body);

        if (!validation.success) {
             return NextResponse.json(
                { error: "Entrada inválida.", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { query } = validation.data;

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

        const result = await callGroqApi(
            systemPrompt,
            `Sugira um item para: "${query}"`,
            0.3,
            500
        );

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Error in suggest-item API:", error);
        return NextResponse.json(
            { error: error?.message || "Erro ao gerar sugestão." },
            { status: 500 }
        );
    }
}
