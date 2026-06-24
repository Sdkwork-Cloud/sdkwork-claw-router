use crate::domain::{DomainError, DomainResult};
use crate::infrastructure::sql::model_catalog_import::stable_uuid;
use crate::infrastructure::sql::store_error::redacted_store_error;
use crate::ports::{ProviderVerificationDeliveryReceipt, ProviderVerificationDeliveryRequest};
use sha2::{Digest, Sha256};

#[derive(Debug, Clone)]
pub(crate) struct VerificationTemplateSelection {
    pub(crate) version_id: i64,
    pub(crate) variant_id: i64,
    pub(crate) subject_template: Option<String>,
    pub(crate) body_template: String,
    pub(crate) variable_schema: serde_json::Value,
}

#[derive(Debug, Clone)]
pub(crate) struct VerificationQueuePayload {
    pub(crate) tenant_id: i64,
    pub(crate) organization_id: i64,
    pub(crate) request_id: String,
    pub(crate) request_no: String,
    pub(crate) idempotency_key: String,
    pub(crate) payload_hash: String,
    pub(crate) scene_code: String,
    pub(crate) channel: String,
    pub(crate) target_type: &'static str,
    pub(crate) target_hash: String,
    pub(crate) target_masked: String,
    pub(crate) render_hash: String,
    pub(crate) provider_code: String,
    pub(crate) provider_account_id: i64,
    pub(crate) sender_identity_id: Option<i64>,
    pub(crate) route_rule_id: i64,
    pub(crate) template_version_id: i64,
    pub(crate) template_variant_id: i64,
    pub(crate) request_payload_redacted: serde_json::Value,
    pub(crate) event_payload_redacted: serde_json::Value,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum VerificationDeliveryStatus {
    Queued,
    RateLimited,
}

impl VerificationDeliveryStatus {
    pub(crate) fn as_str(self) -> &'static str {
        match self {
            Self::Queued => "queued",
            Self::RateLimited => "rate_limited",
        }
    }
}

pub(crate) fn build_verification_queue_payload(
    request: &ProviderVerificationDeliveryRequest,
    template: VerificationTemplateSelection,
) -> DomainResult<VerificationQueuePayload> {
    let config = &request.config;
    let delivery = &request.delivery;
    let scene_code = normalize_token(&config.scene);
    let channel = normalize_token(&config.channel);
    let template_code = config
        .template_code
        .as_ref()
        .map(|value| normalize_template_code(value))
        .filter(|value| !value.is_empty())
        .ok_or_else(|| {
            DomainError::new(format!(
                "verification code delivery template is not configured for channel {channel} scene {scene_code}"
            ))
        })?;
    let variables = serde_json::json!({
        "code": &delivery.code,
        "expiresAt": &delivery.expires_at,
    });
    validate_template_variables(&template.variable_schema, &variables)?;
    let variable_keys = template_variable_keys(&variables);
    let target_hash = digest_hex(&format!(
        "{}:{}:{}",
        config.tenant_id,
        channel,
        normalize_target(&delivery.target)
    ));
    let target_masked = mask_target(&channel, &delivery.target);
    let payload_hash = stable_uuid(
        "verification-message-payload",
        &[&delivery.code_id, &target_hash, &scene_code, &template_code],
    );
    let render_hash = stable_uuid(
        "verification-message-render",
        &[&payload_hash, &template.version_id.to_string()],
    );
    let request_payload_redacted = serde_json::json!({
        "sceneCode": &scene_code,
        "channel": &channel,
        "deliveryPurpose": "verification",
        "templateCode": &template_code,
        "variableKeys": variable_keys.clone(),
        "subjectTemplate": template.subject_template.as_deref(),
        "bodyTemplate": &template.body_template,
        "deliveryStatus": "queued",
        "providerCode": &config.provider_code,
        "providerAccountId": config.account_id.to_string(),
        "sender": config.sender.as_deref(),
    });
    let event_payload_redacted = serde_json::json!({
        "sceneCode": &scene_code,
        "channel": &channel,
        "deliveryPurpose": "verification",
        "templateCode": &template_code,
        "variableKeys": variable_keys,
        "targetMasked": &target_masked,
        "deliveryStatus": "queued",
    });
    Ok(VerificationQueuePayload {
        tenant_id: config.tenant_id,
        organization_id: config.organization_id,
        request_id: format!("verification-code:{}", delivery.code_id),
        request_no: delivery.code_id.clone(),
        idempotency_key: format!("verification-code:{}", delivery.code_id),
        payload_hash,
        scene_code,
        channel: channel.clone(),
        target_type: target_type(&channel),
        target_hash,
        target_masked,
        render_hash,
        provider_code: config.provider_code.clone(),
        provider_account_id: config.account_id,
        sender_identity_id: config.sender_identity_id,
        route_rule_id: config.route_rule_id,
        template_version_id: template.version_id,
        template_variant_id: template.variant_id,
        request_payload_redacted,
        event_payload_redacted,
    })
}

