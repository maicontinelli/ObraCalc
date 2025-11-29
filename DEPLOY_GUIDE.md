# 🚀 Workflow de Deploy Automático - Configurado

## ✅ Status da Configuração

### Git & GitHub

- ✅ Repositório remoto: `https://github.com/maicontinelli/obra-calc.git`
- ✅ Branch principal: `main`
- ✅ Tracking configurado: `main` → `origin/main`
- ✅ Tags sincronizadas: `v2`, `v3`

### Vercel

- ✅ Projeto: `orcacivil`
- ✅ Domínio: `https://obra-calc.vercel.app`
- ✅ Repositório conectado: `maicontinelli/obra-calc`
- ✅ Variável de ambiente: `GROQ_API_KEY` configurada

## 📝 Como fazer deploy automático

### Fluxo de trabalho diário

```bash
# 1. Faça suas alterações no código
# (edite arquivos, adicione features, etc.)

# 2. Adicione as alterações ao Git
git add .

# 3. Faça o commit com uma mensagem descritiva
git commit -m "Descrição das alterações"

# 4. Envie para o GitHub (isso dispara o deploy automático!)
git push

# Pronto! O Vercel detecta automaticamente e faz o deploy
```

### O que acontece automaticamente

1. ✅ Você faz `git push`
2. ✅ GitHub recebe as alterações
3. ✅ Vercel detecta o push automaticamente
4. ✅ Vercel faz build do projeto
5. ✅ Vercel faz deploy em produção
6. ✅ Site atualizado em ~2-3 minutos

### Comandos úteis

```bash
# Ver status das alterações
git status

# Ver histórico de commits
git log --oneline

# Criar uma nova tag de versão
git tag v4
git push --tags

# Ver branches
git branch -a

# Desfazer alterações não commitadas
git restore .
```

## 🧪 Teste o Deploy Automático

Vamos fazer um teste agora! Execute:

```bash
# Criar um commit vazio para testar
git commit --allow-empty -m "Test: Deploy automático funcionando"
git push
```

Depois acesse: <https://vercel.com/maicontinelli/orcacivil/deployments>

Você verá um novo deployment sendo criado automaticamente!

## 🎯 Próximos Passos

Sempre que quiser atualizar o site:

1. Edite os arquivos localmente
2. Teste com `npm run dev`
3. Quando estiver satisfeito:

   ```bash
   git add .
   git commit -m "Sua mensagem aqui"
   git push
   ```

4. Aguarde 2-3 minutos
5. Acesse `https://orcacivil.vercel.app` para ver as mudanças!

## 🔐 Importante

- O arquivo `.env.local` NÃO é enviado para o GitHub (está no .gitignore)
- As variáveis de ambiente estão configuradas diretamente no Vercel
- Nunca commite chaves de API no código!

---

**Deploy automático configurado com sucesso!** 🎉
