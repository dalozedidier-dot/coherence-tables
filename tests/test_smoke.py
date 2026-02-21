import pandas as pd
from coherence_tables import load_chemical_elements, load_math_symbols

def test_chem_len():
    df = load_chemical_elements()
    assert len(df) == 118
    assert df["Z"].min() == 1 and df["Z"].max() == 118

def test_math_nonempty():
    df = load_math_symbols()
    assert len(df) > 0
    assert df["Z"].min() == 1
