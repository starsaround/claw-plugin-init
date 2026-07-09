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

### Scaffold in current directory

```bash
npx claw-plugin-init . --force
```

---

## CLI Options

| Flag | Description |
|------|-------------|
| `--type`, `-t` | Plugin type: `tool-plugin` (default), `channel-plugin`, `provider-plugin`, `mcp-server` |
| `--force`, `-f` | Overwrite existing directory |
| `--no-install` | Skip dependency installation |
| `--help`, `-h` | Show help |

---

## Prompts

| Prompt | Description | Default |
|--------|-------------|---------|
| Plugin type | Select plugin type | `tool-plugin` |
| Project name | npm package name | interactive |
| Display name | Human-readable name | package name |
| Description | Short description of your plugin | (empty) |

---

## Templates

| Template | Status |
|----------|--------|
| `tool-plugin` | ✅ Available |
| `channel-plugin` | 🚧 Coming soon |
| `provider-plugin` | 🚧 Coming soon |
| `mcp-server` | ✅ Available |

---

## What You Get

### Tool Plugin

```
my-plugin/
├── src/
│   └── index.ts          # Plugin entry point (register tools)
├── openclaw.plugin.json  # Plugin manifest
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
└── README.md             # Plugin docs
```

### MCP Server

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

For a **tool plugin**, register it with OpenClaw:

```bash
openclaw plugins install ./my-plugin
```

For an **MCP server**, start the server on stdio:

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
