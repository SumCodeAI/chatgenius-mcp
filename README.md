# chatgenius-mcp

An MCP server for [ChatGenius](https://sumgenius.ai). Add it to Claude Desktop, Claude Code, Cursor, Zed, Gemini CLI or any client that speaks the Model Context Protocol, and your assistant can read and act on your Instagram, Facebook, WhatsApp and SMS inbox, contacts, appointments, flows, comment automation, Content Studio posts and knowledge base.

It is a thin wrapper over the [ChatGenius REST API](https://sumgenius.ai/docs/rest-api). Every tool is one API call. Nothing is stored, nothing runs on our side, and your API key never leaves your machine.

Prefer not to run anything? The same tools are hosted at `https://sumgenius.ai/api/mcp` with a Connect button (OAuth): paste that URL into claude.ai, ChatGPT, Cursor or any client that takes a remote MCP server. Docs: https://sumgenius.ai/docs/mcp

## Install

You need Node 18 or newer and a ChatGenius API key. Create the key in the portal under **Webhook + Send API, Credentials** (the Webhook & API add-on is required).

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "chatgenius": {
      "command": "npx",
      "args": ["-y", "chatgenius-mcp"],
      "env": { "CHATGENIUS_API_KEY": "sgwh_..." }
    }
  }
}
```

**Claude Code** (plugin, prompts for the key):

```
claude plugin marketplace add SumCodeAI/chatgenius-claude-plugin
claude plugin install chatgenius@sumgenius
```

**Cursor**, **Zed**, **Windsurf** and the rest take the same command, args and env in their own MCP settings.

## Environment

| Variable | Required | Meaning |
|---|---|---|
| `CHATGENIUS_API_KEY` | yes | Your API key. Its scope (`read`, `write`, `admin`) caps what the tools can do. |
| `CHATGENIUS_MAX_SCOPE` | no | `read`, `write` or `admin`. Hides every tool above that scope, so a `write` key with `CHATGENIUS_MAX_SCOPE=read` gives a read-only assistant. |
| `CHATGENIUS_API_URL` | no | Base URL. Defaults to `https://sumgenius.ai/api/v1`. |

## What it can do

105 tools in ten groups. Read tools are safe to run freely. Write tools create or edit records. Destructive tools reach a real person, publish content or change what runs live, and are marked so the client asks you first.

| Group | Tools |
|---|---|
| Account | `get_account`, `get_overview` |
| Contacts | `list_contacts`, `get_contact`, `upsert_contact`, `update_contact`, `list_tags`, `create_tag`, `tag_contact`, `untag_contact`, `delete_tag`, `list_custom_fields`, `create_custom_field`, `update_custom_field` |
| Inbox | `list_conversations`, `get_conversation`, `list_messages`, `update_conversation`, `send_message`, `assign_conversation`, `list_team_members`, `list_blocked_users`, `block_user`, `unblock_user`, `list_opt_outs` |
| Appointments | `list_appointments`, `get_availability`, `get_appointment`, `update_appointment`, `book_appointment`, `reschedule_appointment`, `cancel_appointment` |
| Flows | `list_flows`, `get_flow`, `get_flow_definition`, `get_flow_node_catalogue`, `validate_flow`, `create_flow`, `update_flow`, `publish_flow`, `activate_flow`, `pause_flow`, `duplicate_flow`, `discard_flow_draft`, `delete_flow`, `get_flow_analytics`, `list_flow_sessions`, `get_flow_session`, `list_flow_session_events`, `list_flow_events` |
| Comments | `list_comment_triggers`, `get_comment_trigger`, `simulate_comment`, `create_comment_trigger`, `update_comment_trigger`, `duplicate_comment_trigger`, `delete_comment_trigger`, `get_comment_trigger_stats`, `list_recent_posts`, `list_handled_comments`, `get_handled_comment`, `get_comment_manager_stats`, `approve_comment_reply`, `reject_comment_reply`, `bulk_approve_comment_replies`, `bulk_reject_comment_replies` |
| Content Studio | `list_posts`, `get_post`, `get_posting_capabilities`, `create_post`, `update_post`, `schedule_post`, `publish_post`, `unschedule_post`, `retry_post`, `delete_post` |
| Market Intel | `list_competitors`, `get_competitor`, `get_competitor_leaderboard`, `get_follower_history`, `get_wins_and_opportunities`, `get_audience_demographics`, `get_top_posts`, `get_account_insights`, `add_competitor`, `remove_competitor`, `refresh_market_intel` |
| Knowledge base | `list_faqs`, `create_faq`, `update_faq`, `list_services`, `list_knowledge_gaps`, `get_knowledge_usage`, `get_faq`, `delete_faq`, `get_service`, `create_service`, `update_service`, `delete_service`, `list_documents`, `get_document`, `update_document`, `delete_document` |
| AI settings | `get_ai_config`, `get_ai_channels` |

Things to try:

- "Who messaged us on Instagram this week that we have not replied to?"
- "Book Maria for a consultation Thursday at 2pm and tell her."
- "Build a flow that answers 'price' with our packages and collects an email."
- "Which comment replies are waiting for approval? Approve the first three."
- "What are the knowledge gaps from the last 30 days? Draft FAQs for them."

Building a flow works the way a developer would do it: the assistant reads the node catalogue, writes a definition, validates it until the errors list is empty, saves a draft, and publishes when you say so. Open the flow in the portal and it is laid out on the canvas.

## Safety

- Every write carries an `Idempotency-Key`, so a retried tool call cannot double-send.
- The API enforces the key's scope server-side. `CHATGENIUS_MAX_SCOPE` is a second, local cap.
- Message and comment text in results was written by your customers. The server tells the model to treat it as data, not instructions. Keep destructive tools behind your client's approval prompt.
- Team, webhook endpoint and API key management, and switching the AI on or off, are not exposed. Use the portal.

## Development

```
npm install
npm run build:tools     # regenerate tools.json from the live OpenAPI spec
npm run check           # fail if tools.json drifted from the spec
CHATGENIUS_API_KEY=... npm run smoke
```

`src/tools.js` is the curated tool table. `tools.json` is generated from it plus `https://sumgenius.ai/api/v1/openapi.json` and is what ships. Add a tool to the table, run `build:tools`, commit both.

## License

MIT. Made by SumGeniusAI LLC, Las Vegas.
