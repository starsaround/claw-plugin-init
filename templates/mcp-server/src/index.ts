import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
};

const tools = [
  {
    name: "{{toolName}}",
    description: "{{toolDescription}}",
    inputSchema: {
      type: "object",
      properties: {
        input: {
          type: "string",
          description: "Input to process",
        },
      },
      required: ["input"],
    } as const,
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const { input } = args as { input: string };
      return {
        content: [{ type: "text" as const, text: `Received: ${input}` }],
      };
    },
  },
];

async function main() {
  const server = new Server(
    { name: "{{pluginId}}", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = tools.find((t) => t.name === request.params.name);
    if (!tool) {
      return {
        content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
        isError: true,
      };
    }
    try {
      return await tool.execute(request.params.arguments ?? {});
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${String(error)}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
