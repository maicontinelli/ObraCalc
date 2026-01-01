# 🏗️ ObraPlana Simple

Versão simplificada do ObraPlana - Sistema de orçamentos de construção sem autenticação.

## ✨ Funcionalidades

- ✅ Criar orçamentos de construção
- ✅ IA para sugerir itens
- ✅ Exportação PDF/HTML
- ✅ Armazenamento local (localStorage)
- ✅ Páginas institucionais (sobre, planos, contato, apoie)

## ❌ O que NÃO tem

- ❌ Sistema de login/autenticação
- ❌ Dashboard de usuário
- ❌ Salvamento em servidor/Supabase
- ❌ Perfis de usuário

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

## 📦 Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- LocalStorage para persistência
- OpenAI/Groq para IA (opcional)

## 📂 Estrutura

```
app/
  ├── page.tsx          # Homepage
  ├─ ─ editor/[id]/      # Editor de orçamentos
  ├── report/[id]/      # Relatório/Exportação
  ├── planos/           # Página de planos
  ├── sobre/            # Sobre o app
  ├── contato/          # Contato
  └── apoie/            # Apoie o projeto

components/
  ├── BoqEditor.tsx     # Editor principal (sem auth)
  └── CommandSearch.tsx # Busca com IA

lib/
  ├── constants.ts      # Templates de obra
  └── utils.ts          # Utilitários
```

## 🎯 Objetivo

Sistema simples e funcional de orçamentos de construção que funciona 100% offline, sem complexidade de autenticação.
