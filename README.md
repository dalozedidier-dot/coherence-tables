# Démo HTML (GitHub Pages)

Ce dossier contient une démo autonome (sans bundler) pour afficher `coherence_science_interactive.jsx`
directement sur GitHub Pages.

## Contenu
- `docs/index.html` : page GitHub Pages
- `docs/app.jsx` : composant React adapté pour Babel Standalone (pas d'import/export)

## Mise en ligne sur GitHub Pages
1) Copie le dossier `docs/` à la racine de ton repo GitHub
2) GitHub → Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /docs
3) URL attendue:
   https://<user>.github.io/<repo>/

## Notes
- Cette approche utilise Babel dans le navigateur: parfaite pour démo, pas pour production.
- Si tu veux une version "pro", on passe à Vite + build.
