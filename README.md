# Prototype Agro | Landing Page

Landing page premium em React + TypeScript + Tailwind + GSAP, com narrativa scroll-driven e hero com sequência WEBP.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy público

O repositório está configurado para deploy automático no GitHub Pages via workflow:

- Arquivo: `.github/workflows/deploy-pages.yml`
- Trigger: push na branch `main`
- Publicação: GitHub Pages (Actions)

O `vite.config.ts` ajusta automaticamente o `base` quando executa no GitHub Actions para funcionar corretamente em repositórios de projeto (ex: `https://usuario.github.io/nome-do-repo/`).
