# Portfólio pessoal

Portfólio pessoal em <https://estevesmelo.me>, hospedado pelo GitHub Pages.
Apresenta perfil, skills, projetos em destaque e contato numa página única, em
HTML, CSS e JavaScript puros — sem framework, sem bundler, sem etapa de build.

## O que demonstra tecnicamente

- Layout editorial responsivo escrito à mão, sem framework de CSS
- Showcase de projetos com troca por scroll e clique (`IntersectionObserver`),
  parallax leve e microinterações que respeitam `prefers-reduced-motion`
- **Modo de edição sem backend**: abrir `?edit=1` torna o conteúdo editável na
  própria página, com persistência em `localStorage` (chave `portfolio_v2`) e
  exportação/importação do conteúdo em JSON
- Publicação estática pelo GitHub Actions, sem etapa de compilação

## Rodar localmente

```bash
python3 -m http.server 8000
```

- `http://localhost:8000/` — versão pública
- `http://localhost:8000/?edit=1` — modo de edição

## Estrutura

```txt
index.html          estrutura da página e conteúdo inicial
styles.css          identidade visual, responsividade e estilos do modo de edição
script.js           modo de edição, localStorage, import/export JSON e showcase de projetos
README.adendo.md    contexto de manutenção: arquitetura detalhada e direção visual
.github/workflows/pages.yml  publicação dos arquivos públicos no Pages
```

O Warriors é um repositório separado (`estevesemf/warriors-curry-impact`),
publicado em https://warriors-two.vercel.app; a antiga demo estática `warriors/`
foi removida em 06/11/2026.

## Estado

Atualização local de 06/11/2026: Sobre, skills e formação revisados com fontes
locais e relato do usuário. Após autorização para reavaliar a ordem e uma mesa
completa, os projetos ficaram: Warriors, Travessias de Januária, Agrostore e
Agendamento. A apresentação preserva a direção editorial e os títulos à esquerda.
O resumo técnico e as pendências ficam em `ESTADO.md`, contexto local não publicado.
As capturas dos projetos ficam em `assets/img/projetos/`.

Januária tem endereço próprio; Warriors aponta para a aplicação publicada
na Vercel com banco no Neon. Agendamento e Agrostore ainda não têm
demonstração pública confirmada. Repositórios privados estão identificados como
tal, e o currículo em PDF continua pendente. O workflow publica os arquivos do
site a cada push para `main`, com a origem do Pages configurada como GitHub
Actions. HTML, CSS, JavaScript e imagens são copiados para `_site/`, sem Jekyll.
Arquivos de contexto e documentação não entram no artefato publicado.

A formação distingue graduação em curso de estudos em andamento: fullstack,
containers, dados, SQL e Segurança da Informação. A nomenclatura
[Master.dev](https://master.dev/) e o curso
[Complete Intro to Containers v2](https://master.dev/courses/complete-intro-containers-v2/)
foram conferidos nas fontes oficiais; isso não comprova conclusão pelo usuário.
Swarm aparece como aprofundamento, não como cluster implantado.
