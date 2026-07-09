"""
Built-in data analysis tools — CSV/Excel analysis with pandas.

Install: uv add 'create-agent[data]'  or  uv add pandas openpyxl tabulate
"""

from __future__ import annotations
from agents import function_tool


def _pd():
    try:
        import pandas as pd
        return pd
    except ImportError:
        raise ImportError("pandas not installed. Run: uv add 'create-agent[data]'")


@function_tool
def analyze_csv(file_path: str) -> str:
    """
    Load a CSV file and return a statistical summary:
    shape, column types, missing values, numeric stats, and a sample of rows.
    """
    from pathlib import Path
    pd = _pd()
    path = Path(file_path).expanduser()
    if not path.exists():
        return f"Error: file not found: {file_path}"
    try:
        df = pd.read_csv(path)
        return _summarise(df, path.name)
    except Exception as e:
        return f"Error: {e}"


@function_tool
def analyze_excel(file_path: str, sheet_name: str = "") -> str:
    """
    Load an Excel file and return a statistical summary per sheet.
    sheet_name: specific sheet to analyse (default: all sheets).
    """
    from pathlib import Path
    pd = _pd()
    path = Path(file_path).expanduser()
    if not path.exists():
        return f"Error: file not found: {file_path}"
    try:
        sheets = pd.read_excel(path, sheet_name=sheet_name or None)
        if isinstance(sheets, dict):
            return "\n\n---\n\n".join(
                f"## Sheet: {name}\n{_summarise(df, name)}"
                for name, df in sheets.items()
            )
        return _summarise(sheets, path.name)
    except Exception as e:
        return f"Error: {e}"


@function_tool
def query_csv(file_path: str, query: str) -> str:
    """
    Run a pandas query expression on a CSV file and return matching rows as markdown.
    query: pandas query string, e.g. "age > 30 and city == 'Hong Kong'"
    """
    from pathlib import Path
    pd = _pd()
    path = Path(file_path).expanduser()
    if not path.exists():
        return f"Error: file not found: {file_path}"
    try:
        df = pd.read_csv(path)
        result = df.query(query)
        if result.empty:
            return f"No rows matched: `{query}`"
        return f"**{len(result)} rows matched** `{query}`:\n\n{_df_to_md(result.head(50))}"
    except Exception as e:
        return f"Error running query `{query}`: {e}"


def _summarise(df, name: str) -> str:
    lines = [
        f"**{name}** — {df.shape[0]:,} rows × {df.shape[1]} columns",
        "",
        "### Columns",
        "| Column | Type | Non-null | Nulls |",
        "|--------|------|----------|-------|",
    ]
    for col in df.columns:
        dtype = str(df[col].dtype)
        non_null = df[col].count()
        nulls = df[col].isna().sum()
        lines.append(f"| {col} | {dtype} | {non_null:,} | {nulls:,} |")

    num_df = df.select_dtypes(include="number")
    if not num_df.empty:
        lines += ["", "### Numeric Summary"]
        lines.append(_df_to_md(num_df.describe().round(2)))

    lines += ["", "### Sample (first 5 rows)"]
    lines.append(_df_to_md(df.head(5)))
    return "\n".join(lines)


def _df_to_md(df) -> str:
    cols = list(df.columns)
    rows = df.values.tolist()
    header = "| " + " | ".join(str(c) for c in cols) + " |"
    sep = "| " + " | ".join(["---"] * len(cols)) + " |"
    body = "\n".join("| " + " | ".join(str(v) for v in row) + " |" for row in rows)
    return f"{header}\n{sep}\n{body}"


# Convenience bundle
DATA_TOOLS = [analyze_csv, analyze_excel, query_csv]
