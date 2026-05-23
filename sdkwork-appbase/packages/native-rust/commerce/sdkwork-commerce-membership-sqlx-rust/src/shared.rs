use std::collections::BTreeSet;

use sdkwork_commerce_core::{CommerceMoney, CommerceServiceError};
use serde_json::Value;

use crate::{
    AppMembershipBenefitItem, AppMembershipPackageGroupItem, AppMembershipPackageItem,
    AppMembershipPlanItem, AppMembershipPrivilegeUsageResponse,
};

pub(crate) const POINTS_ASSET_TYPE: &str = "points";
pub(crate) const POINTS_CURRENCY_CODE: &str = "POINT";

pub(crate) fn normalize_payment_method(method: &str) -> String {
    method.trim().to_ascii_lowercase()
}

pub(crate) fn method_alias(method: &str) -> &str {
    match method {
        "card" => "stripe",
        "wechatpay" => "wechat",
        _ => method,
    }
}

pub(crate) fn plan_rank_from_code(plan_no: &str) -> i64 {
    match plan_no.trim().to_ascii_lowercase().as_str() {
        "free" => 0,
        "basic" => 1,
        "pro" | "advanced" => 2,
        "premium" | "ultimate" => 3,
        _ => 0,
    }
}

pub(crate) fn plan_code_from_rank(rank: i64) -> &'static str {
    match rank {
        1 => "basic",
        2 => "pro",
        3 => "premium",
        _ => "free",
    }
}

pub(crate) fn default_plan_name(rank: i64) -> &'static str {
    match rank {
        1 => "Basic member",
        2 => "Advanced member",
        3 => "Premium member",
        _ => "Free",
    }
}

pub(crate) fn map_membership_package_record(
    id: i64,
    name: String,
    description: Option<String>,
    price: String,
    original_price: Option<String>,
    point_amount: i64,
    duration_days: i64,
    plan_name: Option<String>,
    sort_weight: i64,
    recommended: bool,
    tags_json: &str,
    group_external_id: i64,
    group_name: String,
    group_description: Option<String>,
    group_sort_weight: i64,
    plan_no: Option<String>,
    rank: i64,
    sku_id: Option<String>,
) -> Option<ParsedMembershipPackage> {
    if id <= 0 || group_external_id <= 0 {
        return None;
    }
    let plan_no = plan_no.unwrap_or_else(|| plan_code_from_rank(rank).to_owned());
    let rank = if rank == 0 {
        plan_rank_from_code(&plan_no)
    } else {
        rank
    };
    let item = AppMembershipPackageItem {
        id,
        name,
        description,
        price,
        original_price,
        point_amount: point_amount.max(0),
        duration_days: duration_days.max(0),
        plan_name: plan_name.or_else(|| Some(default_plan_name(rank).to_owned())),
        sort_weight,
        recommended,
        tags: string_array_from_json(tags_json),
    };
    Some(ParsedMembershipPackage {
        group_external_id,
        group_name,
        group_description,
        group_sort_weight,
        plan_no,
        rank,
        sku_id,
        item,
    })
}

#[derive(Debug, Clone)]
pub(crate) struct ParsedMembershipPackage {
    pub group_external_id: i64,
    pub group_name: String,
    pub group_description: Option<String>,
    pub group_sort_weight: i64,
    pub plan_no: String,
    pub rank: i64,
    pub sku_id: Option<String>,
    pub item: AppMembershipPackageItem,
}

pub(crate) fn build_package_group_from_packages(
    package_group_id: i64,
    name: String,
    description: Option<String>,
    sort_weight: i64,
    packages: Vec<AppMembershipPackageItem>,
) -> AppMembershipPackageGroupItem {
    AppMembershipPackageGroupItem {
        id: package_group_id,
        name,
        description,
        sort_weight,
        packages,
    }
}

pub(crate) fn parse_membership_plan_benefit_json(
    benefit_json: &str,
) -> (
    i64,
    Option<i64>,
    Option<String>,
    Option<String>,
    Vec<AppMembershipBenefitItem>,
) {
    let Ok(value) = serde_json::from_str::<Value>(benefit_json) else {
        return (0, None, None, None, Vec::new());
    };
    let rank = integer_field(&value, "planRank", 0);
    let required_points = optional_integer_field(&value, "requiredPoints");
    let badge = string_field(&value, "badge");
    let description = string_field(&value, "description");
    let benefits = value
        .get("items")
        .and_then(Value::as_array)
        .map(|items| {
            items
                .iter()
                .enumerate()
                .map(|(index, item)| benefit_from_value(item, (index + 1) as i64))
                .collect()
        })
        .unwrap_or_default();
    (rank, required_points, badge, description, benefits)
}

