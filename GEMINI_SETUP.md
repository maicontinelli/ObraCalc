# Busca Inteligente com Gemini AI

## Configuração

Para ativar a funcionalidade de Busca Inteligente, você precisa configurar uma chave API do Google Gemini.

### Passos:

1. **Obter a API Key do Gemini:**
   - Acesse: https://makersuite.google.com/app/apikey
   - Faça login com sua conta Google
   - Clique em "Create API Key"
   - Copie a chave gerada

2. **Configurar no projeto:**
   - Abra o arquivo `.env.local` na raiz do projeto
   - Adicione a linha: `GEMINI_API_KEY=sua_chave_api_aqui`
   - Substitua `sua_chave_api_aqui` pela chave que você copiou

3. **Reiniciar o servidor:**
   ```bash
   npm run dev
   ```

## Como usar

1. Na página de edição do orçamento, clique no botão **"Busca Inteligente"** (ícone de estrela roxa)
2. Digite uma descrição do que você precisa, por exemplo:
   - "preciso de serviços para construir uma piscina"
   - "quero reformar um banheiro"
   - "instalação elétrica completa"
3. A IA do Gemini irá sugerir serviços relevantes com preços de referência
4. Clique em qualquer sugestão para adicioná-la automaticamente ao seu orçamento

## Recursos

- Sugestões baseadas em IA
- Preços de referência SINAPI/SETOP
- Adição automática aos "Itens Adicionais"
- Interface intuitiva e moderna
