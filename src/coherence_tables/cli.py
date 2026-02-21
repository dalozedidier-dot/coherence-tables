from __future__ import annotations

import argparse
from .queries import get_element_by_z, get_math_symbol_by_z, filter_elements_by_sector, filter_symbols_by_sector

def main(argv=None) -> int:
    p = argparse.ArgumentParser(prog="coherence-tables")
    sub = p.add_subparsers(dest="cmd", required=True)

    p_el = sub.add_parser("element", help="Lookup chemical element by Z")
    p_el.add_argument("--z", type=int, required=True)

    p_es = sub.add_parser("elements-by-sector", help="Filter chemical elements by sector code")
    p_es.add_argument("--sector", required=True)

    p_ms = sub.add_parser("math", help="Lookup math symbol by Z")
    p_ms.add_argument("--z", type=int, required=True)

    p_mss = sub.add_parser("math-by-sector", help="Filter math symbols by sector code")
    p_mss.add_argument("--sector", required=True)

    args = p.parse_args(argv)

    if args.cmd == "element":
        print(get_element_by_z(args.z).to_string())
        return 0
    if args.cmd == "elements-by-sector":
        print(filter_elements_by_sector(args.sector).to_string(index=False))
        return 0
    if args.cmd == "math":
        print(get_math_symbol_by_z(args.z).to_string())
        return 0
    if args.cmd == "math-by-sector":
        print(filter_symbols_by_sector(args.sector).to_string(index=False))
        return 0
    return 2

if __name__ == "__main__":
    raise SystemExit(main())
