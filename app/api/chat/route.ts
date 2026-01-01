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
1. IDENTIFIQUE o escopo e gere uma lista de serviços completos.
2. SUGIRA ITENS NECESSÁRIOS E CORRELATOS:
   - Quebre o serviço em etapas lógicas.
   - Inclua serviços preparatórios (demolição, limpeza) e de acabamento (pintura, limpeza final).
   - Sugira itens correlatos que geralmente são esquecidos (ex: rejunte para piso, primer para pintura).
   - NÃO se limite a 5 itens. Liste quantos forem necessários para uma estimativa correta.
3. MARQUE ITENS INCERTOS COMO OPCIONAIS:
   - Se houver dúvida se um item é necessário, inclua-o mas defina "included": false.
   
O formato do JSON deve ser EXATAMENTE este:
{
  "text": "Sua explicação técnica...",
  "suggestedBudget": {
    "title": "Título do Projeto",
    "type": "material_labor",
    "items": [
      {
        "name": "Nome do Serviço",
        "unit": "un",
        "quantity": 1,
        "price": 100.00,
        "category": "12. PISOS E RODAPÉS",
        "included": true,
        "type": "service"
      }
    ]
  }
}

DIRETRIZES DE CATEGORIZAÇÃO (PADRÃO BANCO DE DADOS):
Use estritamente estas categorias para agrupar os itens (mantenha a numeração e nome exatos):
1. SERVIÇOS PRELIMINARES E GERAIS
2. DEMOLIÇÕES E RETIRADAS
3. MOVIMENTAÇÃO DE TERRA
4. INFRAESTRUTURA / FUNDAÇÕES
5. SUPERESTRUTURA
6. PAREDES E PAINÉIS
7. ESTRUTURAS METÁLICAS E MADEIRA
8. COBERTURA E TELHADO
9. IMPERMEABILIZAÇÃO
10. REVESTIMENTOS DE PAREDE
11. FORROS
12. PISOS E RODAPÉS
13. ESQUADRIAS E VIDROS
14. INSTALAÇÕES ELÉTRICAS
15. INSTALAÇÕES HIDRÁULICAS
16. LOUÇAS E METAIS
17. PINTURA
18. SERVIÇOS FINAIS / DIVERSOS
- Se não se encaixar, use: "ITENS ADICIONAIS"

DIRETRIZES DE INTELIGÊNCIA DE ORÇAMENTO (SISTEMA DE COMPOSIÇÕES):

1. REGRA DE OURO: "SERVIÇO INSTALADO"
   - O sistema já calcula Material + Mão de Obra automaticamente dentro de cada serviço.
   - NUNCA sugira insumos soltos (ex: "Saco de Cimento", "Lata de Tinta", "Tijolo", "Fios").
   - SEMPRE sugira o serviço finalizado (ex: "Alvenaria de Vedação m²", "Pintura Acrílica m²", "Ponto de Tomada Instalado").
   - Motivo: Se você sugerir o material separado, o custo será duplicado.

2. CLASSIFICAÇÃO DE ESCOPO:
   - Identifique se o pedido é um MICRO SERVIÇO ou MACRO PROJETO.
   - Para reformas, sugira sempre a REMOÇÃO/DEMOLIÇÃO do item antigo antes do novo.

3. PRECIFICAÇÃO:
   - Os preços sugeridos devem representar o valor TOTAL (Material + Mão de Obra). O sistema cuidará de separar as porcentagens internamente.
   - Exemplo: Ao sugerir "Pintura", use o preço cheio (~R$ 35,00/m²), não apenas a mão de obra.

4. CATEGORIZAÇÃO VISUAL:
   - Use 'type: "service"' para quase tudo, pois são composições.
   - Use 'type: "material"' APENAS se o usuário pedir explicitamente "Lista de compras de materiais".

5. PARA "MACRO PROJETOS" (Casas, Edificações):
   - **CUB 2025:** Custo mínimo R$ 2.000,00/m².
   - Liste etapas cronológicas: 1. Preliminares -> 2. Fundação -> 3. Estrutura -> ... -> 18. Finais.

SEMPRE retorne APENAS JSON válido. Responda em Português.`;

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
