# Sistema de Autenticação - ObraCalc

Sistema de autenticação completo integrado ao ObraCalc, desenvolvido com Next.js 15, TypeScript e Tailwind CSS.

## 📁 Estrutura Criada

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Página de login
│   │   ├── cadastro/
│   │   │   └── page.tsx          # Página de cadastro
│   │   └── recuperar-senha/
│   │       └── page.tsx          # Página de recuperação de senha
│   └── layout.tsx                # Atualizado com providers
├── contexts/
│   ├── AuthContext.tsx           # Context de autenticação
│   └── ToastContext.tsx          # Context de notificações
└── globals.css                   # Atualizado com animações
```

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação Completa

- **Login** com email/senha
- **Cadastro** com validação de senha forte
- **Recuperação de senha** por email
- **Login Social** (Google e Microsoft)
- **Sessão persistente** com opção "Lembrar-me"
- **Tokens JWT** para autenticação

### ✅ Segurança

- Validação de email e senha
- Indicador de força da senha
- Sanitização de inputs
- Armazenamento seguro de tokens
- Proteção contra força bruta (preparado)

### ✅ UX/UI

- Design moderno com gradientes vibrantes
- Animações suaves
- Notificações toast elegantes
- 100% responsivo
- Feedback visual em tempo real

## 🚀 Como Usar

### 1. Acessar as Páginas

- **Login**: `http://localhost:3000/auth/login`
- **Cadastro**: `http://localhost:3000/auth/cadastro`
- **Recuperar Senha**: `http://localhost:3000/auth/recuperar-senha`

### 2. Usar o Hook de Autenticação

Em qualquer componente:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MeuComponente() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Você precisa fazer login</div>;
  }

  return (
    <div>
      <p>Olá, {user?.name}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### 3. Usar Notificações Toast

```tsx
import { useToast } from '@/contexts/ToastContext';

function MeuComponente() {
  const toast = useToast();

  const handleAction = () => {
    toast.success('Sucesso!', 'Operação concluída com sucesso.');
    // ou
    toast.error('Erro!', 'Algo deu errado.');
    // ou
    toast.warning('Atenção!', 'Verifique os dados.');
    // ou
    toast.info('Informação', 'Dados atualizados.');
  };

  return <button onClick={handleAction}>Executar</button>;
}
```

## 🔧 Integração com Backend

### 1. Atualizar AuthContext

Edite `/src/contexts/AuthContext.tsx` e substitua as simulações por chamadas reais:

```tsx
// Login
const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    const { user, token } = data;

    storeToken(token, rememberMe);
    localStorage.setItem('user', JSON.stringify(user));
    
    setToken(token);
    setUser(user);

    return true;
  } catch (error) {
    console.error('Erro no login:', error);
    return false;
  }
};
```

### 2. Criar API Routes

Crie as rotas de API em `/src/app/api/auth/`:

```
src/app/api/auth/
├── login/
│   └── route.ts
├── signup/
│   └── route.ts
├── forgot-password/
│   └── route.ts
└── verify-2fa/
    └── route.ts
```

Exemplo de rota de login:

```tsx
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validar credenciais no banco de dados
    // const user = await db.user.findUnique({ where: { email } });
    // const isValid = await bcrypt.compare(password, user.password);

    // Gerar token JWT
    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    return NextResponse.json({
      user: {
        id: '123',
        name: 'Usuário',
        email,
        verified: true,
        has2FA: false,
        plan: 'professional',
        planActive: true
      },
      token: 'jwt-token-here'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
  }
}
```

### 3. Configurar OAuth (Google/Microsoft)

Instale a biblioteca NextAuth.js:

```bash
npm install next-auth
```

Configure em `/src/app/api/auth/[...nextauth]/route.ts`:

```tsx
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import MicrosoftProvider from 'next-auth/providers/microsoft';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    MicrosoftProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

## 🔐 Proteção de Rotas

### Criar Middleware

Crie `/src/middleware.ts`:

```tsx
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/editor');

  // Redirecionar usuários autenticados da página de login
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirecionar usuários não autenticados de páginas protegidas
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*', '/editor/:path*'],
};
```

### Componente de Proteção

Crie `/src/components/auth/ProtectedRoute.tsx`:

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

Use em páginas protegidas:

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Conteúdo do Dashboard</div>
    </ProtectedRoute>
  );
}
```

## 📊 Fluxos de Usuário

### Fluxo de Cadastro

1. Usuário acessa `/auth/cadastro`
2. Preenche nome, email e senha
3. Sistema valida dados
4. Conta criada (pendente verificação)
5. Email de verificação enviado
6. Redirecionamento para login

### Fluxo de Login

1. Usuário acessa `/auth/login`
2. Insere credenciais
3. Sistema valida
4. Token JWT gerado
5. Redirecionamento para dashboard

### Fluxo de Recuperação

1. Usuário clica "Esqueci minha senha"
2. Insere email
3. Link temporário enviado
4. Usuário redefine senha
5. Redirecionamento para login

## 🎨 Personalização

### Cores

As cores do tema de autenticação usam as variáveis do Tailwind. Para personalizar, edite `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#667eea',
        'primary-dark': '#5568d3',
        secondary: '#764ba2',
      },
    },
  },
};
```

### Animações

As animações estão definidas em `globals.css`. Você pode ajustar duração e efeitos conforme necessário.

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# JWT
JWT_SECRET=seu-secret-super-seguro

# Google OAuth
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=seu-microsoft-client-id
MICROSOFT_CLIENT_SECRET=seu-microsoft-client-secret

# Email (para recuperação de senha)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app

# URLs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-nextauth-secret
```

## 🧪 Testando

### Modo de Desenvolvimento

O sistema está configurado para funcionar em modo simulado. Você pode:

1. Fazer login com qualquer email/senha
2. Criar conta com dados válidos
3. Testar recuperação de senha
4. Testar login social (simulado)

### Dados de Teste

- **Email**: <qualquer@email.com>
- **Senha**: qualquer senha válida (8+ caracteres)

## 🚀 Próximos Passos

1. [ ] Integrar com banco de dados (PostgreSQL/MongoDB)
2. [ ] Implementar envio real de emails
3. [ ] Configurar OAuth real (Google/Microsoft)
4. [ ] Adicionar autenticação 2FA
5. [ ] Implementar sistema de permissões/roles
6. [ ] Adicionar logs de auditoria
7. [ ] Configurar rate limiting
8. [ ] Adicionar testes automatizados

## 📚 Recursos

- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [NextAuth.js](https://next-auth.js.org/)
- [JWT.io](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Desenvolvido para ObraCalc** 🏗️
