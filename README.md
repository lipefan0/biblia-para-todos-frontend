# 📖 Bíblia Para Todos

Um website moderno, responsivo e inteligente para leitura da Bíblia com funcionalidades avançadas de autenticação, histórico de leitura e explicações teológicas alimentadas por IA.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D22.13.0-green.svg)
![React](https://img.shields.io/badge/react-19-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)

## ✨ Destaques

- 📚 **Leitura Pública**: Acesse toda a Bíblia sem necessidade de autenticação
- 🔐 **Autenticação Segura**: Sistema de login/registro com JWT
- 🤖 **IA Teológica**: Explicações inteligentes de versículos (AI_PREMIUM)
- 📊 **Histórico de Leitura**: Rastreie seu progresso de leitura
- 🔍 **Busca Avançada**: Encontre versículos por palavras-chave
- 📱 **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ⚡ **Performance**: Build otimizado com Vite
- 🎨 **Interface Moderna**: Construída com React 19 e Tailwind CSS 4

## 🚀 Quick Start

### Pré-requisitos
- Node.js 22.13.0 ou superior
- npm ou pnpm
- Backend API Kotlin Spring Boot rodando

### Instalação

```bash
# Clone o repositório
git clone https://github.com/lipefan0/biblia-para-todos-frontend.git
cd biblia-para-todos-frontend

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações

# Inicie o servidor de desenvolvimento
pnpm dev
```

O website estará disponível em `http://localhost:3000`

## 📚 Funcionalidades

### 🌐 Área Pública
- ✅ Listagem de todos os 66 livros da Bíblia
- ✅ Navegação intuitiva por capítulos
- ✅ Visualização de versículos com paginação
- ✅ Busca de versículos por palavra-chave
- ✅ Interface limpa e sem distrações

### 🔐 Área Autenticada
- ✅ Registro e login com JWT
- ✅ Dashboard personalizado do usuário
- ✅ Histórico completo de leitura
- ✅ Estatísticas de progresso
- ✅ Gerenciamento de assinatura

### 🧠 Funcionalidades de IA (AI_PREMIUM)
- ✅ Hover interativo nos versículos
- ✅ Botão "Explicar com IA" em cada versículo
- ✅ Explicação teológica de versículos individuais
- ✅ Análise de múltiplos versículos
- ✅ Resumo automático de capítulos completos

## 🏗️ Arquitetura

```
Frontend (React 19 + TypeScript)
    ↓
tRPC Client
    ↓
Backend API (Kotlin Spring Boot)
    ↓
Database + IA Services
```

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4 |
| **Build** | Vite |
| **Roteamento** | Wouter |
| **Componentes UI** | shadcn/ui |
| **Comunicação** | tRPC, Fetch API |
| **Autenticação** | JWT (localStorage) |
| **Estado** | React Hooks + Context |

## 📁 Estrutura do Projeto

```
biblia-para-todos-frontend/
├── client/                    # Código do frontend
│   ├── public/               # Arquivos estáticos
│   ├── src/
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── Home.tsx
│   │   │   ├── BibleReader.tsx
│   │   │   ├── ChapterView.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ReadingHistory.tsx
│   │   │   └── AIExplainer.tsx
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilitários
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/                    # Código do servidor
│   ├── api-client.ts        # Cliente HTTP
│   ├── routers.ts           # Routers tRPC
│   └── _core/               # Configurações
├── drizzle/                  # Schema do banco de dados
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔌 Endpoints da API

### Bíblia
```
GET    /api/bible/books
GET    /api/bible/books/:bookAbreviation/details
GET    /api/bible/:bookAbreviation/:chapter?page=X
GET    /api/bible/search/versiculo?keyword=X&page=Y
```

### Autenticação
```
POST   /api/auth/register
POST   /api/auth/login
```

### Progresso de Leitura (Autenticado)
```
POST   /api/reading-progress
GET    /api/reading-progress?page=X
GET    /api/reading-progress/stats
GET    /api/reading-progress/check/:verseId
DELETE /api/reading-progress/:progressId
```

### IA (Autenticado, AI_PREMIUM)
```
POST   /api/bible-ai/explain-verse
POST   /api/bible-ai/explain-verses
POST   /api/bible-ai/summarize-chapter
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview do build
pnpm preview

# Linter
pnpm lint

# Testes
pnpm test
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
VITE_API_BASE_URL=http://localhost:8080
JWT_SECRET=sua_chave_secreta
VITE_APP_TITLE=Bíblia Para Todos
VITE_APP_LOGO=/logo.svg
```

Veja `README_SETUP.md` para documentação completa.

## 🎨 Customização

### Alterar Logo
Edite `client/src/const.ts`:
```typescript
export const APP_LOGO = "/seu-logo.svg";
```

### Alterar Cores
Edite `client/src/index.css` e modifique as variáveis CSS.

### Alterar Título
Edite `client/src/const.ts`:
```typescript
export const APP_TITLE = "Seu Título";
```

## 📦 Build para Produção

```bash
# Build otimizado
pnpm build

# Testar build localmente
pnpm preview

# Enviar para seu servidor
# A pasta 'dist' contém os arquivos prontos para produção
```

## 🚀 Deploy

### Vercel (Recomendado)
1. Faça push para GitHub
2. Conecte o repositório no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático será realizado

### Outras Plataformas
- **Netlify**: Conecte o repositório GitHub
- **GitHub Pages**: Configure Actions para build automático
- **Seu Servidor**: Faça upload da pasta `dist`

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para diretrizes.

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/lipefan0/biblia-para-todos-frontend/issues) com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs observado
- Screenshots (se aplicável)

## 📝 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](./LICENSE) para detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para facilitar a leitura e compreensão da Bíblia com auxílio de IA.

## 🙏 Agradecimentos

- [React](https://react.dev) - Biblioteca UI
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [tRPC](https://trpc.io) - Comunicação type-safe
- [shadcn/ui](https://ui.shadcn.com) - Componentes UI
- [Vite](https://vitejs.dev) - Build tool

## 📞 Suporte

Para dúvidas ou sugestões, abra uma [discussion](https://github.com/lipefan0/biblia-para-todos-frontend/discussions) ou entre em contato.

---

**Última atualização**: Novembro 2025

Feito com 💜 para a comunidade cristã
