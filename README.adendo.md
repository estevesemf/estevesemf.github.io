# Contexto Operacional do Portfólio

Este documento é o contexto de manutenção do projeto. Ele existe para você e para futuros agents entenderem rápido como editar, revisar e publicar o portfólio sem quebrar o fluxo de apresentação.

## Estado atual do projeto

Snapshot salvo em 2026-05-01. O site está em uma versão intermediária boa para subir, mas ainda aberta para ajustes finos de design, copy e projetos.

- Visual público mais profissional por padrão
- Direção visual clara/editorial, menos genérica e mais autoral
- Modo de edição separado por query string
- Estrutura preparada para destacar projetos reais do GitHub
- Compatível com hospedagem estática no GitHub Pages
- Sem dependências externas e sem build step
- Navegação principal com âncora direta para `Skills`
- Paleta clara inspirada em portfólios editoriais, com base quente e acentos terracota, azul, verde, dourado e lavanda
- Hero com foto principal recortada e box de tags `Web`, `Dados` e `Deploy`
- Projetos em formato de showcase visual: imagem grande/sticky no desktop e cards narrativos de cada projeto
- CTAs dos projetos lado a lado no desktop e empilhados no mobile
- Links sem URL real aparecem como `em breve`, sem `href="#"`, mas continuam editáveis em `?edit=1`

No estado atual, o site também passou a destacar melhor:

- narrativa visual no hero
- cards de destaque sobre diferenciais
- apresentação de projetos com contexto de produto e transição visual
- espaço para projetos em andamento bem descritos
- microinterações em botões, pills, cards, foto, links e troca ativa de projeto por scroll/clique

## Arquitetura resumida

### `index.html`

Responsável pela estrutura e pelo conteúdo inicial.

Blocos principais:

- hero com nome, posicionamento, resumo e CTAs
- bloco de estatísticas/resumo rápido
- seção de apresentação
- seção `Skills` com cards de diferenciais do portfólio
- showcase de projetos com preview visual grande, navegação 01/02/03 e cards de conteúdo
- cards de habilidades e diferenciais
- formação
- contato
- painel lateral de edição

Os elementos com `data-editable` são transformados em editáveis apenas no modo `?edit=1`.

Notas do estado atual:

- o menu possui links para `#about`, `#skills`, `#projects` e `#contact`
- a seção de skills usa `id="skills"` para navegação direta
- os cards fixos de projeto ficam dentro de `.project-story-list`
- o preview visual dos projetos usa `.project-stage`, `.project-frame`, `.project-poster` e `.poster-art`
- os cards de projeto usam classes compatíveis com o JavaScript: `.project-badge`, `.project-title`, `.project-type`, `.project-description` e `.project-stack`
- os badges dos projetos também são editáveis no modo `?edit=1`
- a foto do hero usa `profilePhoto` como imagem principal, sem miniaturas duplicadas

### `styles.css`

Responsável por dois cenários no mesmo arquivo:

- visual público
- visual de manutenção e painel lateral

Pontos relevantes:

- layout principal mais editorial, com seções abertas e cards apenas onde fazem sentido
- tipografia e composição mais fortes para sair da aparência de template
- hero com presença maior, foto principal recortada e box de tags profissionais
- responsividade sem framework
- `body.edit-mode` ativa apenas os comportamentos visuais de edição
- variáveis de cor centralizadas em `:root`
- botões principais com contraste forte e versão secundária clara
- seção de projetos usa preview grande no desktop e empilhamento no mobile
- links dos projetos usam grid com duas colunas no desktop e uma coluna no mobile
- `prefers-reduced-motion` continua respeitado para reduzir animações

Direção visual atual:

- manter a base clara/editorial
- evitar voltar para visual monocromático ou para o tema escuro anterior
- preservar os acentos terracota, azul, verde, dourado e lavanda
- preservar a lógica de recortes no hero e nos projetos
- manter hover perceptível, mas sem animações pesadas ou dependências externas

### `script.js`

Responsável por:

- detectar se a URL contém `?edit=1`
- ler e gravar dados no `localStorage`
- sincronizar painel de edição com a página
- permitir editar links clicando neles no modo de edição
- criar novos cards de projetos e formação
- exportar e importar JSON
- sincronizar os textos dos posters de projeto com os cards editáveis
- alternar o projeto ativo por `IntersectionObserver` durante o scroll
- permitir troca de projeto pelos botões 01/02/03
- aplicar parallax leve no poster ativo dos projetos

### `warriors/`

Demo estática linkada pelo projeto `Golden State Warriors + Stephen Curry Experience`.

Arquivos:

- `warriors/index.html`: página editorial temática em inglês
- `warriors/styles.css`: visual próprio da demo, independente do CSS principal
- `warriors/script.js`: ano automático, reveal on scroll e interação dos cards de momentos

Ponto de atenção:

- a demo usa fontes do Google Fonts e imagens externas do Unsplash; se a intenção for manter o portfólio 100% offline, esses assets devem ser trazidos para `assets/`.

## Fonte de verdade dos dados

Durante a edição, a fonte de verdade prática é o DOM, que depois é serializado para `localStorage`.

Persistência atual:

- chave: `portfolio_v2`
- meio: `localStorage`

Consequência importante:

- o site publicado não depende de backend
- mas o conteúdo salvo localmente vive só naquele navegador
- por isso exportar JSON continua sendo útil como backup

## Fluxo de manutenção recomendado

