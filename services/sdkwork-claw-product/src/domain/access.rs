use crate::domain::DecimalValue;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GatewayApiKey {
    pub id: i64,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
    pub group_id: i64,
    pub name: String,
    pub key_prefix: String,
    pub key_display_masked: String,
    pub key_hash: String,
    pub copyable_key: Option<String>,
    pub policy_id: Option<i64>,
    pub quota_policy_id: Option<i64>,
    pub created_at: String,
    pub expire_at: Option<String>,
    pub status_code: i32,
    pub default_for_runtime: bool,
}

impl GatewayApiKey {
    pub fn new(id: i64, group_id: i64, key_prefix: &str, key_hash: &str) -> Self {
        let key_prefix = key_prefix.to_owned();
        Self {
            id,
            tenant_id: 0,
            organization_id: 0,
            user_id: 0,
            group_id,
            name: key_prefix.clone(),
            key_display_masked: mask_key_prefix(&key_prefix),
            key_prefix,
            key_hash: key_hash.to_owned(),
            copyable_key: None,
            policy_id: None,
            quota_policy_id: None,
            created_at: String::new(),
            expire_at: None,
            status_code: 1,
            default_for_runtime: false,
        }
    }

    pub fn with_owner(mut self, tenant_id: i64, organization_id: i64, user_id: i64) -> Self {
        self.tenant_id = tenant_id;
        self.organization_id = organization_id;
        self.user_id = user_id;
        self
    }

    pub fn with_management_metadata(
        mut self,
        name: &str,
        key_display_masked: &str,
        policy_id: Option<i64>,
        quota_policy_id: Option<i64>,
        created_at: &str,
        expire_at: Option<&str>,
    ) -> Self {
        self.name = name.to_owned();
        self.key_display_masked = key_display_masked.to_owned();
        self.policy_id = policy_id;
        self.quota_policy_id = quota_policy_id;
        self.created_at = created_at.to_owned();
        self.expire_at = expire_at.map(str::to_owned);
        self
    }

    pub fn with_copyable_key(mut self, copyable_key: impl Into<String>) -> Self {
        self.copyable_key = Some(copyable_key.into());
        self
    }

    pub fn with_default_for_runtime(mut self, default_for_runtime: bool) -> Self {
        self.default_for_runtime = default_for_runtime;
        self
    }

    pub fn display_name(&self) -> String {
        if !self.name.trim().is_empty() {
            self.name.clone()
        } else {
            format!("API Key #{}", self.id)
        }
    }

    pub fn masked_key(&self) -> String {
        if self.key_display_masked.trim().is_empty() {
            mask_key_prefix(&self.key_prefix)
        } else {
            self.key_display_masked.clone()
        }
    }

    pub fn status_label(&self) -> &'static str {
        match self.status_code {
            1 => "enabled",
            _ => "disabled",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ApiKeyGroup {
    pub id: i64,
    pub tenant_id: i64,
    pub organization_id: i64,
    pub name: String,
    pub code: String,
    pub pricing_plan_code: String,
    pub rate_multiplier: DecimalValue,
    pub official_price_multiplier: DecimalValue,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GatewayAccessPolicy {
    pub id: i64,
    pub allowed_capabilities: Vec<String>,
    pub ip_allowlist: Vec<String>,
}

impl GatewayAccessPolicy {
    pub fn new(id: i64, allowed_capabilities: Vec<String>, ip_allowlist: Vec<String>) -> Self {
        Self {
            id,
            allowed_capabilities,
            ip_allowlist,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ApiKeyGroupMetricSnapshot {
    pub group_id: i64,
    pub capacity_used: Option<DecimalValue>,
    pub capacity_limit: Option<DecimalValue>,
    pub usage_amount_total: Option<DecimalValue>,
    pub snapshot_at: Option<String>,
}

impl ApiKeyGroupMetricSnapshot {
    pub fn new(
        group_id: i64,
        capacity_used: Option<DecimalValue>,
        capacity_limit: Option<DecimalValue>,
        usage_amount_total: Option<DecimalValue>,
        snapshot_at: Option<String>,
    ) -> Self {
        Self {
            group_id,
            capacity_used,
            capacity_limit,
            usage_amount_total,
            snapshot_at,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct QuotaPolicy {
    pub id: i64,
    pub quota_limit: Option<DecimalValue>,
}

impl QuotaPolicy {
    pub fn new(id: i64, quota_limit: Option<DecimalValue>) -> Self {
        Self { id, quota_limit }
    }
}

fn mask_key_prefix(key_prefix: &str) -> String {
    let key_prefix = key_prefix.trim();
    if key_prefix.is_empty() {
        "********".to_owned()
    } else {
        format!("{key_prefix}********")
    }
}

impl ApiKeyGroup {
    pub fn new(
        id: i64,
        code: &str,
        pricing_plan_code: &str,
        rate_multiplier: DecimalValue,
        official_price_multiplier: DecimalValue,
    ) -> Self {
        Self::new_scoped(
            id,
            0,
            0,
            code,
            pricing_plan_code,
            rate_multiplier,
            official_price_multiplier,
        )
    }

    pub fn new_scoped(
        id: i64,
        tenant_id: i64,
        organization_id: i64,
        code: &str,
        pricing_plan_code: &str,
        rate_multiplier: DecimalValue,
        official_price_multiplier: DecimalValue,
    ) -> Self {
        Self {
            id,
            tenant_id,
            organization_id,
            name: code.to_owned(),
            code: code.to_owned(),
            pricing_plan_code: pricing_plan_code.to_owned(),
            rate_multiplier,
            official_price_multiplier,
        }
    }

    pub fn with_name(mut self, name: &str) -> Self {
        let normalized = name.trim();
        if !normalized.is_empty() {
            self.name = normalized.to_owned();
        }
        self
    }

    pub fn display_name(&self) -> String {
        let normalized = self.name.trim();
        if normalized.is_empty() {
            self.code.clone()
        } else {
            normalized.to_owned()
        }
    }
}
