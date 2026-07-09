# {{PROJECT_NAME}}

> 🤖 Agentic AI workflow — powered by [OpenAI Agents SDK](https://github.com/openai/openai-agents-python)

## Quick Start

```bash
# 1. Install deps
uv sync

# 2. Set your API key
cp .env.example .env
# edit .env → add OPENAI_API_KEY

# 3. Run
uv run main.py
```

## Project Structure

```
{{PROJECT_NAME}}/
├── main.py          # Entry point — run this
├── agents/          # Agent definitions
│   └── base.py      # Your agent(s) live here
├── tools/           # Function tools
│   └── example.py   # Add your tools here
├── tests/           # Pytest tests
│   └── test_agent.py
├── pyproject.toml   # Python deps (managed by uv)
├── .env.example     # Copy to .env, add API key
└── README.md        # This file
```

## Adding a Tool

```python
# tools/my_tool.py
from agents import function_tool

@function_tool
def my_tool(input: str) -> str:
    """Describe what this tool does."""
    return f"Result: {input}"
```

Then register it on your agent:
```python
from tools.my_tool import my_tool
agent = Agent(name="MyAgent", tools=[my_tool], ...)
```

## Running Tests

```bash
uv run pytest
```

## Tracing

OpenAI Agents SDK has built-in tracing. View traces at:
https://platform.openai.com/traces

## Type: {{AGENT_TYPE}}

This project was bootstrapped with `npx create-agent {{PROJECT_NAME}} --type {{AGENT_TYPE}}`.
