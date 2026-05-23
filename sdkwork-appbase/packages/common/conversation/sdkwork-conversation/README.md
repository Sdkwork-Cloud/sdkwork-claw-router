# @sdkwork/conversation

Common conversation foundation for SDKWork appbase.

This package owns conversations, turns, timeline items, messages, message parts,
external identity links, and handoff markers. Official-account inbound messages
and customer-service replies are stored as normal conversation messages. Open
platform modules store delivery windows and outbox records that reference these
conversation records.
