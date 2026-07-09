import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default definePluginEntry({
  id: "{{pluginId}}",
  name: "{{pluginName}}",
  description: "{{pluginDescription}}",
  register(api) {
    api.registerChannel({
      id: "{{pluginId}}",
      meta: {
        id: "{{pluginId}}",
        label: "{{pluginName}}",
        selectionLabel: "{{pluginName}}",
        docsPath: "docs/{{pluginId}}",
        blurb: "{{pluginDescription}}",
      },
      capabilities: {
        chatTypes: ["direct"],
      },
      config: {
        listAccountIds: () => [],
        resolveAccount: () => ({}),
        defaultAccountId: () => "default",
        isEnabled: () => true,
        isConfigured: () => true,
      },
    });
  },
});
