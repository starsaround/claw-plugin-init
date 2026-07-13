# {{pluginName}}

{{pluginDescription}}

A model provider plugin for OpenClaw.

## Installation

```bash
openclaw plugins install clawhub:{{pluginId}}
```

Or install from a local build:

```bash
npm run build
openclaw plugins install ./dist
```

## Configuration

Set your API key:

```bash
export {{providerEnvVar}}=your-api-key
```

Or configure via OpenClaw:

```bash
openclaw config set providers.{{pluginId}}.apiKey your-api-key
```

Update `src/index.ts` with the provider API base URL, protocol adapter, and model catalog before publishing.

## Development

```bash
npm run dev      # Watch mode (auto-compile on changes)
npm run lint     # Type-check without emitting files
npm run build    # Compile TypeScript
```

## License

MIT
