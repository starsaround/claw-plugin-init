export type PluginType = 'tool-plugin' | 'channel-plugin' | 'provider-plugin' | 'mcp-server';

export type PluginTypeConfig = {
  value: PluginType;
  label: string;
  hint: string;
  /** Whether the template directory exists and is ready to use */
  available: boolean;
};

export const PLUGIN_TYPES: PluginTypeConfig[] = [
  {
    value: 'tool-plugin',
    label: 'Tool Plugin',
    hint: 'Register a tool callable by AI',
    available: true,
  },
  {
    value: 'channel-plugin',
    label: 'Channel Plugin',
    hint: 'Connect a messaging platform (WeChat, Discord, etc.)',
    available: true,
  },
  {
    value: 'provider-plugin',
    label: 'Provider Plugin',
    hint: 'Integrate a new model provider',
    available: false,
  },
  {
    value: 'mcp-server',
    label: 'MCP Server',
    hint: 'Create a standalone MCP protocol service',
    available: true,
  },
];

export function getValidPluginTypes(): PluginTypeConfig[] {
  return PLUGIN_TYPES.filter((t) => t.available);
}
