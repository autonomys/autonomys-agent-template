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
├── agent.ts              # Main agent implementation
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
├── README.md             # This documentation
├── scripts/              # Utility scripts
├── certs/                # SSL certificates
└── characters/           # Character configurations
    └── character.example/
        └── config/
            ├── .env.example          # Environment variables template
            ├── config.example.yaml   # Agent configuration template
            └── character.example.yaml  # Character personality template
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

1. Adding custom tools in separate files
2. Integrating with other services (Slack, GitHub, etc.)


## License

See the [LICENSE](LICENSE) file for details.