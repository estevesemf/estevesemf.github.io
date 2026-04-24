# Portfólio Profissional

Portfólio pessoal desenvolvido em HTML, CSS e JavaScript puro, publicado via GitHub Pages. O objetivo do projeto é apresentar perfil profissional, projetos em destaque e capacidade de construir interfaces web com identidade visual forte e manutenção simples.

## Visão geral

O site funciona em dois modos:

- `modo público`: versão principal, pensada para recrutadores, clientes e entrevistas
- `modo edição`: acessado com `?edit=1`, habilita edição inline, painel lateral e exportação/importação em JSON

Exemplos:

- público: `https://seu-usuario.github.io/repositorio/`
- edição: `https://seu-usuario.github.io/repositorio/?edit=1`

## Estrutura do projeto

- `index.html`: estrutura da página e conteúdo inicial
- `styles.css`: identidade visual, responsividade e estilos do modo de edição
- `script.js`: lógica de edição, persistência em `localStorage` e sincronização do conteúdo
- `warriors/`: demo temática do projeto Golden State Warriors + Stephen Curry Experience
- `README.adendo.md`: contexto operacional para manutenção futura

## Recursos atuais

- layout estático compatível com GitHub Pages
- navegação por âncoras para Sobre, Skills, Projetos e Contato
- modo de edição sem backend
- persistência local com `localStorage`
- exportação e importação de dados em JSON
- seções preparadas para projetos, habilidades em cards, formação e contato
- identidade visual escura com acentos em azul, âmbar, verde e lavanda
- botões e cards com microinterações de hover
- cards de projetos com título à direita, CTAs lado a lado no desktop e layout adaptado no mobile
- demo temática em `warriors/` linkada a partir do primeiro projeto

## Estado visual atual

A versão atual prioriza uma apresentação mais autoral e interativa:

- fundo escuro com gradientes suaves e textura discreta
- seção `Skills` acessível diretamente pelo menu
- botões principais claros com gradiente lavanda/azul e seta animada no hover
- cards de skills com cores por categoria
- cards de projetos com melhor hierarquia entre badge, título, descrição, stack e links
- foto/card do hero com zoom leve e sombra no hover

## Desenvolvimento local

Execute um servidor estático:

```bash
python3 -m http.server 8000
```

Depois acesse:

- `http://localhost:8000/` para revisar a versão pública
- `http://localhost:8000/?edit=1` para editar conteúdo localmente

## Publicação

Como o projeto é estático, basta versionar os arquivos da raiz e publicar pelo GitHub Pages. Em `Settings > Pages`, selecione a branch principal e a pasta raiz do repositório.

## Observações

- os dados editados localmente usam a chave `portfolio_v2`
- mudanças feitas em `?edit=1` não substituem o versionamento do repositório
- revise a versão pública antes de publicar para evitar placeholders, links quebrados ou conteúdo incompleto
