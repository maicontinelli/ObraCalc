import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI lazily inside the handler to prevent build-time errors


export async function POST(req: NextRequest) {
    try {
        const { images, mode, projectStage, projectType } = await req.json();

        if (!images || images.length === 0) {
            return NextResponse.json(
                { error: 'Nenhuma imagem fornecida' },
                { status: 400 }
            );
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const analysisPrompt = mode === 'TECNICO'
            ? `Você é um engenheiro civil sênior analisando fotos de uma obra ${projectType} na etapa ${projectStage}.

Para cada imagem, forneça:
1. Uma legenda técnica objetiva (formato: "Imagem XX – Descrição do elemento construtivo")
2. Uma análise técnica breve e neutra

REGRAS IMPORTANTES:
- Use APENAS informações visíveis na imagem
- Nunca afirme conformidade normativa definitiva
- Use linguagem neutra e técnica
- Use termos como "observa-se", "verifica-se visualmente", "aparenta"
- Não mencione inteligência artificial
- Seja conservador e juridicamente seguro
- Não aponte erros ou responsabilidades
- Não indique soluções

Responda em JSON com este formato exato:
{
  "analyses": [
    {
      "caption": "Imagem 01 – Descrição técnica objetiva",
      "analysis": "Observa-se visualmente..."
    }
  ]
}`
            : `Você é um profissional da construção explicando fotos de uma obra ${projectType} na etapa ${projectStage} para um cliente leigo.

Para cada imagem, forneça:
1. Uma legenda simples e clara
2. Uma explicação breve em linguagem acessível

REGRAS:
- Use linguagem simples e direta
- Evite termos técnicos complexos
- Seja objetivo e claro
- Não mencione problemas sem certeza
- Não use jargão de engenharia

Responda em JSON com este formato exato:
{
  "analyses": [
    {
      "caption": "Imagem 01 – Descrição clara",
      "analysis": "Esta foto mostra..."
    }
  ]
}`;

        // Process images in batches to avoid token limits
        const batchSize = 3;
        const allAnalyses: any[] = [];

        for (let i = 0; i < images.length; i += batchSize) {
            const batch = images.slice(i, i + batchSize);

            // Prepare image parts for Gemini
            const imageParts = batch.map((img: string) => ({
                inlineData: {
                    data: img.split(',')[1], // Remove data:image/...;base64, prefix
                    mimeType: img.substring(img.indexOf(':') + 1, img.indexOf(';'))
                }
            }));

            const batchPrompt = `${analysisPrompt}\n\nAnalisando ${batch.length} imagem(ns) (${i + 1} a ${Math.min(i + batch.length, images.length)} de ${images.length} total).`;

            // Generate content with images
            const result = await model.generateContent([
                batchPrompt,
                ...imageParts
            ]);

            const response = await result.response;
            const text = response.text();

            // Parse JSON response
            try {
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    allAnalyses.push(...(parsed.analyses || []));
                }
            } catch (parseError) {
                console.error('Error parsing AI response:', parseError);
                // Fallback: create generic captions
                for (let j = 0; j < batch.length; j++) {
                    allAnalyses.push({
                        caption: `Imagem ${String(i + j + 1).padStart(2, '0')} – Registro fotográfico do elemento construtivo observado.`,
                        analysis: mode === 'TECNICO'
                            ? 'Observa-se visualmente o elemento construtivo em conformidade aparente com as práticas usuais de execução.'
                            : 'Foto mostra o andamento da obra nesta área.'
                    });
                }
            }
        }

        return NextResponse.json({ analyses: allAnalyses });

    } catch (error: any) {
        console.error('Error analyzing images:', error);

        // Return fallback analyses
        const fallbackAnalyses = Array.from({ length: 10 }, (_, i) => ({
            caption: `Imagem ${String(i + 1).padStart(2, '0')} – Registro fotográfico do elemento construtivo observado.`,
            analysis: 'Observa-se visualmente o elemento construtivo.'
        }));

        return NextResponse.json({
            analyses: fallbackAnalyses,
            warning: 'Análise automática indisponível. Usando legendas padrão.'
        });
    }
}
