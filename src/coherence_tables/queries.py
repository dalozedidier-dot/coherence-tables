from __future__ import annotations

import pandas as pd

from .loaders import load_chemical_elements, load_math_symbols

def _normalize_sector(sector: str) -> str:
    return sector.strip().upper()

def _has_sector(secteurs_field: str, sector: str) -> bool:
    sector = _normalize_sector(sector)
    parts = [s.strip().upper() for s in secteurs_field.split(";") if s.strip()]
    return sector in parts

def get_element_by_z(z: int) -> pd.Series:
    """Return the row (as a Series) for atomic number Z."""
    df = load_chemical_elements()
    hit = df.loc[df["Z"] == int(z)]
    if hit.empty:
        raise KeyError(f"No element with Z={z}")
    return hit.iloc[0]

def filter_elements_by_sector(sector: str) -> pd.DataFrame:
    """Filter chemical elements by a multisector code (EN, CHI, MAT, ...)."""
    df = load_chemical_elements()
    sector = _normalize_sector(sector)
    return df[df["secteurs"].apply(lambda s: _has_sector(s, sector))].reset_index(drop=True)

def get_math_symbol_by_z(z: int) -> pd.Series:
    """Return the row (as a Series) for math-symbol index Z."""
    df = load_math_symbols()
    hit = df.loc[df["Z"] == int(z)]
    if hit.empty:
        raise KeyError(f"No math symbol with Z={z}")
    return hit.iloc[0]

def filter_symbols_by_sector(sector: str) -> pd.DataFrame:
    """Filter math symbols by a multisector code (LOG, ENS, ANA, ...)."""
    df = load_math_symbols()
    sector = _normalize_sector(sector)
    return df[df["secteurs"].apply(lambda s: _has_sector(s, sector))].reset_index(drop=True)
