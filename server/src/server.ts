import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import * as z from "zod/v4";

dotenv.config();

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";
const PORT = parseInt(process.env.PORT || "3000", 10);
const DEFAULT_SEARCH_QUERY = "Taiwan grandparents children community center";
const PEXELS_API_BASE_URL = "https://api.pexels.com/v1/search";

if (!PEXELS_API_KEY) {
  console.warn(
    "[warning] PEXELS_API_KEY is not set. Image search and MCP tools will fail until you configure it in .env."
  );
}

// Pexels API 回應型別定義
type PexelsPhoto = {
  id: number;
  photographer: string;
  photographer_url?: string;
  alt?: string;
  src?: {
    original?: string;
    large2x?: string;
    large?: string;
    medium?: string;
    small?: string;
  };
};

type PexelsResponse = {
  photos?: PexelsPhoto[];
  total_results?: number;
  page?: number;
  per_page?: number;
};

// 圖片結果型別
export type ImageResult = {
  id: number;
  url: string;
  alt?: string;
  photographer: string;
  photographer_url?: string;
  source: "pexels";
};

export async function searchPexelsImages(query: string, perPage = 6): Promise<ImageResult[]> {
  if (!PEXELS_API_KEY) {
    throw new Error("PEXELS_API_KEY is missing. Please set it in server/.env.");
  }

  const safeQuery = query.trim() || DEFAULT_SEARCH_QUERY;
  const url = new URL(PEXELS_API_BASE_URL);
  url.searchParams.set("query", safeQuery);
  url.searchParams.set("per_page", perPage.toString());

  const resp = await fetch(url.toString(), {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Pexels API error: ${resp.status} - ${text}`);
  }

  const data = (await resp.json()) as PexelsResponse;

  const photos = Array.isArray(data.photos) ? data.photos : [];
  return photos.map((p: PexelsPhoto) => {
    const src = p.src || {};
    const url: string =
      src.medium || src.large2x || src.large || src.small || src.original || "";
    return {
      id: p.id,
      url,
      alt: p.alt || "",
      photographer: p.photographer || "",
      photographer_url: p.photographer_url || "",
      source: "pexels" as const,
    };
  });
}

// ---------------- MCP server ----------------

const mcpServer = new McpServer({
  name: "hsinchu-image-server",
  version: "0.1.0",
});

// Tool: search_images
const SearchImagesInput = z.object({
  query: z.string().describe("Search keywords in any language. Prefer Chinese plus 'Taiwan / Hsinchu'."),
  perPage: z
    .number()
    .int()
    .min(1)
    .max(12)
    .optional()
    .describe("Number of images to return (1–12). Defaults to 6."),
});

const SearchImagesOutput = z.object({
  images: z.array(
    z.object({
      id: z.number(),
      url: z.string(),
      alt: z.string().optional(),
      photographer: z.string(),
      photographer_url: z.string().optional(),
      source: z.literal("pexels"),
    })
  ),
});

mcpServer.registerTool(
  "search_images",
  {
    title: "Search intergenerational care images",
    description:
      "Searches Pexels for photos that fit intergenerational care / grandparents and children / community center scenes. Use this to suggest imagery for the Hsinchu 赤土崎館 demo.",
    inputSchema: SearchImagesInput,
    outputSchema: SearchImagesOutput,
  },
  async ({ query, perPage }) => {
    const images = await searchPexelsImages(query, perPage ?? 6);
    const output = { images };
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(output, null, 2),
        },
      ],
      structuredContent: output,
    };
  }
);

// ---------------- Express app ----------------

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Simple HTTP endpoint for the frontend
  app.get("/api/images", async (req, res) => {
    try {
      const q = typeof req.query.q === "string" ? req.query.q : "";
      const images = await searchPexelsImages(q || DEFAULT_SEARCH_QUERY);
      res.json({ images });
    } catch (err: any) {
      console.error("[/api/images] error:", err);
      res.status(500).json({
        error: "Image search failed",
        detail: String(err?.message || err)
      });
    }
  });

  // MCP over HTTP endpoint
  app.post("/mcp", async (req, res) => {
    try {
      const transport = new StreamableHTTPServerTransport({
        enableJsonResponse: true,
      });

      res.on("close", () => {
        transport.close();
      });

      await mcpServer.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (err: any) {
      console.error("[/mcp] error:", err);
      res.status(500).json({
        error: "MCP request failed",
        detail: String(err?.message || err)
      });
    }
  });

  return app;
}

// 只有在直接執行時才啟動伺服器
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(
      `[server] listening on http://localhost:${PORT} (HTTP API + MCP /mcp endpoint)`
    );
  });
}
