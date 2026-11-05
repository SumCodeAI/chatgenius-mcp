/**
 * The curated tool table. Each entry maps one MCP tool to one REST operation
 * by its OpenAPI operationId. scripts/build-tools.mjs turns this into
 * tools.json (input schemas resolved from the live spec); the server reads
 * that file. Add a tool here, run `npm run build:tools`, commit both.
 *
 * kind: read (no side effects) | write (creates or edits) | destructive
 * (sends something to a person, publishes, deletes). Clients use the hints
 * to decide when to ask the person before running a tool.
 */
export const TOOLS = [
  // Account
  { name: 'get_account', op: 'get_the_account', kind: 'read' },
  { name: 'get_overview', op: 'get_the_account_overview', kind: 'read' },

  // Contacts and tags
  { name: 'list_contacts', op: 'list_contacts', kind: 'read' },
  { name: 'get_contact', op: 'get_a_contact', kind: 'read' },
  { name: 'upsert_contact', op: 'create_or_update_a_contact', kind: 'write' },
  { name: 'update_contact', op: 'update_a_contact', kind: 'write' },
  { name: 'list_tags', op: 'list_tags', kind: 'read' },
  { name: 'create_tag', op: 'create_a_tag', kind: 'write' },
  { name: 'tag_contact', op: 'attach_a_tag', kind: 'write' },
  { name: 'untag_contact', op: 'detach_a_tag', kind: 'write' },
  { name: 'delete_tag', op: 'delete_a_tag', kind: 'destructive' },
  { name: 'list_custom_fields', op: 'list_custom_field_definitions', kind: 'read' },
  { name: 'create_custom_field', op: 'create_a_custom_field', kind: 'write' },
  { name: 'update_custom_field', op: 'rename_or_archive_a_custom_field', kind: 'write' },

  // Inbox
  { name: 'list_conversations', op: 'list_conversations', kind: 'read' },
  { name: 'get_conversation', op: 'get_a_conversation', kind: 'read' },
  { name: 'list_messages', op: 'list_messages_in_a_conversation', kind: 'read' },
  { name: 'update_conversation', op: 'update_a_conversation', kind: 'write' },
  { name: 'send_message', op: 'send_a_message', kind: 'destructive',
    note: 'This reaches a real person on their phone. Confirm the recipient and the text with the user before calling.' },
  { name: 'assign_conversation', op: 'assign_or_unassign_a_conversation', kind: 'write' },
  { name: 'list_team_members', op: 'list_team_members', kind: 'read',
    note: 'Use it to find the member id for assign_conversation.' },
  { name: 'list_blocked_users', op: 'list_blocked_users', kind: 'read' },
  { name: 'block_user', op: 'block_a_user', kind: 'write' },
  { name: 'unblock_user', op: 'unblock_a_user', kind: 'write' },
  { name: 'list_opt_outs', op: 'list_opt_outs', kind: 'read' },

  // Appointments
  { name: 'list_appointments', op: 'list_appointments', kind: 'read' },
  { name: 'get_availability', op: 'get_availability', kind: 'read' },
  { name: 'get_appointment', op: 'get_an_appointment', kind: 'read' },
  { name: 'update_appointment', op: 'update_an_appointment', kind: 'destructive',
    note: 'Edits are pushed to the connected calendar, and a status of cancelled removes the event. To move the time, use reschedule_appointment.' },
  { name: 'book_appointment', op: 'book_an_appointment', kind: 'destructive' },
  { name: 'reschedule_appointment', op: 'reschedule_an_appointment', kind: 'destructive' },
  { name: 'cancel_appointment', op: 'cancel_an_appointment', kind: 'destructive' },

  // Flows (build, inspect, run)
  { name: 'list_flows', op: 'list_flows', kind: 'read' },
  { name: 'get_flow', op: 'get_a_flow', kind: 'read' },
  { name: 'get_flow_definition', op: 'get_a_flow_definition', kind: 'read' },
  { name: 'get_flow_node_catalogue', op: 'get_the_node_catalogue', kind: 'read',
    note: 'Read this before writing a flow definition. It lists every node type, its config fields and output ports.' },
  { name: 'validate_flow', op: 'validate_a_flow_definition', kind: 'read',
    note: 'Validate a definition without saving it. Loop on errors[] until it is clean, then call create_flow.' },
  { name: 'create_flow', op: 'create_a_flow', kind: 'write' },
  { name: 'update_flow', op: 'update_a_flow', kind: 'write' },
  { name: 'publish_flow', op: 'publish_a_flow_draft', kind: 'destructive' },
  { name: 'activate_flow', op: 'activate_a_flow', kind: 'destructive' },
  { name: 'pause_flow', op: 'pause_a_flow', kind: 'write' },
  { name: 'duplicate_flow', op: 'duplicate_a_flow', kind: 'write' },
  { name: 'discard_flow_draft', op: 'discard_a_flow_draft', kind: 'write' },
  { name: 'delete_flow', op: 'delete_a_flow', kind: 'destructive',
    note: 'Permanent: the flow, its versions, sessions and analytics are gone. Confirm with the user, and prefer pause_flow.' },
  { name: 'get_flow_analytics', op: 'get_flow_analytics', kind: 'read' },
  { name: 'list_flow_sessions', op: 'list_flow_sessions', kind: 'read' },
  { name: 'get_flow_session', op: 'get_a_flow_session', kind: 'read' },
  { name: 'list_flow_session_events', op: 'list_events_for_a_session', kind: 'read' },
  { name: 'list_flow_events', op: 'list_flow_events_across_sessions', kind: 'read' },

  // Comment triggers and the AI Comment Manager
  { name: 'list_comment_triggers', op: 'list_comment_triggers', kind: 'read' },
  { name: 'get_comment_trigger', op: 'get_a_comment_trigger', kind: 'read' },
  { name: 'simulate_comment', op: 'simulate_a_comment', kind: 'read',
    note: 'Dry run, nothing is sent. Use it to check a trigger matches before and after changing it.' },
  { name: 'create_comment_trigger', op: 'create_a_comment_trigger', kind: 'destructive',
    note: 'It goes live at once and starts DMing real commenters. Confirm with the user first, or send draft: true to save it paused. A paused trigger stays paused through edits until you send active: true.' },
  { name: 'update_comment_trigger', op: 'update_a_comment_trigger', kind: 'destructive',
    note: 'Edits a trigger that may be live. The whole trigger is re-validated, so a draft needs its DM text and a button before any edit saves. It never switches a trigger on unless you send active: true; confirm with the user before you do.' },
  { name: 'duplicate_comment_trigger', op: 'duplicate_a_comment_trigger', kind: 'write' },
  { name: 'delete_comment_trigger', op: 'delete_a_comment_trigger', kind: 'destructive' },
  { name: 'get_comment_trigger_stats', op: 'get_comment_trigger_stats', kind: 'read' },
  { name: 'list_recent_posts', op: 'list_recent_posts', kind: 'read' },
  { name: 'list_handled_comments', op: 'list_handled_comments', kind: 'read' },
  { name: 'get_handled_comment', op: 'get_a_handled_comment', kind: 'read' },
  { name: 'get_comment_manager_stats', op: 'get_comment_manager_stats', kind: 'read' },
  { name: 'approve_comment_reply', op: 'approve_a_reply', kind: 'destructive' },
  { name: 'reject_comment_reply', op: 'reject_a_reply', kind: 'write' },
  { name: 'bulk_approve_comment_replies', op: 'bulk_approve_replies', kind: 'destructive',
    note: 'Each approved reply is posted publicly under the comment. Confirm with the user.' },
  { name: 'bulk_reject_comment_replies', op: 'bulk_reject_replies', kind: 'write' },

  // Content Studio
  { name: 'list_posts', op: 'list_posts', kind: 'read' },
  { name: 'get_post', op: 'get_a_post', kind: 'read' },
  { name: 'get_posting_capabilities', op: 'get_posting_capabilities', kind: 'read' },
  { name: 'create_post', op: 'create_a_post', kind: 'write' },
  { name: 'update_post', op: 'update_a_post', kind: 'write' },
  { name: 'schedule_post', op: 'schedule_a_post', kind: 'destructive' },
  { name: 'publish_post', op: 'publish_a_post_now', kind: 'destructive' },
  { name: 'unschedule_post', op: 'unschedule_a_post', kind: 'write' },
  { name: 'retry_post', op: 'retry_a_failed_post', kind: 'destructive' },
  { name: 'delete_post', op: 'delete_a_post', kind: 'destructive' },

  // Market Intel (competitors and Instagram insights)
  { name: 'list_competitors', op: 'list_tracked_competitors', kind: 'read' },
  { name: 'get_competitor', op: 'compare_against_one_competitor', kind: 'read' },
  { name: 'get_competitor_leaderboard', op: 'get_the_leaderboard', kind: 'read',
    note: 'Your account and every competitor ranked together. Start here for any "how do I compare" question.' },
  { name: 'get_follower_history', op: 'get_follower_history', kind: 'read' },
  { name: 'get_wins_and_opportunities', op: 'get_wins_and_opportunities', kind: 'read' },
  { name: 'get_audience_demographics', op: 'get_audience_demographics', kind: 'read',
    note: 'Includes followers online by hour, which is what "when should I post" is answered from.' },
  { name: 'get_top_posts', op: 'list_your_top_posts', kind: 'read' },
  { name: 'get_account_insights', op: 'get_account_insights', kind: 'read' },
  { name: 'add_competitor', op: 'track_a_competitor', kind: 'write' },
  { name: 'remove_competitor', op: 'stop_tracking_a_competitor', kind: 'write' },
  { name: 'refresh_market_intel', op: 'refresh_from_meta', kind: 'write',
    note: 'Slow: one Meta call per tracked account. Only call it when the stored snapshot is stale.' },

  // Knowledge base
  { name: 'list_faqs', op: 'list_faqs', kind: 'read' },
  { name: 'create_faq', op: 'create_an_faq', kind: 'write' },
  { name: 'update_faq', op: 'update_an_faq', kind: 'write' },
  { name: 'list_services', op: 'list_services', kind: 'read' },
  { name: 'list_knowledge_gaps', op: 'list_knowledge_gaps', kind: 'read' },
  { name: 'get_knowledge_usage', op: 'get_knowledge_base_usage', kind: 'read' },
  { name: 'get_faq', op: 'get_an_faq', kind: 'read' },
  { name: 'delete_faq', op: 'delete_an_faq', kind: 'destructive' },
  { name: 'get_service', op: 'get_a_service', kind: 'read' },
  { name: 'create_service', op: 'create_a_service', kind: 'write' },
  { name: 'update_service', op: 'update_a_service', kind: 'write' },
  { name: 'delete_service', op: 'delete_a_service', kind: 'destructive' },
  { name: 'list_documents', op: 'list_documents', kind: 'read' },
  { name: 'get_document', op: 'get_a_document', kind: 'read' },
  { name: 'update_document', op: 'rename_or_toggle_a_document', kind: 'write' },
  { name: 'delete_document', op: 'delete_a_document', kind: 'destructive' },

  // AI settings (read only here; switching the AI needs the admin scope, which assistants never get)
  { name: 'get_ai_config', op: 'get_the_ai_configuration', kind: 'read' },
  { name: 'get_ai_channels', op: 'get_the_per_channel_ai_switches', kind: 'read' },
];
