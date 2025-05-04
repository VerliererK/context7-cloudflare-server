# Context7 MCP Agent for Cloudflare Workers

[![Deploy to Cloudflare Workers](https://img.shields.io/badge/Deploy%20to-Cloudflare%20Workers-orange?logo=cloudflare)](https://developers.cloudflare.com/workers/)

This project deploys [@upstash/context7-mcp](https://github.com/upstash/context7) as a Model Context Protocol (MCP) agent on Cloudflare Workers.

## Overview

Context7 is a platform that allows developers to create and query up-to-date documentation for any library. This MCP agent acts as a bridge, enabling AI models to interact with Context7 through a standardized MCP interface.

This agent implements the MCP tools provided by `@upstash/context7-mcp`. For detailed information about available tools (such as `resolve-library-id` and `get-library-docs`), please refer to the [Upstash Context7 MCP repository](https://github.com/upstash/context7).

The agent is deployed on Cloudflare Workers and uses Durable Objects to handle state and MCP sessions.

## Getting Started

### Installation

1. Clone this repository:
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

### Local Development

Run the Worker locally using Wrangler:

```bash
npm run dev
```

### Deploy to Cloudflare

1. Edit `wrangler.jsonc` to ensure the `name`, `main`, `durable_objects`, and other configurations are correct.
2. Deploy with:
    ```bash
    npm run deploy
    ```
3. After deployment, Cloudflare will display your Worker URL.
4. Set this URL in your MCP client to communicate with your agent:
    ```json
    "context7-cloudflare-server": {
        "type": "sse",
        "url": "https://<your-worker-name>.<your-account-id>.workers.dev/sse"
    }
    ```

## References

- [Build a Remote MCP server](https://developers.cloudflare.com/agents/guides/remote-mcp-server/)
- [Upstash Context7 MCP](https://github.com/upstash/context7-mcp)
