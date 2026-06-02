use crate::domain::{DomainError, DomainResult};
use crate::ports::AdminCategorySeedBundle;

const PRODUCT_CATEGORY_SEED_JSON: &str =
    include_str!("../../../../data/categories/product/categories.json");
const COURSE_CATEGORY_SEED_JSON: &str =
    include_str!("../../../../data/categories/courses/categories.json");
const AGENT_CATEGORY_SEED_JSON: &str =
    include_str!("../../../../data/categories/agents/categories.json");
const AGENT_SKILL_CATEGORY_SEED_JSON: &str =
    include_str!("../../../../data/categories/agent-skills/categories.json");
const MCP_CATEGORY_SEED_JSON: &str =
    include_str!("../../../../data/categories/mcp/categories.json");
const APP_CATEGORY_SEED_JSON: &str =
    include_str!("../../../../data/categories/apps/categories.json");

pub const DEFAULT_ADMIN_CATEGORY_SEED_DATASETS: &[&str] = &[
    "product",
    "courses",
    "agents",
    "agent-skills",
    "mcp",
    "apps",
];

pub fn load_admin_category_seed_bundles(
    datasets: &[String],
) -> DomainResult<Vec<AdminCategorySeedBundle>> {
    let mut bundles = Vec::with_capacity(datasets.len());
    for dataset in datasets {
        let source = match dataset.as_str() {
            "product" => PRODUCT_CATEGORY_SEED_JSON,
            "courses" => COURSE_CATEGORY_SEED_JSON,
            "agents" => AGENT_CATEGORY_SEED_JSON,
            "agent-skills" => AGENT_SKILL_CATEGORY_SEED_JSON,
            "mcp" => MCP_CATEGORY_SEED_JSON,
            "apps" => APP_CATEGORY_SEED_JSON,
            other => {
                return Err(DomainError::new(format!(
                    "unsupported category seed dataset {other}"
                )))
            }
        };
        let bundle: AdminCategorySeedBundle = serde_json::from_str(source).map_err(|error| {
            DomainError::new(format!("invalid category seed dataset {dataset}: {error}"))
        })?;
        validate_bundle(dataset, &bundle)?;
        bundles.push(bundle);
    }
    Ok(bundles)
}

fn validate_bundle(dataset: &str, bundle: &AdminCategorySeedBundle) -> DomainResult<()> {
    if bundle.schema_version != 1 {
        return Err(DomainError::new(format!(
            "category seed dataset {dataset} has unsupported schemaVersion {}",
            bundle.schema_version
        )));
    }
    if bundle.kind != "sdkwork.category_seed" {
        return Err(DomainError::new(format!(
            "category seed dataset {dataset} has invalid kind {}",
            bundle.kind
        )));
    }
    if bundle.dataset != dataset {
        return Err(DomainError::new(format!(
            "category seed dataset {dataset} manifest declares {}",
            bundle.dataset
        )));
    }
    if !matches!(
        bundle.target.as_str(),
        "commerce_product_category" | "plus_category"
    ) {
        return Err(DomainError::new(format!(
            "category seed dataset {dataset} has unsupported target {}",
            bundle.target
        )));
    }
    if bundle.target == "plus_category"
        && (bundle.category_type.is_none()
            || bundle
                .group_name
                .as_deref()
                .map(str::trim)
                .unwrap_or_default()
                .is_empty())
    {
        return Err(DomainError::new(format!(
            "plus_category seed dataset {dataset} requires categoryType and groupName"
        )));
    }
    Ok(())
}
