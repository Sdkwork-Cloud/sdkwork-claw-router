pub const MESSAGING_STORAGE_TABLES: &[&str] = &[
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
];

pub fn is_messaging_storage_table(table: &str) -> bool {
    MESSAGING_STORAGE_TABLES.contains(&table)
}
