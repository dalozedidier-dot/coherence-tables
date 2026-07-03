# ORI-C — Tableau de cohérence interactif

Interface GitHub Pages pour explorer les correspondances entre éléments chimiques, symboles mathématiques, secteurs d’usage et rôles épistémiques.

## Page publique

Le tableau est servi depuis :

```text
/docs/index.html
```

La page est volontairement autonome : plus de React/Babel obligatoire pour afficher le tableau. Elle charge les CSV, construit les filtres, puis affiche les vues directement en JavaScript natif.

## Améliorations interface

- Palette ORI-C : noir végétal, vert vivant, doré, bleu et violet.
- Recherche élargie : nom, symbole, bloc, groupe, secteur, usage, trace et lecture épistémique.
- Filtres croisés : blocs, secteurs, rôles déduits.
- Vues multiples : table, cartes, matrice, statistiques.
- Fiche détail au clic.
- Export rapide : copie CSV du résultat filtré.
- Interface responsive ordinateur/mobile.

## Données

- `chemical_elements.csv`
- `math_symbols.csv`

La page essaie d’abord de charger les CSV locaux depuis `/docs`. Si besoin, elle bascule vers les fichiers bruts du repo GitHub.

## GitHub Pages

Dans GitHub :

1. `Settings` → `Pages`
2. Source : `Deploy from a branch`
3. Branch : `main`
4. Folder : `/docs`

URL attendue :

```text
https://dalozedidier-dot.github.io/coherence-tables/
```

## Tests Python

```bash
PYTHONPATH=src pytest
```
