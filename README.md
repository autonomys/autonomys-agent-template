# Autonomys Agent Template

This template repository provides a foundation for building AI agents using the `@autonomys/agent-core` package.

## Features

- **Pre-configured Agent Structure**: Ready-to-use template for autonomous agents
- **Twitter Integration**: Connect your agent to Twitter for social interactions
- **API Server**: Built-in HTTP/2 server for agent communication
- **Experience Management**: Optional integration with AutoDrive for experience tracking
- **Character Configuration**: Easily create and manage multiple agent personalities

## Prerequisites

- Node.js 20.18.1 or later
- [OpenSSL](https://www.openssl.org/) (for certificate generation)
- LLM Provider API Keys (Anthropic, OpenAI, etc.)
- [AutoDrive API Key](https://ai3.storage) (optional, for experience management)

## Project Structure

```
autonomys-agent-template/
├── src/                  # Source code
│   ├── agent.ts          # Agent assembly and tool registration
│   ├── index.ts          # Main entrypoint (starts the agent)
│   ├── tools.ts          # Define custom tool creators (e.g. agents)
│   └── tools/            # Agent tools
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
├── README.md             # This documentation
├── scripts/              # Utility scripts
│   ├── create-character.ts  # Character creation script
│   └── generate-certs.ts    # Certificate generation script
├── certs/                # SSL certificates
└── characters/           # Character configurations
    └── character.example/
        └── config/
            ├── .env.example           # Environment variables template
            ├── config.example.yaml    # Agent configuration template
            └── character.example.yaml # Character personality template
```

## Getting Started

1. Install dependencies:

   ```bash
   yarn install
   ```

   - Windows users will need to install Visual Studio C++ Redistributable. They can be found here: https://aka.ms/vs/17/release/vc_redist.x64.exe

2. Create a character configuration:

   ```bash
   yarn create-character your_character_name
   ```

   This will create a new character with the necessary configuration files based on the example template.

3. Configure your character:

   - Edit `characters/your_character_name/config/.env` with your API keys and credentials
   - Customize `characters/your_character_name/config/config.yaml` for agent behavior
   - Define personality in `characters/your_character_name/config/your_character_name.yaml`

4. Generate SSL certificates (required for API server):

   ```bash
   yarn generate-certs
   ```

5. Run the agent:

   ```bash
      cd <to/agent/project>
      yarn start <your_character_name>
   ```

   If you have stored workspace files (`characters`, `certs`, and `.cookies` directories) in a custom location, use the `--workspace` argument with the absolute path to your desired directory:

   ```bash
   # Specify a workspace path
   yarn start your_character_name --workspace=/path/to/workspace

   # Run in headless mode (no API server)
   yarn start your_character_name --headless
   ```

## Running Multiple Characters

You can run multiple characters simultaneously, each with their own configuration and personality:

1. Create multiple character configurations:

   ```bash
   yarn create-character alice
   yarn create-character bob
   ```

2. Configure each character separately with different personalities and API settings.

3. Run each character in a separate terminal session:

   ```bash
   # Terminal 1
   yarn start alice

   # Terminal 2
   yarn start bob
   ```

4. Each character will:
   - Have its own isolated memory and experience
   - Run its own API server on the specified port
   - Execute tasks according to its unique schedule and personality

## Extending the Agent

You can extend this template by:

1. Adding custom tools
2. Integrating with other services (Slack, GitHub, etc.)

### Custom Tools

Custom tools are built using the `DynamicStructuredTool` class from LangChain, which provides:

- **Type-safe inputs**: Define your tool's parameters using Zod schemas
- **Self-documenting**: Tools describe themselves to the LLM for appropriate use
- **Structured outputs**: Return consistent data structures from your tools

To create your own tools:

1. Define a function that returns a `DynamicStructuredTool` instance
2. Specify the tool's name, description, and parameter schema
3. Implement the functionality in the `func` property
4. Import and register your tools in `agent.ts`
5. Install dependencies with `yarn add <necessary-packages>`

### Example Tool Implementation

Here's a complete example of how to create a custom tool:

```typescript
import { createLogger } from '@autonomys/agent-core';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

// Create a logger for your tool
const logger = createLogger('custom-tool');

/**
 * Creates a custom tool for your agent
 * @param config - Configuration options for your tool
 * @returns A DynamicStructuredTool instance
 */
export const createCustomTool = (config: any) => {
  new DynamicStructuredTool({
    name: 'custom_tool_name',
    description: `
    Description of what your tool does.
    USE THIS WHEN:
    - Specify when the agent should use this tool
    - Add clear usage guidelines
    OUTPUT: Describe what the tool returns
    `,
    schema: z.object({
      // Define your input parameters using Zod
      parameter1: z.string().describe('Description of parameter1'),
      parameter2: z.number().describe('Description of parameter2'),
      parameter3: z.boolean().optional().describe('Optional parameter'),

      // For enum parameters:
      parameter4: z
        .enum(['option1', 'option2', 'option3'])
        .default('option1')
        .describe('Parameter with predefined options'),
    }),
    func: async ({ parameter1, parameter2, parameter3, parameter4 }) => {
      try {
        // Log the function call
        logger.info('Custom tool called with parameters', {
          parameter1,
          parameter2,
          parameter3,
          parameter4,
        });

        // Implement your tool logic here
        // ...

        // Return a structured response
        return {
          success: true,
          result: {
            message: 'Operation completed successfully',
            data: {
              // Your output data
            },
          },
        };
      } catch (error) {
        // Log and handle errors
        logger.error('Error in custom tool:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  });
};
```

## Using MCP Tools

Model Context Protocol (MCP) tools provide a standardized way to integrate external services with your agent. MCP tools use a client-server architecture to communicate with external services through a standardized protocol. Here's an example of how to create MCP tools for notion:

```typescript
import { createMcpClientTool } from '@autonomys/agent-core';
import { StdioServerParameters } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StructuredToolInterface } from '@langchain/core/tools';

export const createNotionTools = async (
  integrationSecret: string,
): Promise<StructuredToolInterface[]> => {
  const notionServerParams: StdioServerParameters = {
    command: process.execPath,
    args: ['node_modules/.bin/notion-mcp-server'],
    env: {
      OPENAPI_MCP_HEADERS: `{\"Authorization\": \"Bearer ${integrationSecret}\", \"Notion-Version\": \"2022-06-28\" }`,
    },
  };
  const tools = await createMcpClientTool('notion-mcp', '0.0.1', notionServerParams);
  return tools;
};
```

**Key components of an MCP tool:**

1. **Imports**:

   - `createMcpClientTool`: Factory function that handles client setup and tool loading
   - `StdioServerParameters`: Configuration for the server process
   - `StructuredToolInterface`: LangChain-compatible tool interface

2. **Server Parameters**:

   - `command`: Path to Node.js executable (process.execPath)
   - `args`: Path to the MCP server executable
   - `env`: Environment variables for authentication and configuration

3. **Tool Creation Process**:

   - Sets up a transport layer for client-server communication
   - Initializes an MCP client with name and version
   - Connects the client to the transport
   - Loads available tools from the server

4. **Integration**:
   - Add credential in `characters/your_character_folder/config/.env`
   ```typescript
   // In your agent configuration
   const notionTools = await createNotionTools(process.env.NOTION_API_KEY);
   const agent = new Agent({
     tools: [...notionTools, ...otherTools],
     // other configuration
   });
   ```

MCP tools, through the standardized protocol and client libraries, facilitate:

- **Standardized Communication:** Defining clear formats for requests and responses between the agent (client) and the tool provider (server).
- **Tool Discovery:** Allowing the agent to automatically discover the capabilities (tools) offered by a connected server.
- **Simplified Integration:** Providing a consistent way to connect various tools and services.
- **Authentication Handling:** Facilitating the secure passing of credentials (e.g., API keys via environment variables) to the tool server, which then handles the actual authentication with the end service.

### Installing Tools with agent-os CLI

You can easily install pre-built tools from the Autonomys registry using the agent-os CLI:

1. Install the agent-os CLI:

   ```bash
   # Using npm (recommended)
   npm install -g @autonomys/agent-os

   # Using Yarn 2.x
   yarn dlx @autonomys/agent-os
   ```

2. Search for available tools (`WIP`):

   ```bash
   # If installed globally
   agent-os search <search-term>
   ```

3. Install a tool:

   - Go to your agent directory

   ```bash
   agent-os install <tool-name>

   # Install specific version
   agent-os install <tool-name> -v <version>
   ```

4. After installation, the tool will be available in your project's `src/tools` directory. Import and register it in your agent:

   ```typescript
   import { createTool } from './tools/<tool-name>';

   // Add it to your agent's tools
   const agent = new Agent({
     tools: [createTool(), ...otherTools],
     // other agent configuration
   });
   ```

Note: Some tools may require additional configuration or API keys. Check the tool's documentation for specific setup instructions.

## License

See the [LICENSE](LICENSE) file for details.
