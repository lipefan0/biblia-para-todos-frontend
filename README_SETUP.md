# Bíblia Para Todos - Frontend

Um website moderno e responsivo para leitura da Bíblia com funcionalidades de autenticação, histórico de leitura e explicações teológicas alimentadas por IA.

## 🌟 Funcionalidades

### Área Pública
- ✅ Listagem de todos os livros da Bíblia
- ✅ Navegação por capítulos e versículos
- ✅ Paginação de versículos dentro de cada capítulo
- ✅ Busca avançada de versículos
- ✅ Interface responsiva e intuitiva

### Área Autenticada
- ✅ Registro e login com JWT
- ✅ Dashboard do usuário
- ✅ Histórico de leitura
- ✅ Estatísticas de leitura
- ✅ Gerenciamento de assinatura

### Funcionalidades de IA (AI_PREMIUM)
- ✅ Hover interativo nos versículos
- ✅ Botão "Explicar com IA" em cada versículo
- ✅ Explicação teológica de versículos individuais
- ✅ Análise de múltiplos versículos
- ✅ Resumo de capítulos completos

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Backend Communication**: tRPC, Fetch API
- **Roteamento**: Wouter
- **Componentes UI**: shadcn/ui
- **Autenticação**: JWT (localStorage)
- **Build Tool**: Vite

## 📋 Pré-requisitos

- Node.js 22.13.0 ou superior
- npm ou pnpm
- Backend API Kotlin Spring Boot rodando em `http://localhost:8080`

## 🔧 Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/seu-usuario/biblia-para-todos-frontend.git
cd biblia-para-todos-frontend
```

2. **Instale as dependências**:
```bash
pnpm install
# ou
npm install
```

3. **Configure as variáveis de ambiente**:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
VITE_API_BASE_URL=http://localhost:8080
JWT_SECRET=sua_chave_secreta_aqui
```

4. **Inicie o servidor de desenvolvimento**:
```bash
pnpm dev
# ou
npm run dev
```

O website estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
client/
  ├── public/              # Arquivos estáticos
  ├── src/
  │   ├── pages/          # Páginas da aplicação
  │   ├── components/     # Componentes reutilizáveis
  │   ├── contexts/       # React contexts
  │   ├── hooks/          # Custom hooks
  │   ├── lib/            # Utilitários e configurações
  │   ├── App.tsx         # Componente raiz
  │   ├── main.tsx        # Entrada da aplicação
  │   └── index.css       # Estilos globais
server/
  ├── _core/              # Configurações do servidor
  ├── api-client.ts       # Cliente HTTP para a API
  ├── routers.ts          # Routers tRPC
  └── db.ts               # Helpers de banco de dados
drizzle/
  └── schema.ts           # Schema do banco de dados
```

## 🔌 Endpoints da API

O projeto consome os seguintes endpoints do backend:

### Bíblia
- `GET /api/bible/books` - Listar todos os livros
- `GET /api/bible/books/:bookAbreviation/details` - Detalhes de um livro
- `GET /api/bible/:bookAbreviation/:chapter?page=X` - Versículos de um capítulo
- `GET /api/bible/search/versiculo?keyword=X&page=Y` - Buscar versículos

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Progresso de Leitura (Autenticado)
- `POST /api/reading-progress` - Salvar progresso
- `GET /api/reading-progress?page=X` - Obter histórico
- `GET /api/reading-progress/stats` - Obter estatísticas
- `GET /api/reading-progress/check/:verseId` - Verificar se versículo foi lido
- `DELETE /api/reading-progress/:progressId` - Deletar progresso

### Assinatura (Autenticado)
- `GET /api/subscription` - Obter plano atual
- `POST /api/subscription/upgrade` - Fazer upgrade

### IA (Autenticado, AI_PREMIUM)
- `POST /api/bible-ai/explain-verse` - Explicar um versículo
- `POST /api/bible-ai/explain-verses` - Explicar múltiplos versículos
- `POST /api/bible-ai/summarize-chapter` - Resumir capítulo

## 🔐 Autenticação

A autenticação é feita via JWT armazenado em localStorage. Após o login, o token é automaticamente incluído em todas as requisições para endpoints protegidos.

Para fazer logout, o token é removido do localStorage.

## 🎨 Customização

### Alterar o Logo
Edite o arquivo `client/src/const.ts` e atualize a constante `APP_LOGO`:

```typescript
export const APP_LOGO = "/seu-logo.svg";
```

### Alterar Cores
As cores são definidas em `client/src/index.css` usando CSS variables. Edite os valores em `:root` para customizar o tema.

### Alterar Título
Edite o arquivo `client/src/const.ts` e atualize a constante `APP_TITLE`.

## 🚀 Deploy

### Vercel
1. Faça push do código para o GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático será realizado

### Outras Plataformas
```bash
pnpm build
# Envie a pasta `dist` para sua plataforma de hosting
```

## 📝 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_API_BASE_URL` | URL base da API backend | `http://localhost:8080` |
| `JWT_SECRET` | Chave secreta para JWT | `sua_chave_secreta` |
| `VITE_APP_TITLE` | Título da aplicação | `Bíblia Para Todos` |
| `VITE_APP_LOGO` | Caminho do logo | `/logo.svg` |

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
pnpm install
```

### Erro: "API connection refused"
Certifique-se de que o backend está rodando em `http://localhost:8080`

### Erro: "JWT token expired"
Faça login novamente para obter um novo token

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no GitHub.

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Desenvolvido com ❤️

Website desenvolvido para facilitar a leitura e compreensão da Bíblia com auxílio de IA.
