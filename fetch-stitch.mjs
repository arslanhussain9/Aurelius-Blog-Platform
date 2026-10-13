/**
 * Google Stitch MCP Fetcher Tool
 * Fetches the project screens, HTML code, and images directly from Google Stitch MCP.
 * Usage:
 *   node fetch-stitch.mjs <GOOGLE_ACCESS_TOKEN_OR_API_KEY>
 * Or:
 *   set STITCH_ACCESS_TOKEN=ya29...
 *   node fetch-stitch.mjs
 */

import fs from 'fs';
import path from 'path';

const PROJECT_ID = "3907361547178343444";
const SCREEN_ID = "202f54c330664e909b5dbe1e6a9722e3";
const MCP_ENDPOINT = "https://stitch.googleapis.com/mcp";

const token = process.argv[2] || process.env.STITCH_ACCESS_TOKEN || process.env.GOOGLE_ACCESS_TOKEN;

async function run() {
  if (!token) {
    console.log("==================================================================");
    console.log(" Stitch MCP Screen Fetcher");
    console.log("==================================================================");
    console.log("Missing authentication credential.");
    console.log("\nTo fetch your Stitch screens:");
    console.log("1. Get your Google OAuth access token using Google Cloud CLI:");
    console.log("     gcloud auth print-access-token");
    console.log("\n2. Run this fetcher with that token:");
    console.log("     node fetch-stitch.mjs <YOUR_TOKEN>");
    console.log("==================================================================");
    process.exit(1);
  }

  console.log(`Connecting to Stitch MCP at ${MCP_ENDPOINT}...`);
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  try {
    // 1. Initialize
    console.log("Initializing session...");
    const initRes = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "auralis-mcp-client", version: "1.0.0" }
        }
      })
    });
    const initData = await initRes.json();
    console.log("Initialize result:", initData.result ? "Success" : initData);

    // 2. Call get_screen
    const screenName = `projects/${PROJECT_ID}/screens/${SCREEN_ID}`;
    console.log(`Calling get_screen for ${screenName}...`);
    const screenRes = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
          name: "get_screen",
          arguments: { name: screenName }
        }
      })
    });
    const screenData = await screenRes.json();
    
    if (screenData.error || screenData.result?.isError) {
      console.error("Error fetching screen:", screenData.error || screenData.result);
      process.exit(1);
    }

    const outDir = path.join(process.cwd(), "stitch_export");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(path.join(outDir, "screen_data.json"), JSON.stringify(screenData, null, 2));
    console.log(`\nSuccessfully downloaded screen details to: ./stitch_export/screen_data.json`);

    // Check if HTML code exists
    const toolResult = screenData.result;
    console.log("\nScreen Payload:", JSON.stringify(toolResult, null, 2).slice(0, 500) + "...");
  } catch (err) {
    console.error("Request failed:", err.message);
  }
}

run();
