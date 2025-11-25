# Groq AI Configuration - 100% GRATUITO! 🎉

Esta aplicação usa **Groq** com o modelo **Llama 3.1 70B** para o Assistente de IA.

## Por que Groq?

- ✅ **100% GRATUITO** - Sem necessidade de cartão de crédito
- ✅ **Tier gratuito generoso**: 30 requisições/minuto, 6.000/dia
- ✅ **Extremamente rápido** - Respostas em menos de 1 segundo
- ✅ **Modelo poderoso**: Llama 3.1 70B (comparável ao GPT-4)
- ✅ **JSON mode nativo** - Perfeito para dados estruturados

## Setup - Passo a Passo

### 1. Criar conta no Groq (GRÁTIS)

1. Acesse: https://console.groq.com
2. Clique em "Sign Up" (pode usar conta Google/GitHub)
3. Confirme seu email

### 2. Obter sua API Key

1. Após login, vá para: https://console.groq.com/keys
2. Clique em "Create API Key"
3. Dê um nome (ex: "orcacivil-dev")
4. Copie a chave (começa com `gsk_...`)

### 3. Configurar no projeto

Adicione a chave no arquivo `.env.local`:

```bash
GROQ_API_KEY=gsk_sua_chave_aqui
```

### 4. Reiniciar o servidor

```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

## Testando

Experimente perguntas como:
- "Quanto custa construir uma piscina de 8x4 metros?"
- "Preciso reformar um banheiro de 6m²"
- "Quanto custa fazer um muro de 20 metros?"

## Limites do Tier Gratuito

- **30 requisições por minuto**
- **6.000 requisições por dia**
- **Totalmente gratuito, sem cartão de crédito**

Para uso típico desta aplicação (10-20 consultas/dia), você nunca atingirá o limite!

## Modelo Usado

**llama-3.1-70b-versatile**:
- 70 bilhões de parâmetros
- Excelente para português
- Ótimo para geração de dados estruturados
- Velocidade de inferência: ~500 tokens/segundo

## Alternativas (caso precise)

Se por algum motivo o Groq não funcionar, você pode usar:
- **OpenAI** (pago, ~$5/mês mínimo)
- **Anthropic Claude** (pago, similar ao OpenAI)
- **Gemini** (gratuito mas com problemas de quota)

## Suporte

Documentação oficial: https://console.groq.com/docs