pub(crate) fn apply_delivery_status(
    payload: &mut VerificationQueuePayload,
    status: VerificationDeliveryStatus,
) {
    let status_text = serde_json::Value::String(status.as_str().to_owned());
    if let Some(items) = payload.request_payload_redacted.as_object_mut() {
        items.insert("deliveryStatus".to_owned(), status_text.clone());
    }
    if let Some(items) = payload.event_payload_redacted.as_object_mut() {
        items.insert("deliveryStatus".to_owned(), status_text);
    }
}

pub(crate) fn queued_receipt(
    request: &ProviderVerificationDeliveryRequest,
) -> ProviderVerificationDeliveryReceipt {
    ProviderVerificationDeliveryReceipt {
        message_id: request.delivery.code_id.clone(),
        delivered_at: request.delivery.expires_at.clone(),
    }
}

pub(crate) fn rate_limited_error(channel: &str, scene_code: &str) -> DomainError {
    DomainError::conflict(format!(
        "verification code delivery is rate limited for channel {channel} scene {scene_code}"
    ))
}

pub(crate) fn normalize_token(value: &str) -> String {
    value.trim().to_ascii_lowercase().replace('-', "_")
}

pub(crate) fn normalize_template_code(value: &str) -> String {
    value.trim().to_owned()
}

pub(crate) fn json_text(value: &serde_json::Value) -> String {
    serde_json::to_string(value).unwrap_or_else(|_| "{}".to_owned())
}

pub(crate) fn provider_event_id(send_request_id: i64, event_type: &str) -> String {
    format!(
        "{}-{}",
        event_type,
        stable_uuid(
            "messaging-delivery-event",
            &[&send_request_id.to_string(), event_type]
        )
    )
}

pub(crate) fn target_type(channel: &str) -> &'static str {
    match channel {
        "email" => "email",
        _ => "phone",
    }
}

fn template_variable_keys(variables: &serde_json::Value) -> Vec<String> {
    let mut keys = variables
        .as_object()
        .map(|items| items.keys().cloned().collect::<Vec<_>>())
        .unwrap_or_default();
    keys.sort();
    keys
}

fn validate_template_variables(
    variable_schema: &serde_json::Value,
    variables: &serde_json::Value,
) -> DomainResult<()> {
    let Some(required) = variable_schema
        .get("required")
        .and_then(serde_json::Value::as_array)
    else {
        return Ok(());
    };
    let Some(values) = variables.as_object() else {
        return Err(DomainError::new(
            "verification template variables must be a JSON object",
        ));
    };
    for required_item in required {
        let Some(name) = required_item.as_str() else {
            continue;
        };
        let present = values
            .get(name)
            .map(|value| !value.is_null())
            .unwrap_or(false);
        if !present {
            return Err(DomainError::new(format!(
                "missing required verification template variable {name}"
            )));
        }
    }
    Ok(())
}

fn digest_hex(value: &str) -> String {
    hex::encode(Sha256::digest(value.as_bytes()))
}

fn normalize_target(value: &str) -> String {
    value.trim().to_ascii_lowercase()
}

fn mask_target(channel: &str, target: &str) -> String {
    let trimmed = target.trim();
    if channel == "email" {
        return mask_email(trimmed);
    }
    mask_phone(trimmed)
}

fn mask_email(value: &str) -> String {
    let Some((local, domain)) = value.split_once('@') else {
        return "***".to_owned();
    };
    let first = local.chars().next().unwrap_or('*');
    format!("{first}***@{domain}")
}

fn mask_phone(value: &str) -> String {
    let chars = value.chars().collect::<Vec<_>>();
    if chars.len() <= 4 {
        return "****".to_owned();
    }
    let suffix = chars[chars.len().saturating_sub(4)..]
        .iter()
        .collect::<String>();
    format!("***{suffix}")
}

pub(crate) fn store_error(context: &str, error: sqlx::Error) -> DomainError {
    redacted_store_error(context, error)
}

pub(crate) fn write_error(context: &str, error: sqlx::Error) -> DomainError {
    redacted_store_error(context, error)
}
