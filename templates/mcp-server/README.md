# {{pluginName}}

{{pluginDescription}}

An MCP (Model Context Protocol) server that exposes tools for use by MCP-compatible clients.

## Usage

### Start the server

```bash
npm start
```

The server starts on stdio, which is the standard transport for MCP.

### Integration with MCP clients

Add to your MCP client configuration (e.g., Claude Desktop, VS Code extensions):

```json
{
  "mcpServers": {
    "{{pluginId}}": {
      "command": "node",
      "args": ["path/to/{{packageName}}/dist/index.js"]
    }
  }
}
```

### Development

```bash
npm run dev      # Watch mode (auto-compile on changes)
npm run build    # Compile TypeScript
```

## License

MIT
