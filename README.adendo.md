# Contexto Operacional do Portfólio

Este documento é o contexto de manutenção do projeto. Ele existe para você e para futuros agents entenderem rápido como editar, revisar e publicar o portfólio sem quebrar o fluxo de apresentação.

## Estado atual do projeto

O site foi reposicionado para uso em entrevistas.

- Visual público mais profissional por padrão
- Direção visual mais forte, menos genérica e mais autoral
- Modo de edição separado por query string
- Estrutura preparada para destacar projetos reais do GitHub
- Compatível com hospedagem estática no GitHub Pages
- Sem dependências externas e sem build step

No estado atual, o site também passou a destacar melhor:

- narrativa visual no hero
- cards de destaque sobre diferenciais
- apresentação de projetos com contexto de produto
- espaço para projetos em andamento bem descritos

## Arquitetura resumida

### `index.html`

Responsável pela estrutura e pelo conteúdo inicial.

Blocos principais:

- hero com nome, posicionamento, resumo e CTAs
- bloco de estatísticas/resumo rápido
- seção de apresentação
- seção intermediária de diferenciais do portfólio
- grid de projetos
- grid de skills por grupos
- formação
- contato
- painel lateral de edição

Os elementos com `data-editable` são transformados em editáveis apenas no modo `?edit=1`.

### `styles.css`

Responsável por dois cenários no mesmo arquivo:

- visual público
- visual de manutenção e painel lateral

Pontos relevantes:

- layout principal em cards com fundo translúcido
- tipografia e composição mais fortes para sair da aparência de template
- hero com presença maior e blocos de destaque visuais
- responsividade sem framework
- `body.edit-mode` ativa apenas os comportamentos visuais de edição

### `script.js`

Responsável por:

- detectar se a URL contém `?edit=1`
- ler e gravar dados no `localStorage`
- sincronizar painel de edição com a página
- permitir editar links clicando neles no modo de edição
- criar novos cards de projetos, formação e skills
- exportar e importar JSON

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

## Projetos destacados no momento

Atualmente, os projetos principais descritos na home são:

- `Golden State Warriors + Stephen Curry Experience`
  Projeto temático com storytelling visual, estética esportiva, blocos editoriais e espaço para dados/estatísticas.
- `SaaS de Atendimento para Loja de Agronegócio`
  Projeto SaaS com foco em painel operacional, organização de atendimento e interface para rotina comercial.

Estes projetos ainda podem estar em desenvolvimento. Mesmo assim, eles já funcionam como direção de portfólio e intenção de produto.

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
  "skills": [],
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

## Próximos passos recomendados

- substituir placeholders por dados reais
- colocar links reais dos repositórios
- adicionar demos publicáveis quando existirem
- aprofundar o conteúdo visual e textual dos projetos do Golden State Warriors/Stephen Curry e do SaaS de agronegócio
- incluir currículo em PDF
- revisar o texto como se fosse um recrutador lendo em 30 segundos
