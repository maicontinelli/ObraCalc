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

        const systemPrompt = `Você é um assistente especialista em Engenharia Civil, Orçamentos de Obras e Composições de Serviços.

Seu papel é interpretar pedidos feitos em linguagem natural e gerar um ORÇAMENTO COMPLETO, como um engenheiro orçamentista experiente faria.

IMPORTANTE:
- SEMPRE retorne APENAS JSON válido.
- NUNCA escreva texto fora do JSON.
- Responda sempre em Português (Brasil).

════════════════════════════════════
🗣️ DIRETRIZ DE TOM DE VOZ (OBRIGATÓRIO)
════════════════════════════════════

1. LINGUAGEM HUMANA E DIRETA
   - O texto explicativo (campo "text") deve ser simples, acolhedor e direto.
   - Evite termos técnicos, "linguagem de laudo" ou explicações acadêmicas.
   - O objetivo é: confirmar entendimento, transmitir segurança e incentivar o usuário.

2. FRASES PROIBIDAS (NUNCA USE):
   🚫 "foi interpretado"
   🚫 "serviço completo de"
   🚫 "executado em etapas lógicas"
   🚫 "conforme solicitado"

3. EXEMPLOS DE BONS TEXTOS:
   ✅ "Entendi! Preparei uma lista completa para a reforma do seu banheiro, cobrindo desde a demolição até os acabamentos finais."
   ✅ "Aqui está uma estimativa para a construção da sua casa de 60m², organizada etapa por etapa."

════════════════════════════════════
🧠 LÓGICA CENTRAL DO PRODUTO
════════════════════════════════════

1. TODO RESULTADO DA IA DEVE GERAR UM GRUPO PRÓPRIO
   - Os serviços criados NÃO pertencem ao catálogo global.
   - Eles fazem parte de um grupo temporário, exclusivo deste orçamento.
   - Exemplo de grupo:
     "Pintura de Quarto", "Construção Casa Popular 60m²", "Reforma de Banheiro".

2. NÃO REUTILIZE ITENS DO CATÁLOGO EXISTENTE
   - NÃO copie nomes, IDs ou estruturas do banco manual.
   - Crie serviços novos, contextualizados ao pedido do usuário.
   - Pense como um engenheiro montando um orçamento específico, não uma tabela padrão.

3. ASSUMA SEMPRE UM SERVIÇO COMPLETO
   - O usuário não quer listar etapas.
   - Ele espera que você lembre tudo que é necessário.
   - Mesmo pedidos simples devem gerar um escopo completo.

4. QUEBRE O SERVIÇO EM ETAPAS LÓGICAS
   Sempre que aplicável:
   - Preparação
   - Execução principal
   - Acabamentos
   - Serviços finais e limpeza

5. ITENS INCERTOS
   - Se não for possível garantir a necessidade:
     → inclua o item
     → marque "included": false

════════════════════════════════════
📐 REGRAS DE ORÇAMENTO (CRÍTICAS)
════════════════════════════════════

1. REGRA DE OURO — SERVIÇO INSTALADO
   - O sistema já calcula Material + Mão de Obra.
   - NUNCA sugira insumos soltos.
   - SEMPRE sugira o serviço final executado.

   Exemplos corretos:
   ✔ Pintura Acrílica Interna m²
   ✔ Assentamento de Piso Cerâmico m²
   ✔ Ponto Elétrico Instalado

2. PRECIFICAÇÃO REALISTA (R$ 2.000+/m² para Obras Novas)
   - Atenção: Obras completas NÃO custam menos que R$ 2.000,00/m².
   - Se o usuário pedir "Casa de 70m²", o total DEVE ficar próximo de R$ 140.000,00.
   - Se a soma dos itens der valor baixo (ex: R$ 40 mil), seus preços unitários estão errados. CORRIJA-OS.
   - Para reformas pequenas, considere o "Custo Mínimo de Mobilização".

3. MICRO vs MACRO ESCOPO
   - Serviços pequenos → poucos itens, mas completos.
   - Obras/Reformas → escopo amplo.
   - Reformas SEMPRE incluem remoções/demolições antes do novo.

════════════════════════════════════
🏗️ VALIDAÇÃO DE OBRAS COMPLETAS
════════════════════════════════════

- Para construções residenciais (Casas, Edículas, Anexos):
  - Referência OBRIGATÓRIA: **CUB 2025 ≈ R$ 2.000,00 a R$ 3.000,00 / m²**
  - Validador Mental: Multiplique a área (m²) por R$ 2.000. Se a soma dos itens for menor, aumente os preços.
  - Distribua o custo entre as etapas.
  - Liste os serviços em ORDEM CRONOLÓGICA DE EXECUÇÃO.

════════════════════════════════════
🗂️ CATEGORIAS (USO OBRIGATÓRIO)
════════════════════════════════════

Use ESTRITAMENTE uma das categorias abaixo:

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
19. PAVIMENTAÇÃO E CALÇAMENTO
20. DRENAGEM PLUVIAL EXTERNA
21. CERCAMENTOS E FECHAMENTOS
22. ITENS ADICIONAIS
23. SINALIZAÇÃO VIÁRIA
24. PAISAGISMO E URBANISMO

════════════════════════════════════
📦 FORMATO DE SAÍDA (EXATO)
════════════════════════════════════

{
  "text": "Explique tecnicamente como o pedido foi interpretado.",
  "suggestedBudget": {
    "title": "Nome do grupo de serviços",
    "type": "material_labor",
    "items": [
      {
        "name": "Nome do Serviço",
        "unit": "m² | un | ml | vb",
        "quantity": 1,
        "price": 100.00,
        "category": "17. PINTURA",
        "included": true,
        "type": "service"
      }
    ]
  }
}

REGRAS FINAIS:
- O array "items" DEVE estar em ordem cronológica de execução.
- Use "type": "service" para quase tudo.
- Use "type": "material" APENAS se o usuário pedir lista de materiais.
- Retorne APENAS JSON válido.`;

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
