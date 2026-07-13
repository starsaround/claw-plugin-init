import {
  defineChannelPluginEntry,
  type ChannelPlugin,
} from "openclaw/plugin-sdk/channel-core";

type ChannelAccount = {
  accountId: string;
  enabled: boolean;
  configured: boolean;
};

const DEFAULT_ACCOUNT_ID = "default";

const channelPlugin: ChannelPlugin<ChannelAccount> = {
  id: "{{pluginId}}",
  meta: {
    id: "{{pluginId}}",
    label: "{{pluginName}}",
    selectionLabel: "{{pluginName}}",
    docsPath: "/channels/{{pluginId}}",
    blurb: "{{pluginDescription}}",
  },
  capabilities: {
    chatTypes: ["direct"],
  },
  config: {
    listAccountIds: () => [DEFAULT_ACCOUNT_ID],
    defaultAccountId: () => DEFAULT_ACCOUNT_ID,
    resolveAccount: (_cfg, accountId) => ({
      accountId: accountId ?? DEFAULT_ACCOUNT_ID,
      enabled: true,
      configured: true,
    }),
    isEnabled: (account) => account.enabled,
    isConfigured: (account) => account.configured,
  },
};

export default defineChannelPluginEntry({
  id: "{{pluginId}}",
  name: "{{pluginName}}",
  description: "{{pluginDescription}}",
  plugin: channelPlugin,
});
