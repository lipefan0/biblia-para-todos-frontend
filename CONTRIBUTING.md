# Contribuindo para Bíblia Para Todos

Obrigado por considerar contribuir para o projeto Bíblia Para Todos! Este documento fornece diretrizes e instruções para contribuir.

## 🤝 Como Contribuir

### Reportando Bugs

Antes de criar um relatório de bug, verifique se o problema já foi reportado. Se você encontrar um bug:

1. **Use um título claro e descritivo**
2. **Descreva os passos exatos** para reproduzir o problema
3. **Forneça exemplos específicos** para demonstrar os passos
4. **Descreva o comportamento observado** e o que você esperava ver
5. **Inclua screenshots ou GIFs** se possível
6. **Mencione sua versão do Node.js** e do navegador

### Sugerindo Melhorias

Sugestões de melhorias são sempre bem-vindas! Para sugerir uma melhoria:

1. **Use um título claro e descritivo**
2. **Forneça uma descrição detalhada** da melhoria sugerida
3. **Liste alguns exemplos** de como a melhoria seria útil
4. **Mencione se há exemplos** de outras aplicações que implementam algo similar

## 🔄 Pull Requests

- Siga o estilo de código do projeto
- Inclua screenshots e GIFs animadas em suas PRs quando apropriado
- Siga os templates de PR se fornecidos
- Termine todos os arquivos com uma nova linha

## 📝 Estilo de Código

### TypeScript
- Use tipos explícitos quando possível
- Evite `any` type
- Use `const` por padrão, `let` quando necessário

### React
- Use functional components com hooks
- Nomeie componentes em PascalCase
- Use custom hooks para lógica reutilizável

### CSS/Tailwind
- Use classes Tailwind em vez de CSS customizado quando possível
- Mantenha a consistência com o design system existente
- Use variáveis CSS para cores e espaçamento

## 🧪 Testes

Antes de submeter uma PR:

```bash
# Instale as dependências
pnpm install

# Rode o linter
pnpm lint

# Rode os testes
pnpm test

# Build para produção
pnpm build
```

## 📦 Processo de Desenvolvimento

1. **Fork o repositório**
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit suas mudanças** (`git commit -m 'Add some AmazingFeature'`)
4. **Push para a branch** (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

## 📋 Checklist para Pull Request

- [ ] Meu código segue o estilo de código do projeto
- [ ] Executei um `pnpm lint` e corrigi os problemas
- [ ] Executei um `pnpm build` com sucesso
- [ ] Adicionei testes para as novas features
- [ ] Atualizei a documentação se necessário
- [ ] Meu PR descreve claramente o problema e a solução

## 🎯 Diretrizes de Commit

- Use o imperativo ("Add feature" não "Added feature")
- Limite a primeira linha a 72 caracteres ou menos
- Referencie issues e pull requests liberalmente após a primeira linha
- Considere começar a mensagem de commit com um emoji:
  - 🎉 `:tada:` Novo recurso
  - 🐛 `:bug:` Correção de bug
  - 📚 `:books:` Documentação
  - 🎨 `:art:` Melhorias de estilo
  - ♻️ `:recycle:` Refatoração
  - ⚡ `:zap:` Melhoria de performance

## 📞 Perguntas?

Sinta-se livre para abrir uma issue com a tag `question` se tiver dúvidas.

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a MIT License.

---

Obrigado por contribuir! 🙏
