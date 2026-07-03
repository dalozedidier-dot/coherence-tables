# Correctif ciblé pour https://dalozedidier-dot.github.io/coherence-tables/index.html

Ce patch remplace la page GitHub Pages du repo `coherence-tables`.

Fichiers importants :

- `docs/index.html` : nouvelle interface autonome ORI-C
- `docs/app.jsx` : version React synchronisée
- `docs/chemical_elements.csv` et `docs/math_symbols.csv` : données locales pour éviter les problèmes de chargement
- `docs/.nojekyll` : désactive le traitement Jekyll inutile
- `README.md` : documentation mise à jour

## Commandes rapides

```bash
git clone https://github.com/dalozedidier-dot/coherence-tables.git
cd coherence-tables
# copier le contenu de ce patch à la racine du repo

git add docs/index.html docs/app.jsx docs/chemical_elements.csv docs/math_symbols.csv docs/.nojekyll README.md coherence_science_interactive.jsx
git commit -m "Update ORI-C table interface"
git push origin main
```

Si le build réussit mais que le déploiement Pages échoue encore :

1. GitHub → repo `coherence-tables`
2. Actions → dernier run `pages-build-deployment`
3. Cliquer `Re-run failed jobs`

Ou forcer un nouveau déploiement :

```bash
git commit --allow-empty -m "chore: trigger Pages redeploy"
git push origin main
```
