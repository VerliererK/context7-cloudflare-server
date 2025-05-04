import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchLibraries, fetchLibraryDocumentation } from "@upstash/context7-mcp/dist/lib/api.js";
import { formatSearchResults } from "@upstash/context7-mcp/dist/lib/utils.js";
const DEFAULT_MINIMUM_TOKENS = 5000;

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "Context7",
    description: "Retrieves up-to-date documentation and code examples for any library.",
    version: "1.0.6",
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  async init() {
    // Register Context7 tools
    this.server.tool("resolve-library-id", "Required first step: Resolves a general package name into a Context7-compatible library ID. Must be called before using 'get-library-docs' to retrieve a valid Context7-compatible library ID.", {
      libraryName: z
        .string()
        .describe("Library name to search for and retrieve a Context7-compatible library ID."),
    }, async ({ libraryName }) => {
      const searchResponse = await searchLibraries(libraryName);
      if (!searchResponse || !searchResponse.results) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve library documentation data from Context7",
            },
          ],
        };
      }
      if (searchResponse.results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No documentation libraries available",
            },
          ],
        };
      }
      const resultsText = formatSearchResults(searchResponse);
      return {
        content: [
          {
            type: "text",
            text: "Available libraries and their Context7-compatible library IDs:\n\n" + resultsText,
          },
        ],
      };
    });
    this.server.tool("get-library-docs", "Fetches up-to-date documentation for a library. You must call 'resolve-library-id' first to obtain the exact Context7-compatible library ID required to use this tool.", {
      context7CompatibleLibraryID: z
        .string()
        .describe("Exact Context7-compatible library ID (e.g., 'mongodb/docs', 'vercel/nextjs') retrieved from 'resolve-library-id'."),
      topic: z
        .string()
        .optional()
        .describe("Topic to focus documentation on (e.g., 'hooks', 'routing')."),
      tokens: z
        .preprocess((val) => (typeof val === "string" ? Number(val) : val), z.number())
        .transform((val) => (val < DEFAULT_MINIMUM_TOKENS ? DEFAULT_MINIMUM_TOKENS : val))
        .optional()
        .describe(`Maximum number of tokens of documentation to retrieve (default: ${DEFAULT_MINIMUM_TOKENS}). Higher values provide more context but consume more tokens.`),
    }, async ({ context7CompatibleLibraryID, tokens = DEFAULT_MINIMUM_TOKENS, topic = "" }) => {
      // Extract folders parameter if present in the ID
      let folders = "";
      let libraryId = context7CompatibleLibraryID;
      if (context7CompatibleLibraryID.includes("?folders=")) {
        const [id, foldersParam] = context7CompatibleLibraryID.split("?folders=");
        libraryId = id;
        folders = foldersParam;
      }
      const documentationText = await fetchLibraryDocumentation(libraryId, {
        tokens,
        topic,
        folders,
      });
      if (!documentationText) {
        return {
          content: [
            {
              type: "text",
              text: "Documentation not found or not finalized for this library. This might have happened because you used an invalid Context7-compatible library ID. To get a valid Context7-compatible library ID, use the 'resolve-library-id' with the package name you wish to retrieve documentation for.",
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: documentationText,
          },
        ],
      };
    });
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      // @ts-ignore
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      // @ts-ignore
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
