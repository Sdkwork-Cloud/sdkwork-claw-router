import { describe, expect, it } from "vitest";

import { SDKWORK_MESSAGING_DELIVERY_STATUSES, SDKWORK_MESSAGING_STANDARD, SDKWORK_MESSAGING_TABLES } from "../src/index";

describe("SDKWork messaging standard contracts", () => {
  it("keeps external SMS and email delivery under the messaging domain", () => {
    expect(SDKWORK_MESSAGING_STANDARD.domain).toBe("messaging");
    expect(SDKWORK_MESSAGING_STANDARD.databasePrefix).toBe("messaging");
    expect(SDKWORK_MESSAGING_STANDARD.supportedChannels).toEqual(["sms", "email"]);
    expect(Object.values(SDKWORK_MESSAGING_TABLES)).toEqual(
      expect.arrayContaining([
        "messaging_provider_capability",
        "messaging_sender_identity",
        "messaging_template",
        "messaging_template_version",
        "messaging_template_variant",
        "messaging_template_binding",
        "messaging_route_rule",
        "messaging_route_rule_target",
        "messaging_send_request",
        "messaging_send_attempt",
        "messaging_delivery_event",
        "messaging_suppression",
        "messaging_rate_limit_bucket",
        "iam_verification_challenge",
      ]),
    );
    for (const table of Object.values(SDKWORK_MESSAGING_TABLES)) {
      expect(table.startsWith("notification_")).toBe(false);
      expect(table.startsWith("ops_notification_")).toBe(false);
    }
  });

  it("declares the full delivery status vocabulary used by governance and diagnostics", () => {
    expect(SDKWORK_MESSAGING_DELIVERY_STATUSES).toEqual([
      "accepted",
      "queued",
      "dry_run",
      "sent",
      "delivered",
      "failed",
      "suppressed",
      "rate_limited",
      "route_unmatched",
      "expired",
    ]);
  });
});