### Editar conteúdo

1. Subir servidor local.
2. Abrir `http://localhost:8000/?edit=1`.
3. Atualizar nome, resumo, local, foto e links.
4. Ajustar projetos, textos de diferenciais e formações.
5. Exportar JSON quando fechar uma versão boa.

### Revisar publicação

1. Abrir `http://localhost:8000/`.
2. Confirmar que a página está sem interface de edição.
3. Validar links, textos, responsividade e foto.

### Publicar

1. Commitar alterações do repositório.
2. Enviar para o GitHub.
3. Publicar via GitHub Pages.

## Como editar links

No modo `?edit=1`, os links clicáveis do site viram pontos de manutenção.

Isso inclui:

- GitHub
- LinkedIn
- currículo
- links dos projetos
- email
- telefone

Comportamento:

- clicar no link abre um `prompt`
- informar a nova URL
- o site salva automaticamente
- links sem URL real aparecem como `em breve` na versão pública, mas continuam editáveis no modo `?edit=1`

## Projetos destacados no momento

Atualmente, os projetos principais descritos na home são:

- `Golden State Warriors + Stephen Curry Experience`
  Projeto temático com storytelling visual, estética esportiva, blocos editoriais e demo em `warriors/`.
- `SaaS de Atendimento para Loja de Agronegócio`
  Projeto SaaS com foco em painel operacional, organização de atendimento e interface para rotina comercial.
- `Outros projetos que podem entrar aqui`
  Espaço de backlog para cases autorais, integrações com API, dashboards ou estudos de interface.

Estes projetos ainda podem estar em desenvolvimento. Mesmo assim, eles já funcionam como direção de portfólio e intenção de produto.

## Snapshot técnico mais recente

Arquivos alterados no snapshot atual:

- `index.html`
  - hero com foto única usando `profile-photo-main` e box `Web/Dados/Deploy`
  - seção de projetos convertida para `projects-showcase`
  - links placeholder removidos ou convertidos para estado `em breve`
  - `timeline-details` adicionado aos itens padrão de formação
- `styles.css`
  - nova paleta clara/editorial
  - layout responsivo ajustado para desktop e mobile
  - recortes com `clip-path` no hero e nos posters de projeto
  - estados de `aria-disabled` preservados para o modo público e editáveis no modo de edição
- `script.js`
  - `initProjectShowcase`, `syncProjectShowcase`, `setActiveProject` e funções auxiliares
  - `getEducationData` mais defensivo para itens antigos sem `.timeline-details`

Validações feitas antes deste snapshot:

- `node --check script.js`
- `git diff --check`
- screenshots via Chrome headless em desktop e mobile
- renderização isolada da seção de projetos para conferir o showcase

## Estrutura de dados exportada

O JSON exportado segue, em alto nível, esta estrutura:

```json
{
  "fullName": "Seu nome",
  "jobTitle": "Seu posicionamento",
  "shortBio": "Resumo curto",
  "aboutLead": "Resumo do card lateral",
  "aboutText": "Sobre detalhado",
  "locationText": "Local e disponibilidade",
  "profileTag": "Disponível para oportunidades",
  "photoUrl": "https://...",
  "contact": {
    "email": "mailto:...",
    "phone": "tel:...",
    "github": "https://github.com/...",
    "linkedin": "https://linkedin.com/in/...",
    "resumeUrl": "https://.../cv.pdf"
  },
  "projects": [],
  "education": []
}
```

## Diretrizes para futuros agents

Se um agent for mexer neste projeto, ele deve presumir:

- o site é estático e precisa continuar compatível com GitHub Pages
- não deve introduzir framework, bundler ou dependências sem necessidade explícita
- o modo público é prioridade
- o modo de edição é utilitário e não pode vazar para a experiência principal
- mudanças de conteúdo devem preservar a clareza para entrevistas
- links reais do GitHub são parte central do valor do portfólio

### O que um agent pode melhorar com segurança

- refino visual e tipografia
- acessibilidade e semântica
- SEO básico
- melhor organização dos cards de projeto
- aprofundamento visual do tema dos projetos em destaque
- melhorias na experiência do modo edição
- import/export mais robusto
- pré-preenchimento de projetos a partir de dados seus

### O que um agent não deve presumir

- URLs finais do seu GitHub, LinkedIn ou currículo
- experiência profissional que você não confirmou
- stack principal além do que estiver escrito na página
- implementação final dos projetos ainda não construídos

Observação:

- agora já existem nomes e direções de projetos definidos no portfólio, então um agent pode trabalhar em cima desses conceitos, mas não deve inventar detalhes técnicos finais sem sua confirmação.

## Critério de qualidade para este portfólio

Uma mudança é boa se ela melhorar pelo menos um destes pontos:

- deixa sua atuação como desenvolvedor mais clara
- facilita defender projetos em entrevista
- melhora a leitura dos links e CTAs
- mantém deploy simples no GitHub Pages
- reduz a cara de template genérico
- preserva a navegação direta para as seções principais
- mantém os cards de projetos equilibrados entre cabeçalho, texto e botões

## Próximos passos recomendados

- substituir placeholders por dados reais
- colocar links reais dos repositórios
- adicionar demos publicáveis quando existirem
- aprofundar o conteúdo visual e textual dos projetos do Golden State Warriors/Stephen Curry e do SaaS de agronegócio
- incluir currículo em PDF
- revisar o texto como se fosse um recrutador lendo em 30 segundos
