import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";

export default defineSingleProviderPluginEntry({
  id: "{{pluginId}}",
  name: "{{pluginName}}",
  description: "{{pluginDescription}}",
  provider: {
    label: "{{pluginName}}",
    docsPath: "/docs/providers/{{pluginId}}",
    envVars: ["{{pluginId}}_API_KEY"],
    auth: [
      {
        optionKey: "apiKey",
        flagName: "--api-key",
        envVar: "{{pluginId}}_API_KEY",
        promptMessage: "Enter your {{pluginName}} API key",
        label: "API Key",
        hint: "Paste your API key from the provider dashboard",
      },
    ],
    catalog: {
      buildProvider: () => ({
        baseUrl: "https://api.example.com/v1",
        api: "openai-completions",
        models: [
          {
            id: "example-model-v1",
            name: "Example Model V1",
            contextWindow: 128000,
            maxTokens: 4096,
            input: ["text"],
          },
        ],
      }),
      allowExplicitBaseUrl: true,
    },
  },
});
