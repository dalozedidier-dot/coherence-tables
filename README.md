# coherence-tables

Tables "plug-and-play" (chimie + grammaire math) extraites des PDFs.

## Installation (editable)

```bash
pip install -e .
```

## Usage rapide

```python
from coherence_tables import load_chemical_elements, get_element_by_z, filter_elements_by_sector

df = load_chemical_elements()
h = get_element_by_z(1)
en = filter_elements_by_sector("EN")
```

## CLI

```bash
coherence-tables element --z 1
coherence-tables elements-by-sector --sector EN
coherence-tables math --z 60
coherence-tables math-by-sector --sector ANA
```
