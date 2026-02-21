from __future__ import annotations

from importlib.resources import files
import pandas as pd

_DATA_DIR = files(__package__) / "data"

def _read_csv(name: str) -> pd.DataFrame:
    path = _DATA_DIR / name
    return pd.read_csv(path, dtype={"Z": "int64"}, keep_default_na=False)

def load_chemical_elements() -> pd.DataFrame:
    """Return the chemical elements table as a Pandas DataFrame (118 rows)."""
    return _read_csv("chemical_elements.csv")

def load_math_symbols() -> pd.DataFrame:
    """Return the math symbols table as a Pandas DataFrame."""
    return _read_csv("math_symbols.csv")
