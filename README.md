# claw-plugin-init <a href="https://npmjs.com/package/claw-plugin-init"><img src="https://img.shields.io/npm/v/claw-plugin-init" alt="npm package"></a>

Scaffold [OpenClaw](https://openclaw.ai) plugin projects with one command.

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
| `provider-plugin` | ✅ Available |
| `mcp-server` | ✅ Available |

---

## What You Get

### Tool Plugin

Register a tool callable by AI.

```text
my-plugin/
├── src/
│   └── index.ts          # Plugin entry point (register tools)
├── openclaw.plugin.json  # Plugin manifest
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
└── README.md             # Plugin docs
```

### Channel Plugin

Connect a messaging platform such as Discord, Telegram, or WeChat.

```text
my-channel/
├── src/
│   └── index.ts          # Channel plugin entry point
├── openclaw.plugin.json  # Plugin manifest
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
└── README.md             # Plugin docs
```

### Provider Plugin

Integrate a model provider with API-key authentication and a starter model catalog.

```text
my-provider/
├── src/
│   └── index.ts          # Provider definition and model catalog
├── openclaw.plugin.json  # Provider setup and auth manifest
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
└── README.md             # Provider configuration guide
```

The generated environment variable is portable across shells. For a project named `my-provider`, it is:

```bash
export MY_PROVIDER_API_KEY=your-api-key
```

Before publishing, update the generated `baseUrl`, protocol adapter, and model catalog in `src/index.ts`.

### MCP Server

Create a standalone MCP protocol service.

```text
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
npm install        # Installed automatically unless --no-install is used
npm run lint       # Type-check the generated project
npm run build      # Build the generated project
```

Then depending on your plugin type:

- **Tool plugin** — register or publish it:

  ```bash
  openclaw plugins install ./dist
  # or
  clawhub package publish
  ```

- **Channel plugin** — register the channel:

  ```bash
  openclaw plugins install ./dist
  # Then configure the channel via openclaw config
  ```

- **Provider plugin** — configure credentials and register it:

  ```bash
  export MY_PROVIDER_API_KEY=your-api-key
  openclaw plugins install ./dist
  ```

- **MCP server** — start the server on stdio:

  ```bash
  npm start
  ```

  Then connect an MCP client by pointing it to the generated server entry point.

---

## Compatibility

- Node.js 22+
- npm, pnpm, or yarn
- The scaffold targets the current OpenClaw and plugin SDK versions available from npm.
- When registry lookup is unavailable, a tested fallback version is used.
- If an older local OpenClaw CLI is detected, the command prints an upgrade warning.

---

## License

MIT
