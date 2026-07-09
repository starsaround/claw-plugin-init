# claw-plugin-init <a href="https://npmjs.com/package/claw-plugin-init"><img src="https://img.shields.io/npm/v/claw-plugin-init" alt="npm package"></a>

Scaffold [OpenClaw](https://openclaw.ai) Plugin projects with one command.

```bash
npx claw-plugin-init my-plugin
```

Then follow the prompts — you'll have a working plugin in seconds.

---

## Usage

### Interactive

```bash
# npm
npx claw-plugin-init my-plugin

# pnpm
pnpm create claw-plugin-init

# yarn
yarn create claw-plugin-init
```

### Non-interactive (CLI flags)

```bash
npx claw-plugin-init my-plugin --type tool-plugin --no-install
```

### Skip all prompts

```bash
npx claw-plugin-init my-plugin --yes
```

### Scaffold in current directory

```bash
npx claw-plugin-init . --force
```

### Preview only (dry run)

```bash
npx claw-plugin-init my-plugin --dry-run
```

---

## CLI Options

| Flag | Description |
|------|-------------|
| `--type`, `-t` | Plugin type: `tool-plugin` (default), `channel-plugin`, `provider-plugin`, `mcp-server` |
| `--force`, `-f` | Overwrite existing directory |
| `--yes`, `-y` | Skip all prompts, accept defaults |
| `--no-install` | Skip dependency installation |
| `--git` / `--no-git` | Initialize (or skip) a Git repository |
| `--dry-run` | Preview actions without executing |
| `--help`, `-h` | Show help |

---

## Prompts

| Prompt | Description | Default |
|--------|-------------|---------|
| Plugin type | Select plugin type | `tool-plugin` |
| Project name | npm package name | interactive |
| Display name | Human-readable name | package name |
| Description | Short description of your plugin | `An OpenClaw plugin` |

---

## Templates

| Template | Status |
|----------|--------|
| `tool-plugin` | ✅ Available |
| `channel-plugin` | ✅ Available |
| `mcp-server` | ✅ Available |
| `provider-plugin` | 🚧 Coming soon |

---

## What You Get

### Tool Plugin

Register a tool callable by AI.

```
my-plugin/
├── src/
│   └── index.ts          # Plugin entry point (register tools)
├── openclaw.plugin.json  # Plugin manifest
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
└── README.md             # Plugin docs
```

### Channel Plugin

Connect a messaging platform (Discord, Telegram, WeChat, etc.).

```
my-channel/
├── src/
│   └── index.ts          # Channel plugin entry point
├── openclaw.plugin.json  # Plugin manifest
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
└── README.md             # Plugin docs
```

### MCP Server

Create a standalone MCP protocol service.

```
my-server/
├── src/
│   └── index.ts          # MCP server entry point (stdio transport)
├── openclaw.plugin.json  # Plugin manifest
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
└── README.md             # Server docs
```

---

## After Scaffolding

```bash
cd my-plugin
npm install        # Install dependencies (auto-done unless --no-install)
npm run build      # Build your plugin
```

Then depending on your plugin type:

- **Tool plugin** — register with OpenClaw:

  ```bash
  openclaw plugins install ./my-plugin
  ```

- **Channel plugin** — register the channel:

  ```bash
  openclaw plugins install ./my-channel
  # Then configure the channel via openclaw config
  ```

- **MCP server** — start the server on stdio:

  ```bash
  cd my-server
  npm start
  ```

  Then connect any MCP client (Claude Desktop, VS Code, etc.) by pointing it to the server entry point.

---

## Requirements

- Node.js 22+
- npm / pnpm / yarn

---

## License

MIT
