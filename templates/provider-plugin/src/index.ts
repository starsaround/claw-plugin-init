import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import type { OpenClawPluginDefinition } from "openclaw/plugin-sdk/plugin-entry";

const pluginEntry: OpenClawPluginDefinition = defineSingleProviderPluginEntry({
  id: "{{pluginId}}",
  name: "{{pluginName}}",
  description: "{{pluginDescription}}",
  provider: {
    label: "{{pluginName}}",
    docsPath: "/providers/{{pluginId}}",
    envVars: ["{{providerEnvVar}}"],
    auth: [
      {
        methodId: "api-key",
        optionKey: "apiKey",
        flagName: "--api-key",
        envVar: "{{providerEnvVar}}",
        promptMessage: "Enter your {{pluginName}} API key",
        label: "API Key",
        hint: "Paste your API key from the provider dashboard",
        defaultModel: "{{pluginId}}/example-model-v1",
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
            reasoning: false,
            input: ["text"],
            cost: {
              input: 0,
              output: 0,
              cacheRead: 0,
              cacheWrite: 0,
            },
            contextWindow: 128000,
            maxTokens: 4096,
          },
        ],
      }),
      allowExplicitBaseUrl: true,
    },
  },
});

export default pluginEntry;