pub(crate) fn benefit_from_value(value: &Value, fallback_id: i64) -> AppMembershipBenefitItem {
    AppMembershipBenefitItem {
        id: optional_integer_field(value, "id").unwrap_or(fallback_id),
        name: string_field(value, "name").unwrap_or_else(|| "Membership benefit".to_owned()),
        benefit_key: string_field(value, "benefitKey"),
        r#type: string_field(value, "type"),
        description: string_field(value, "description"),
        icon: string_field(value, "icon"),
        claimed: value
            .get("claimed")
            .and_then(Value::as_bool)
            .unwrap_or(false),
        usage_limit: optional_integer_field(value, "usageLimit"),
        used_count: optional_integer_field(value, "usedCount"),
    }
}

#[allow(dead_code)]
pub(crate) fn default_free_plan() -> AppMembershipPlanItem {
    AppMembershipPlanItem {
        id: 0,
        name: "Free".to_owned(),
        rank: 0,
        required_points: Some(0),
        description: Some(
            "Basic model catalog access, public routes, and a small trial quota.".to_owned(),
        ),
        icon: None,
        badge: Some("Free".to_owned()),
    }
}

pub(crate) fn benefits_for_plan(
    plans: &[StoredMembershipPlan],
    rank: i64,
) -> Vec<AppMembershipBenefitItem> {
    plans
        .iter()
        .find(|item| item.rank == rank)
        .or_else(|| {
            if matches!(rank, 0..=3) {
                let code = plan_code_from_rank(rank);
                return plans.iter().find(|item| item.plan_no == code);
            }
            None
        })
        .map(|item| item.benefits.clone())
        .unwrap_or_default()
}

#[derive(Debug, Clone)]
pub(crate) struct StoredMembershipPlan {
    pub id: i64,
    pub storage_id: String,
    pub plan_no: String,
    pub item: AppMembershipPlanItem,
    pub benefits: Vec<AppMembershipBenefitItem>,
    pub rank: i64,
}

pub(crate) fn privilege_usage_from_benefits(
    benefits: &[AppMembershipBenefitItem],
) -> AppMembershipPrivilegeUsageResponse {
    AppMembershipPrivilegeUsageResponse {
        speed_up_used: 0,
        speed_up_limit: benefit_limit(
            benefits,
            &["top_priority", "high_priority", "normal_priority"],
        ),
        priority_queue_used: 0,
        priority_queue_limit: benefit_limit(
            benefits,
            &["top_priority", "high_priority", "normal_priority"],
        ),
        exclusive_model_used: 0,
        exclusive_model_limit: benefit_limit(
            benefits,
            &[
                "frontier_models",
                "advanced_models",
                "standard_models",
                "basic_models",
            ],
        ),
    }
}

fn benefit_limit(benefits: &[AppMembershipBenefitItem], keys: &[&str]) -> i64 {
    let key_set = keys.iter().copied().collect::<BTreeSet<_>>();
    benefits
        .iter()
        .find_map(|item| {
            let key = item.benefit_key.as_deref()?;
            if key_set.contains(key) {
                item.usage_limit
            } else {
                None
            }
        })
        .unwrap_or(0)
}

pub(crate) fn decimal_string(
    value: &str,
    field_name: &str,
) -> Result<String, CommerceServiceError> {
    CommerceMoney::new(value)
        .map(|amount| amount.as_str().to_owned())
        .map_err(|_| CommerceServiceError::storage(format!("invalid {field_name}: {value}")))
}

pub(crate) fn parse_points_amount(value: &str) -> i64 {
    let normalized = value.trim();
    if normalized.is_empty() {
        return 0;
    }
    let unsigned = normalized.trim_start_matches('+');
    let Some(integer_part) = unsigned.split('.').next() else {
        return 0;
    };
    integer_part.parse::<i64>().unwrap_or(0)
}

fn string_field(value: &Value, key: &str) -> Option<String> {
    value
        .get(key)
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|item| !item.is_empty())
        .map(str::to_owned)
}

fn optional_integer_field(value: &Value, key: &str) -> Option<i64> {
    value.get(key).and_then(|item| {
        item.as_i64()
            .or_else(|| item.as_u64().and_then(|value| i64::try_from(value).ok()))
            .or_else(|| item.as_f64().map(|value| value as i64))
            .or_else(|| {
                item.as_str()
                    .and_then(|text| text.trim().parse::<i64>().ok())
            })
    })
}

fn integer_field(value: &Value, key: &str, fallback: i64) -> i64 {
    optional_integer_field(value, key).unwrap_or(fallback)
}

fn string_array_from_json(value: &str) -> Vec<String> {
    serde_json::from_str::<Value>(value)
        .ok()
        .and_then(|parsed| parsed.as_array().cloned())
        .map(|items| {
            items
                .iter()
                .filter_map(Value::as_str)
                .map(str::trim)
                .filter(|item| !item.is_empty())
                .map(str::to_owned)
                .collect()
        })
        .unwrap_or_default()
}
