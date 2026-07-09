# create-agent 🤖

One-command bootstrap for [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) projects.

## Usage

```bash
# npx (no install needed)
npx create-agent my-project

# With agent type
npx create-agent my-project --type single   # default — single agent + tools
npx create-agent my-project --type multi    # multi-agent with handoffs
npx create-agent my-project --type voice    # voice pipeline (STT → agent → TTS)

# uvx (if you prefer Python toolchain)
uvx create-agent my-project
```

## What you get

```
my-project/
├── main.py                          # Entry point — just run this
├── agents/                          # Agent definitions
├── tools/                           # @function_tool functions
├── tests/                           # Pytest tests (ready to run)
├── pyproject.toml                   # uv-managed deps
├── Makefile                         # make run / make test / make lint
├── .env.example                     # Copy → .env, add OPENAI_API_KEY
├── .gitignore
└── .github/copilot-instructions.md  # Copilot context — team onboarding
```

## After bootstrap

```bash
cd my-project
cp .env.example .env    # add your OPENAI_API_KEY
uv sync                 # install deps
uv run main.py          # run your agent
```

## Agent types

| Type | Description |
|------|-------------|
| `single` | Single agent with function tools. Best starting point. |
| `multi` | Orchestrator + specialist agents connected via handoffs. |
| `voice` | Voice pipeline skeleton (STT → agent → TTS). |

## Copilot integration

Every project includes `.github/copilot-instructions.md`. When your teammate opens the project in VS Code with GitHub Copilot, it automatically loads the agent context — they can ask Copilot things like:

- *"Add a tool that fetches weather data"*
- *"Add a guardrail that blocks off-topic questions"*
- *"Write a test for the orchestrator"*
- *"Add memory to persist conversation history"*

## Stack

- [openai-agents](https://github.com/openai/openai-agents-python) — OpenAI Agents SDK
- [uv](https://docs.astral.sh/uv/) — Python package manager
- [pytest](https://pytest.org) — testing
- [ruff](https://docs.astral.sh/ruff/) — linting + formatting

## Author

Eddie Chan — [github.com/unrealandychan](https://github.com/unrealandychan)
