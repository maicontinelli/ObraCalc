# 🚧 Status da Implementação - ObraCalc Refactoring

## ✅ Mudanças Concluídas

### 1. **Plano Free - Orçamentos Ilimitados**

- ✅ Atualizado `src/types/plans.ts`
- ✅ `maxEstimates` do plano Free alterado de `3` para `-1` (ilimitado)
- ✅ Benefícios atualizados para "Orçamentos ilimitados"

### 2. **Novo Sistema de Formulário**

- ✅ Criado `src/components/ProjectInfoForm.tsx`
  - Formulário completo para usuários Free/Não cadastrados
  - Formulário simplificado para usuários pagos
  - Toggle "Sou Cliente" vs "Sou Prestador"
  - Campos: Nome, Telefone, Cidade, Estado (Prestador)
  - Campos: Nome, Telefone (Cliente) - condicional
  - Validação completa integrada

### 3. **BoqEditor - Parcialmente Atualizado**

- ✅ Imports adicionados (`ProjectInfoForm`, `useAuth`)
- ✅ Estados unificados em `projectInfo: ProjectInfoData`
- ✅ `handleSave` atualizado para salvar todos os dados
- ✅ Carregamento de dados do localStorage atualizado

### 4. **Componentes de Leads**

- ✅ `LeadCaptureForm.tsx` criado anteriormente
- ✅ `LeadInterestForm.tsx` criado para dashboard
- ✅ `LeadsList.tsx` criado para exibição

## ⚠️ Mudanças Pendentes (Críticas)

### 1. **BoqEditor.tsx - Finalizar Refactoring**

**Arquivo:** `/src/components/BoqEditor.tsx`

#### A. Remover Barra Superior Antiga (linhas ~350-425)

```tsx
// REMOVER ESTA SEÇÃO COMPLETA:
<div className="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm mb-6 transition-all">
    <div className="container mx-auto py-2 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 px-4">
        <div className="flex items-center gap-3 flex-1 w-full min-w-0 overflow-hidden">
            <div className="flex items-center gap-1 flex-1 min-w-0">
                <input type="text" value={clientName} ... />
            </div>
            ...
        </div>
        <div className="flex items-center gap-2">
            <button onClick={handleGenerateReport} ...>
                <Save size={16} />
            </button>
        </div>
    </div>
</div>

// E também remover a mensagem de validação antiga (linhas ~396-425)
```

#### B. Adicionar ProjectInfoForm no Topo (linha ~429, antes do CommandSearch)

```tsx
<div className="lg:col-span-2 space-y-6">
    {/* ADICIONAR AQUI: */}
    <ProjectInfoForm 
        initialData={projectInfo}
        onChange={(data, isValid) => {
            setProjectInfo(data);
            setIsFormValid(isValid);
        }}
    />

    {/* Mensagem de Validação */}
    {showValidationMessage && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 ...">
            ...preencha todos os campos obrigatórios...
        </div>
    )}

    {/* Assistente IA (já existe) */}
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl...">
        ...
    </div>
</div>
```

#### C. Atualizar handleGenerateReport (linha ~325)

```tsx
const handleGenerateReport = async () => {
    if (!isFormValid) {
        setShowValidationMessage(true);
        setTimeout(() => setShowValidationMessage(false), 5000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // 1. Save to LocalStorage
    await handleSave();

    // 2. Navigate to report page
    router.push(`/report/${estimateId}`);
};
```

#### D. Mover Botão "Gerar Relatório" para Sidebar (linha ~650)

```tsx
{/* Sidebar Summary */}
<div className="lg:col-span-1">
    <div className="sticky top-24 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Resumo do Orçamento</h3>

            {/* ... totais ... */}
            
            {/* ADICIONAR BOTÃO AQUI: */}
            <button
                onClick={handleGenerateReport}
                className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
            >
                <Save size={20} />
                Gerar Relatório
            </button>
        </div>
        ...
    </div>
</div>
```

### 2. **Página de Relatório - Remover Seção de Leads**

**Arquivo:** `/src/app/report/[id]/page.tsx`

- ❌ Remover seção "Profissionais Indicados" / Lead Capture Form
- ❌ Já foi removida anteriormente (confirmar)

### 3. **Dashboard - Ajustes Finais**

**Arquivo:** `/src/app/dashboard/page.tsx`

- ✅ LeadInterestForm já adicionado para usuários Free
- ✅ LeadsList já adicionado para usuários pagos
- ⚠️ Verificar se está funcionando corretamente

### 4. **Arquivos Obsoletos para Remover**

**Componentes:**

- ❌ `/src/components/leads/LeadCaptureForm.tsx` - NÃO USAR MAIS (substituído por ProjectInfoForm)

**Nota:** O `LeadCaptureForm` foi criado anteriormente mas não deve ser usado. O `ProjectInfoForm` é o componente correto.

## 📋 Checklist de Implementação

### Prioridade Alta (Fazer Agora)

- [ ] Remover barra superior antiga do BoqEditor
- [ ] Adicionar ProjectInfoForm no topo do BoqEditor
- [ ] Atualizar handleGenerateReport com validação
- [ ] Mover botão "Gerar Relatório" para sidebar
- [ ] Testar fluxo completo: Free user → Preencher form → Gerar relatório

### Prioridade Média

- [ ] Confirmar remoção de LeadCaptureForm da página de relatório
- [ ] Testar dashboard com LeadInterestForm (usuários free)
- [ ] Testar dashboard com LeadsList (usuários pagos)
- [ ] Verificar se dados salvos estão corretos no localStorage

### Prioridade Baixa

- [ ] Remover arquivo obsoleto LeadCaptureForm.tsx
- [ ] Limpar imports não utilizados
- [ ] Documentar novo fluxo de dados

## 🔧 Comandos Úteis

```bash
# Verificar se há erros de compilação
npm run build

# Rodar em desenvolvimento
npm run dev

# Backup do BoqEditor (já feito)
# cp src/components/BoqEditor.tsx src/components/BoqEditor.tsx.backup
```

## 📝 Notas Importantes

1. **Fluxo de Dados:**
   - ProjectInfoForm → projectInfo state → handleSave → localStorage → Relatório

2. **Validação:**
   - Free/Unregistered: Todos os campos obrigatórios
   - Paid: Apenas nome do projeto e cliente

3. **Tipo de Projeto:**
   - `type: 'self'` → Cliente = Prestador (mesmo nome/telefone)
   - `type: 'provider'` → Cliente separado

4. **Dados Salvos:**

   ```json
   {
     "id": "...",
     "title": "projectName",
     "client": "finalClientName",
     "phone": "finalClientPhone",
     "providerName": "...",
     "providerPhone": "...",
     "providerCity": "...",
     "providerState": "...",
     "projectType": "self|provider",
     "items": [...],
     "bdi": 20,
     "aiRequests": [...]
   }
   ```

## 🎯 Próximos Passos

1. **Implementar mudanças pendentes no BoqEditor**
2. **Testar fluxo completo**
3. **Ajustar página de relatório se necessário**
4. **Limpar código obsoleto**
5. **Documentar mudanças**

---

**Status:** 🟡 Em Progresso (70% concluído)
**Última Atualização:** 2025-12-03
