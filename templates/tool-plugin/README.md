# {{pluginName}}

{{pluginDescription}}

## Installation

```bash
openclaw plugins install clawhub:{{pluginId}}
```

Or install from a local build:

```bash
openclaw plugins install ./dist
```

## Usage

After installation, tell the assistant:

> "Use the {{toolName}} tool..."

## Development

```bash
npm run dev      # Watch mode (auto-compile on changes)
npm run build    # Compile TypeScript
```

## Publish

```bash
clawhub package publish your-org/{{packageName}}
```

## License

MIT
