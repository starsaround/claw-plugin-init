import { Type } from "typebox";
import {
  definePluginEntry,
  type OpenClawPluginDefinition,
} from "openclaw/plugin-sdk/plugin-entry";

const plugin: OpenClawPluginDefinition = definePluginEntry({
  id: "{{pluginId}}",
  name: "{{pluginName}}",
  description: "{{pluginDescription}}",
  register(api) {
    api.registerTool({
      name: "{{toolName}}",
      label: "{{pluginName}}",
      description: "{{toolDescription}}",
      parameters: Type.Object({
        input: Type.String({
          description: "Input to process",
        }),
      }),
      async execute(
        _toolCallId,
        params,
        _signal,
        _onUpdate,
      ) {
        // TODO: Implement your business logic here
        const { input } = params as { input: string };
        return {
          content: [{ type: "text" as const, text: `Received: ${input}` }],
          details: {},
        };
      },
    });
  },
});

export default plugin;
