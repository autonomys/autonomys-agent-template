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
│   ├── index.ts          # Main agent implementation
│   └── tools/            # Agent tools
│       └── example/      # Example tool implementations
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
   # Specify a workspace path
   yarn start your_character_name --workspace=/path/to/workspace
   
   # Run in headless mode (no API server)
   yarn start your_character_name --workspace=/path/to/workspace --headless
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
   yarn start alice --workspace=/path/to/workspace
   
   # Terminal 2
   yarn start bob --workspace=/path/to/workspace
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

The template includes example tools in the `src/tools/example` directory that demonstrate how to create custom functionality for your agent.

Custom tools are built using the `DynamicStructuredTool` class from LangChain, which provides:

- **Type-safe inputs**: Define your tool's parameters using Zod schemas
- **Self-documenting**: Tools describe themselves to the LLM for appropriate use
- **Structured outputs**: Return consistent data structures from your tools

The example tools serve as templates that can be adapted for various use cases:
- External API integrations
- Data processing and analysis
- User interaction mechanisms
- Service integrations

To create your own tools:
1. Define a function that returns a `DynamicStructuredTool` instance
2. Specify the tool's name, description, and parameter schema
3. Implement the functionality in the `func` property
4. Import and register your tools in `index.ts` under the appropriate agent
5. Install dependencies with `yarn add <necessary-packages>`

This pattern allows you to extend your agent with any custom functionality while maintaining a clean, typed interface that the LLM can understand and use appropriately.

## License

See the [LICENSE](LICENSE) file for details.