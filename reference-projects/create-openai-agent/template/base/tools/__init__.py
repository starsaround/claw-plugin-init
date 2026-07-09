"""
tools/__init__.py — central registry of all built-in tools.

Usage:
    from tools import FILE_TOOLS, DOCS_TOOLS, WEB_TOOLS, DATA_TOOLS, ALL_TOOLS

Each group requires a specific optional dep:
    File tools:  uv add 'create-agent[file]'   (markitdown openpyxl)
    Docs tools:  uv add 'create-agent[docs]'   (python-docx openpyxl weasyprint markdown)
    Web tools:   uv add 'create-agent[web]'    (httpx markitdown duckduckgo-search)
    Data tools:  uv add 'create-agent[data]'   (pandas openpyxl)
    Everything:  uv add 'create-agent[all]'

Or pick individual tools:
    from tools.files import read_pdf, read_csv
    from tools.web import fetch_url, search_web
    from tools.docs import create_word_doc, create_excel
    from tools.data import analyze_csv, query_csv
"""

from tools.files import FILE_TOOLS
from tools.docs import DOCS_TOOLS
from tools.web import WEB_TOOLS
from tools.data import DATA_TOOLS

ALL_TOOLS = FILE_TOOLS + DOCS_TOOLS + WEB_TOOLS + DATA_TOOLS

__all__ = ["FILE_TOOLS", "DOCS_TOOLS", "WEB_TOOLS", "DATA_TOOLS", "ALL_TOOLS"]
