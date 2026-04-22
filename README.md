# Portfólio Profissional

Portfólio estático em HTML, CSS e JavaScript puro, pensado para publicação no GitHub Pages e apresentação em entrevistas para vagas de desenvolvimento.

## Objetivo

Este projeto foi refatorado para operar em dois modos:

- `modo público`: abre por padrão, sem interface de edição, com aparência profissional para recrutadores e lideranças técnicas
- `modo edição`: abre com `?edit=1`, ativa edição inline, painel lateral, persistência local e export/import em JSON

Exemplo:

- público: `https://seu-usuario.github.io/repositorio/`
- edição: `https://seu-usuario.github.io/repositorio/?edit=1`

## Arquivos principais

- `index.html`: estrutura da página, seções e elementos editáveis
- `styles.css`: visual da versão pública e estilos do modo de edição
- `script.js`: hidratação da página, persistência em `localStorage`, painel de edição e import/export
- `README.adendo.md`: documentação operacional e contexto para manutenção futura e uso com agents

## Estado atual do frontend

O frontend foi atualizado para ficar mais apresentável em entrevistas.

- hero mais forte, com posicionamento profissional, CTAs e destaque visual
- cards e seções menos genéricos, com narrativa mais autoral
- seção intermediária de diferenciais para comunicar critério de produto e interface
- projetos descritos com foco em contexto, proposta e conversa técnica
- manutenção da compatibilidade com deploy estático no GitHub Pages

## Projetos atualmente destacados

- `Golden State Warriors + Stephen Curry Experience`
  Projeto temático com foco em narrativa visual, identidade esportiva, seções editoriais, estatísticas e experiência imersiva.
- `SaaS de Atendimento para Loja de Agronegócio`
  Projeto de dashboard e fluxo operacional simulando atendimento, histórico, prioridade, status e visão de rotina comercial.
- `Outros projetos que podem entrar aqui`
  Espaço reservado para futuros cases autorais, integrações com APIs, dashboards ou estudos de UI.

## Fluxo recomendado

1. Abrir localmente com um servidor estático.
2. Entrar em `?edit=1`.
3. Preencher nome, stack, resumo, links e projetos reais.
4. Revisar a versão pública sem `?edit=1`.
5. Publicar no GitHub Pages.

## Servir localmente

```bash
python3 -m http.server 8000
```

Depois abra:

- `http://localhost:8000/` para revisar a versão pública
- `http://localhost:8000/?edit=1` para editar

## Publicação no GitHub Pages

1. Suba os arquivos para um repositório.
2. Vá em `Settings > Pages`.
3. Selecione a branch principal e a pasta raiz.
4. Aguarde a publicação do site.
5. Se usar domínio próprio, configure depois o DNS e o arquivo `CNAME`.

## Observações importantes

- O conteúdo salvo fica no navegador via `localStorage` com a chave `portfolio_v2`.
- O `localStorage` não substitui versionamento. Antes de publicar, confirme que o HTML padrão ou seu JSON exportado refletem o conteúdo final que você quer manter.
- Os links de projeto, GitHub, LinkedIn e currículo podem ser editados diretamente no modo edição clicando neles.
