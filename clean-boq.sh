#!/bin/bash

# Script para remover todas as referências a auth e supabase do BoqEditor.tsx

cd /Users/maicontinelli/.gemini/antigravity/scratch/obracalc-simple

# Fazer backup
cp components/BoqEditor.tsx components/BoqEditor.tsx.original

# Remover linha 25 (const { user } = useAuth();)
sed -i '' '25d' components/BoqEditor.tsx

# Remover dependencies do useEffect (linha 169)
sed -i '' 's/, user\]/\]/' components/BoqEditor.tsx

# Remover bloco Supabase (linhas 82-140 aproximadamente)
# Vamos usar uma abordagem diferente - criar arquivo novo limpo

echo "Backup criado como BoqEditor.tsx.original"
echo "Agora vou criar versão limpa..."
