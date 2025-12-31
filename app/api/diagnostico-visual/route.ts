import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const { image, formData } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API do Gemini não configurada' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Usando o alias exato que apareceu na sua lista: gemini-flash-latest
        const model = genAI.getGenerativeModel({
            model: 'gemini-flash-latest'
        });

        // Remover prefixo data:image
        const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

        const systemPrompt = `# PERSONA E OBJETIVO
Você é o "Engenheiro Sênior do ObraCalc", especialista em diagnóstico e orçamento de reformas residenciais no Brasil. Sua missão é analisar imagens de ambientes, cruzar com as intenções do usuário e gerar uma lista técnica de serviços precisa e segmentada.

# LÓGICA DE LOCALIZAÇÃO VISUAL (O "GRID")
Para conectar o orçamento à imagem, você deve dividir mentalmente a imagem em um Grid 3x3 e classificar onde está o foco de cada grupo de serviços:

[1] [2] [3]  (Teto / Sancas / Iluminação Alta)
[4] [5] [6]  (Paredes / Janelas / Portas / Meio)
[7] [8] [9]  (Piso / Rodapés / Móveis Baixos)

# DADOS DO PROJETO (Inputs do Usuário)
1. Objetivo: ${formData.objetivo}
2. Padrão: ${formData.padrao}
3. Instalações: ${formData.instalacoes}
4. Ocupação: ${formData.ocupacao}
5. Área Informada: ${formData.area}m²
${formData.observacoes ? `6. Observações do Cliente: "${formData.observacoes}"` : ''}

# DIRETRIZES DE ANÁLISE
1. **Analise a Intenção:** Respeite estritamente o "Objetivo da Obra" e o "Padrão de Acabamento" informados pelo usuário. Se ele disse "Básico", não sugira porcelanato importado.
2. **Seja Conservador:** Se não conseguir ver a elétrica, mas a casa for antiga, sugira "Revisão de Elétrica" apenas se o usuário pediu reforma completa.
3. **Agrupamento:** Nunca gere uma lista solta. Agrupe serviços por macro-elementos (Piso, Paredes, Teto).
4. **Nomenclatura SINAPI:** Use termos técnicos compatíveis com tabelas SINAPI/mercado brasileiro.

# FORMATO DE SAÍDA (JSON ESTRITO)
Sua saída deve ser APENAS um objeto JSON válido, sem markdown, com a seguinte estrutura:

{
  "analise_geral": {
    "ambiente_identificado": "String (ex: Cozinha Americana)",
    "area_estimada_m2": ${formData.area},
    "complexidade_obra": "Baixa/Média/Alta"
  },
  "grupos_servicos": [
    {
      "id_grupo": 1,
      "quadrante_foco": Number (1 a 9, escolha o mais representativo),
      "titulo_amigavel": "String (ex: Renovação do Piso)",
      "diagnostico_visual": "String (ex: Piso cerâmico antigo com rejunte encardido. Necessária troca.)",
      "itens": [
        {
          "servico": "String (Nome técnico do serviço para orçar)",
          "unidade": "m2/m/un/vb",
          "quantidade": Number,
          "material_sugerido": "String (ex: Piso Vinílico Colado 3mm)"
        }
      ]
    }
  ]
}

IMPORTANTE:
- Cada grupo deve ter UM único quadrante_foco (não repita quadrantes)
- Se houver mais serviços que quadrantes disponíveis, agrupe melhor
- Quantidade deve ser realista baseada na área informada
- Retorne APENAS o JSON, sem texto adicional`;

        const result = await model.generateContent([
            systemPrompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: 'image/jpeg'
                }
            }
        ]);

        const responseText = result.response.text();
        console.log('📝 Gemini Raw Response:', responseText);

        // Extrair JSON da resposta (Gemini às vezes adiciona markdown)
        let jsonMatch = responseText.match(/\{[\s\S]*\}/);

        // Se não encontrou JSON, tentar remover markdown
        if (!jsonMatch) {
            const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        }

        if (!jsonMatch) {
            console.error('❌ Gemini não retornou JSON válido:', responseText);
            return NextResponse.json(
                {
                    error: 'A IA não conseguiu analisar a imagem. Tente com outra foto mais clara.',
                    details: responseText
                },
                { status: 422 }
            );
        }

        let diagnostico;
        try {
            diagnostico = JSON.parse(jsonMatch[0]);
            console.log('✅ Diagnóstico parseado:', diagnostico);
        } catch (parseError) {
            console.error('❌ Erro ao parsear JSON do Gemini:', parseError);
            return NextResponse.json(
                { error: 'Erro ao processar resposta da IA. Tente novamente.' },
                { status: 422 }
            );
        }

        // Validar estrutura do JSON
        if (!diagnostico.analise_geral || !diagnostico.grupos_servicos) {
            console.error('❌ JSON inválido - faltam campos obrigatórios:', diagnostico);
            return NextResponse.json(
                { error: 'Análise incompleta. Tente com uma foto mais detalhada.' },
                { status: 422 }
            );
        }

        // Agora vamos precificar com Groq
        console.log('💰 Iniciando precificação...');
        const itemsParaPrecificar = diagnostico.grupos_servicos.flatMap((grupo: any) =>
            grupo.itens.map((item: any) => ({
                name: item.servico,
                unit: item.unidade,
                quantity: item.quantidade
            }))
        );

        console.log(`📊 Itens para precificar: ${itemsParaPrecificar.length}`);

        let prices = [];
        try {
            const priceResponse = await fetch('http://localhost:3000/api/batch-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: itemsParaPrecificar })
            });

            if (priceResponse.ok) {
                const priceData = await priceResponse.json();
                prices = priceData.prices || [];
                console.log('✅ Precificação concluída:', prices.length, 'preços');
            } else {
                console.warn('⚠️ Falha na precificação, usando valores padrão');
            }
        } catch (priceError) {
            console.error('❌ Erro ao precificar:', priceError);
            // Continuar mesmo se precificação falhar
        }

        // Aplicar preços aos itens (com margem de segurança de 7%)
        let priceIndex = 0;
        diagnostico.grupos_servicos.forEach((grupo: any) => {
            grupo.itens.forEach((item: any) => {
                const basePrice = prices[priceIndex]?.price || 50; // Fallback: R$50
                item.preco_unitario = Math.round(basePrice * 1.07 * 100) / 100;
                item.preco_total = Math.round(item.preco_unitario * item.quantidade * 100) / 100;
                priceIndex++;
            });
        });

        console.log('✅ Diagnóstico completo com preços');
        return NextResponse.json(diagnostico);

    } catch (error: any) {
        console.error('Erro no diagnóstico:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao processar diagnóstico' },
            { status: 500 }
        );
    }
}
