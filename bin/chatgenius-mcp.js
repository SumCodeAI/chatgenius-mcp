#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from '../src/server.js';

const apiKey = process.env.CHATGENIUS_API_KEY;
if (!apiKey) {
  process.stderr.write('chatgenius-mcp: set CHATGENIUS_API_KEY (create a key in the portal under Webhook + Send API, Credentials).\n');
  process.exit(1);
}
const scope = process.env.CHATGENIUS_MAX_SCOPE;
if (scope && !['read', 'write', 'admin'].includes(scope)) {
  process.stderr.write('chatgenius-mcp: CHATGENIUS_MAX_SCOPE must be read, write or admin.\n');
  process.exit(1);
}

const server = createServer({ apiKey, baseUrl: process.env.CHATGENIUS_API_URL, scope });
await server.connect(new StdioServerTransport());
