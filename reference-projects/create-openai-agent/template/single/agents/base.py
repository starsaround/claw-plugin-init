"""Agent definition for {{PROJECT_NAME}}."""

from agents import Agent
from tools.files import FILE_TOOLS
from tools.web import WEB_TOOLS

# ── Uncomment to add more tool groups ──────────────────────────────────────
# from tools.docs import DOCS_TOOLS   # generate Word, Excel, PDF
# from tools.data import DATA_TOOLS   # pandas CSV/Excel analysis
# from tools import ALL_TOOLS         # everything

agent = Agent(
    name="{{PROJECT_NAME}}",
    instructions="""
    You are a helpful AI assistant. Be concise, accurate, and friendly.

    You can:
    - Read files: PDF, Word, Excel, CSV, images — use read_file or read_pdf, read_csv, read_excel
    - Fetch web pages and search the web — use fetch_url and search_web
    - List files in a directory — use list_directory

    Always use tools when the user asks about files or web content.
    """,
    model="gpt-4o-mini",
    tools=FILE_TOOLS + WEB_TOOLS,
)
