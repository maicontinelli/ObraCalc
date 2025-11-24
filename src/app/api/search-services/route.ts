import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json(
                { error: 'Query é obrigatória' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API Key do Gemini não configurada' },
                { status: 500 }
            );
        }

        const prompt = `Você é um especialista em orçamentos de construção civil no Brasil. 
        
Baseado na seguinte solicitação do usuário: "${query}"

Sugira de 3 a 5 serviços de construção civil relevantes com as seguintes informações:
- Nome do serviço (específico e técnico)
- Unidade de medida (m², m³, m, un, vb, etc.)
- Preço de referência em reais (baseado em SINAPI/SETOP 2024)
- Breve descrição (opcional, máximo 50 caracteres)

Retorne APENAS um JSON válido no seguinte formato, sem texto adicional:
{
  "suggestions": [
    {
      "name": "Nome do Serviço",
      "unit": "m²",
      "price": 150.00,
      "description": "Descrição breve"
    }
  ]
}

IMPORTANTE: 
- Retorne apenas o JSON, sem markdown ou texto explicativo
- Use preços realistas do mercado brasileiro
- Seja específico nos nomes dos serviços
- Considere o contexto da construção civil`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [{
                            text: prompt
                        }]
                    }]
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Gemini API error:', errorData);
            return NextResponse.json(
                { error: 'Erro ao processar busca com IA' },
                { status: 500 }
            );
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Remove markdown code blocks if present
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('Error parsing Gemini response:', cleanText);
            return NextResponse.json(
                { error: 'Erro ao processar resposta da IA' },
                { status: 500 }
            );
        }

        return NextResponse.json(parsedResponse);
    } catch (error: any) {
        console.error('Error in search-services API:', error);
        return NextResponse.json(
            { error: error.message || 'Erro ao processar busca' },
            { status: 500 }
        );
    }
}

