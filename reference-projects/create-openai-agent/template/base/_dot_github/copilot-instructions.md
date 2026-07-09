# Copilot Instructions for {{PROJECT_NAME}}

## What this project is

An agentic AI workflow built with the **OpenAI Agents SDK** (`openai-agents` package).
Type: **{{AGENT_TYPE}}**

## Key primitives

- `Agent` — defines an AI agent with instructions, tools, and optional handoffs
- `Runner.run()` / `Runner.run_sync()` — executes an agent against an input
- `@function_tool` — decorator that turns a Python function into a tool the agent can call
- `handoff()` — passes control from one agent to another

## Project layout

- `main.py` — entry point, run with `uv run main.py`
- `agents/` — Agent definitions
- `tools/` — `@function_tool` functions
  - `tools/files.py` — read PDF, Word, Excel, CSV, images (via markitdown)
  - `tools/docs.py` — create Word (.docx), Excel (.xlsx), PDF
  - `tools/web.py` — fetch URLs, DuckDuckGo search
  - `tools/data.py` — pandas CSV/Excel analysis and querying
- `mcp.json` — MCP server config (filesystem, fetch, memory)
- `tests/` — pytest tests

## How to run

```bash
uv run main.py
```

## Installing optional tool groups

```bash
uv add 'openai-agents[file]'   # PDF, Word, Excel, CSV reading
uv add 'openai-agents[docs]'   # Generate Word, Excel, PDF
uv add 'openai-agents[web]'    # Fetch URLs, web search
uv add 'openai-agents[data]'   # pandas data analysis
uv add 'openai-agents[all]'    # Everything
```

## Using built-in tools on an agent

```python
from tools.files import FILE_TOOLS
from tools.web import WEB_TOOLS
from tools import ALL_TOOLS  # everything

agent = Agent(name="MyAgent", tools=FILE_TOOLS + WEB_TOOLS, ...)
```

## MCP servers (mcp.json)

Pre-configured servers:
- `filesystem` — read/write local files via MCP
- `fetch` — fetch web pages (uvx mcp-server-fetch)
- `memory` — persistent key-value memory

## Common tasks (just ask Copilot)

- "Add a tool that reads PDF files from a folder"
- "Make the agent analyse a CSV and write a summary to Word"
- "Add a second agent and create a handoff from the first"
- "Add a guardrail that rejects off-topic questions"
- "Write a test for the main agent"
- "Stream the output token by token"
- "Add conversation memory using a Session"
- "Enable the filesystem MCP server"

## Code style

- Python 3.11+, type hints on all functions
- `async/await` preferred for agent runs
- Tools must have a docstring (used as the tool description by the SDK)
- `uv run ruff format .` before committing
