# 🔐 Credenciais de Administrador - ObraCalc

## Acesso ao Painel de Administração

Para acessar todas as funcionalidades do sistema como administrador, use as seguintes credenciais:

### Credenciais de Admin

```
Email: admin@obracalc.com
Senha: admin123
```

## Funcionalidades do Painel de Admin

Ao fazer login como administrador, você terá acesso a:

### 1. **Visão Geral (Overview)**

- Estatísticas gerais do sistema
- Total de usuários, orçamentos e leads
- Receita total
- Distribuição de planos
- Status dos leads

### 2. **Gerenciamento de Usuários**

- Lista completa de todos os usuários
- Informações de plano de cada usuário
- Quantidade de orçamentos criados
- Data de cadastro
- Email e nome

### 3. **Gerenciamento de Orçamentos**

- Todos os orçamentos criados no sistema
- Informações do usuário criador
- Valor total de cada orçamento
- Status (aprovado, enviado, rascunho)
- Data de criação

### 4. **Gerenciamento de Leads**

- Todos os leads capturados
- Informações completas de contato
- Categoria do serviço
- Status do lead (novo, contatado, qualificado, convertido, perdido)
- Usuário ao qual o lead foi atribuído
- Ações rápidas (WhatsApp, Email, Ver Orçamento)
- Atualização de status

## Características do Usuário Admin

- **Plano**: Business (acesso ilimitado)
- **Permissões**: Acesso total ao sistema
- **Badge**: Botão roxo "Admin" na navbar
- **Redirecionamento**: Proteção de rota - apenas admins podem acessar `/admin`

## Como Acessar

1. Navegue até a página de login: `http://localhost:3000/auth/login`
2. Insira as credenciais de admin
3. Após o login, você verá um botão roxo "Admin" na navbar
4. Clique no botão "Admin" para acessar o painel de administração
5. Ou navegue diretamente para: `http://localhost:3000/admin`

## Diferenças entre Admin e Usuário Normal

| Recurso | Usuário Normal | Admin |
|---------|---------------|-------|
| Dashboard Pessoal | ✅ | ✅ |
| Criar Orçamentos | ✅ (com limites) | ✅ (ilimitado) |
| Ver Próprios Leads | ✅ (apenas pagos) | ✅ |
| Painel de Admin | ❌ | ✅ |
| Ver Todos os Usuários | ❌ | ✅ |
| Ver Todos os Orçamentos | ❌ | ✅ |
| Ver Todos os Leads | ❌ | ✅ |
| Gerenciar Sistema | ❌ | ✅ |

## Dados Mock Disponíveis

O painel de admin exibe dados mockados para demonstração:

- **4 usuários** (1 free, 2 professional, 1 business)
- **3 orçamentos** de diferentes usuários
- **2 leads** distribuídos para usuários pagos

## Segurança

⚠️ **IMPORTANTE**: Em produção, as credenciais de admin devem:

- Ser armazenadas de forma segura (hash bcrypt)
- Usar autenticação JWT com claims de admin
- Implementar 2FA obrigatório
- Ter logs de auditoria para todas as ações
- Usar HTTPS obrigatório
- Implementar rate limiting

## Próximos Passos para Produção

1. **Backend de Admin**
   - Criar rotas protegidas `/api/admin/*`
   - Middleware de verificação de admin
   - Logs de auditoria

2. **Funcionalidades Adicionais**
   - Editar/Excluir usuários
   - Gerenciar planos e preços
   - Configurações do sistema
   - Analytics avançados
   - Exportar relatórios

3. **Segurança**
   - Implementar 2FA para admin
   - Logs de todas as ações
   - Alertas de segurança
   - Backup automático

---

**Desenvolvido para ObraCalc** 🏗️
