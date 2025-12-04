# 🗄️ Guia de Configuração do Supabase - ObraCalc

## ✅ Status Atual

- ✅ Credenciais configuradas no `.env.local`
- ✅ Cliente Supabase configurado em `src/lib/supabase.ts`
- ✅ Script SQL criado: `supabase-schema.sql`
- ⏳ **Próximo passo:** Executar o script SQL no Supabase

## 📋 Passo a Passo para Configuração

### 1. Acessar o Supabase Dashboard

1. Acesse: <https://supabase.com/dashboard>
2. Faça login na sua conta
3. Selecione o projeto: **ttrxbtqsdkyjsounfclk**

### 2. Executar o Script SQL

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor SQL
5. Clique em **Run** (ou pressione Ctrl/Cmd + Enter)
6. Aguarde a execução (deve levar ~5 segundos)
7. Verifique se apareceu "Success" ✅

### 3. Verificar Tabelas Criadas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver 3 novas tabelas:
   - ✅ `orcamento` - Armazena os orçamentos
   - ✅ `orcamento_item` - Armazena os itens de cada orçamento
   - ✅ `user_monthly_estimates` - Controla limites mensais

### 4. Reiniciar o Servidor de Desenvolvimento

```bash
# Parar o servidor (Ctrl+C no terminal)
# Depois iniciar novamente:
npm run dev
```

**Por quê?** O Next.js precisa recarregar as variáveis de ambiente do `.env.local`

## 🏗️ Estrutura do Banco de Dados

### Tabela: `orcamento`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único do orçamento |
| `user_id` | UUID | ID do usuário (auth.users) |
| `titulo` | TEXT | Nome do projeto |
| `cliente` | TEXT | Nome do cliente final |
| `phone` | TEXT | Telefone do cliente |
| `provider_name` | TEXT | Nome do prestador |
| `provider_phone` | TEXT | Telefone do prestador |
| `provider_city` | TEXT | Cidade do prestador |
| `provider_state` | TEXT | Estado (UF) |
| `project_type` | TEXT | 'self' ou 'provider' |
| `bdi_percent` | NUMERIC | Percentual de BDI |
| `ai_requests` | JSONB | Histórico de requisições IA |
| `data_criacao` | TIMESTAMP | Data de criação |
| `data_atualizacao` | TIMESTAMP | Última atualização |

### Tabela: `orcamento_item`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único do item |
| `orcamento_id` | UUID | Referência ao orçamento |
| `categoria` | TEXT | Categoria do item |
| `nome` | TEXT | Nome do serviço |
| `unidade` | TEXT | Unidade de medida |
| `quantidade` | NUMERIC | Quantidade |
| `valor_medio` | NUMERIC | Preço base |
| `valor_manual` | NUMERIC | Preço editado |
| `incluir` | BOOLEAN | Se está incluído |
| `is_custom` | BOOLEAN | Se foi adicionado manualmente |
| `ai_request_id` | UUID | ID da requisição IA |

### Tabela: `user_monthly_estimates`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único |
| `user_id` | UUID | ID do usuário |
| `month` | TEXT | Mês (formato: "2024-12") |
| `estimates_count` | INTEGER | Quantidade de orçamentos |
| `estimates_ids` | UUID[] | IDs dos orçamentos criados |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Última atualização |

## 🔒 Segurança (Row Level Security)

O script configura automaticamente:

- ✅ **RLS habilitado** em todas as tabelas
- ✅ **Políticas de acesso** configuradas
- ✅ Usuários só veem **seus próprios dados**
- ✅ Proteção contra acesso não autorizado

## 🔧 Funções Criadas

### 1. `increment_monthly_estimate_count(user_id, estimate_id)`

- Incrementa a contagem mensal de orçamentos
- Chamada automaticamente ao criar novo orçamento

### 2. `check_estimate_limit(user_id, max_estimates)`

- Verifica se o usuário pode criar mais orçamentos
- Retorna `true` se dentro do limite, `false` se excedeu

**Exemplo de uso:**

```sql
-- Verificar se usuário pode criar orçamento (plano free = 30)
SELECT check_estimate_limit('user-uuid-aqui', 30);
```

## 🧪 Testar a Conexão

Após executar o script e reiniciar o servidor:

1. Abra o console do navegador (F12)
2. Execute:

```javascript
// No console do navegador
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://ttrxbtqsdkyjsounfclk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
);

// Testar conexão
supabase.from('orcamento').select('count').then(console.log);
```

## 📊 Próximos Passos

Após configurar o banco:

1. ✅ Implementar salvamento de orçamentos no Supabase
2. ✅ Implementar verificação de limites mensais
3. ✅ Sincronizar localStorage com Supabase
4. ✅ Adicionar autenticação de usuários

## ⚠️ Importante

- **Não compartilhe** as credenciais do Supabase publicamente
- O arquivo `.env.local` está no `.gitignore` (seguro)
- As credenciais já estão configuradas no projeto
- Reinicie o servidor após qualquer mudança no `.env.local`

## 🆘 Problemas Comuns

### Erro: "relation does not exist"

**Solução:** Execute o script SQL no Supabase Dashboard

### Erro: "Invalid API key"

**Solução:** Verifique se as credenciais no `.env.local` estão corretas

### Erro: "permission denied"

**Solução:** Verifique se o RLS está configurado corretamente

### Servidor não reconhece variáveis de ambiente

**Solução:** Reinicie o servidor (`npm run dev`)

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do navegador (F12)
2. Verifique os logs do servidor
3. Verifique o SQL Editor no Supabase para erros

---

**Status:** ⏳ Aguardando execução do script SQL  
**Próximo passo:** Executar `supabase-schema.sql` no Supabase Dashboard
