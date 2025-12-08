# 🏗️ ARQUITETURA DO PROJETO (FLAT & CLEAN)

Esta estrutura segue a filosofia de manter arquivos essenciais no nível principal, evitando aninhamentos profundos e agrupando apenas o necessário.

## 1. ESTRUTURA FINAL

```
/
├── app/                        # CAMADA DE ROTEAMENTO (Next.js App Router)
│   ├── api/                    # Backend/API Routes
│   │   ├── chat/               # IA Chat Endpoint
│   │   ├── search-services/    # Busca de Serviços
│   │   └── suggest-item/       # Sugestão de Itens
│   │
│   ├── editor/[id]/            # Rota: Editor de Orçamento
│   ├── report/[id]/            # Rota: Relatório Final
│   ├── planos/                 # Rota: Planos
│   ├── sobre/                  # Rota: Sobre
│   ├── contato/                # Rota: Contato
│   ├── apoie/                  # Rota: Apoie
│   │
│   ├── page.tsx                # Homepage (Landing Page)
│   ├── layout.tsx              # Layout Principal (Root)
│   └── globals.css             # Estilos Globais
│
├── components/                 # UI & FEATURES (Nível Único)
│   ├── BoqEditor.tsx           # Feature: Editor Principal
│   ├── ReportClient.tsx        # Feature: Cliente de Relatório (Movido se necessário)
│   ├── CommandSearch.tsx       # Feature: Busca IA
│   ├── AiAssistant.tsx         # Feature: Assistente
│   │
│   ├── SimpleNav.tsx           # UI: Navegação
│   ├── Footer.tsx              # UI: Rodapé
│   ├── Hero.tsx                # UI: Seção Hero
│   ├── Features.tsx            # UI: Seção Features
│   ├── TrustBar.tsx            # UI: Barra de Confiança
│   ├── DemoSection.tsx         # UI: Demonstração
│   ├── MathParticles.tsx       # UI: Efeito Visual
│   └── Button.tsx              # UI: Botão Genérico
│
├── lib/                        # UTILITÁRIOS (Centralizado)
│   ├── constants.ts            # Constantes e Templates
│   ├── types.ts                # Definições de Tipos TS
│   └── utils.ts                # Helpers (cn, formatters)
│
├── public/                     # ASSETS ESTÁTICOS
│   └── (imagens e ícones)
│
└── ...config files             # RAIZ (Configs)
```

---

## 2. CRITÉRIOS DE ORGANIZAÇÃO

1. **Nível Principal (Flat)**:
    - Todos os componentes, sejam UI (botões) ou Features (editor), vivem juntos em `components/`.
    - **Por que?** Evita a fadiga de decisão ("Isso é molecular ou atômico?") e facilita a importação (`@/components/Nome`).
    - **Exceção**: Se a pasta passar de 30-40 arquivos, podemos criar `components/ui` apenas para os básicos.

2. **Agrupamento por Rota**:
    - Tudo que é uma *página* acessível pelo usuário está em `app/nome-da-rota`.
    - Mantemos o aninhamento **mínimo** exigido pelo Next.js (`[id]/page.tsx`).

3. **Lib Centralizada**:
    - Toda lógica pura (não-React) fica em `lib/`.
    - `utils.ts` para funções genéricas.
    - `constants.ts` para dados estáticos.

---

## 3. PONTOS DE FÁCIL ACESSO

Com essa estrutura, ficou mais fácil localizar:

- **Onde edito o Orçamento?** → `components/BoqEditor.tsx` (Não precisa caçar em pastas)
- **Onde mudo os Templates?** → `lib/constants.ts`
- **Onde está a Homepage?** → `app/page.tsx`
- **Onde mudo o estilo global?** → `app/globals.css`

---

## 4. GUIA PARA O FUTURO

Para manter este padrão limpo nas próximas edições:

1. **Regra do Componente Único**:
    - Se um componente for usado em apenas UMA página (ex: um gráfico específico do dashboard), considere deixá-lo colocalizado na pasta da página (opcional) ou na raiz de `components/` com um nome muito específico (`DashboardChart.tsx`).
    - **Evite** criar pastas como `components/dashboard/charts/specific/`.

2. **Nomes Descritivos**:
    - Use `ProductCard.tsx` em vez de `Card.tsx` dentro de uma pasta `product`.
    - O nome do arquivo deve explicar o que ele é.

3. **Não Aninhe Logica**:
    - Se a lógica crescer, extraia para um Custom Hook em `lib/hooks/` (se necessário criar a pasta) ou mantenha no próprio arquivo se for curto.
    - Evite separar `BoqEditor.logic.ts` a menos que o arquivo passe de 500 linhas.

4. **CSS/Tailwind**:
    - Mantenha estilos no próprio componente via Tailwind classes.
    - Evite módulos CSS separados se possível, para reduzir a quantidade de arquivos.

---

**Status**: ✅ PROJETO REORGANIZADO E LIMPO.
