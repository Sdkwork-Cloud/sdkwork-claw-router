use axum::middleware::from_fn_with_state;
use axum::Router;

use crate::auth::{
    app_request_subject_boundary, optional_app_request_subject_boundary, AppSubjectBoundaryConfig,
};

fn env_flag_enabled(value: Option<&str>) -> bool {
    matches!(value, Some("1" | "true" | "TRUE" | "yes" | "YES"))
}

fn env_flag_disabled(value: Option<&str>) -> bool {
    matches!(value, Some("0" | "false" | "FALSE" | "no" | "NO"))
}

/// Returns true when the sdkwork-web-framework pipeline should own HTTP auth/context.
pub fn claw_web_framework_enabled_from_env() -> bool {
    if env_flag_enabled(
        std::env::var("SDKWORK_CLAW_WEB_FRAMEWORK_LEGACY")
            .ok()
            .as_deref(),
    ) {
        return false;
    }
    match std::env::var("SDKWORK_CLAW_WEB_FRAMEWORK_ENABLED")
        .ok()
        .as_deref()
    {
        value if env_flag_disabled(value) => false,
        value if env_flag_enabled(value) => true,
        _ => true,
    }
}

pub fn apply_app_subject_boundary_if_legacy(
    router: Router,
    config: AppSubjectBoundaryConfig,
) -> Router {
    if claw_web_framework_enabled_from_env() {
        router
    } else {
        router.layer(from_fn_with_state(config, app_request_subject_boundary))
    }
}

pub fn apply_optional_app_subject_boundary_if_legacy(
    router: Router,
    config: AppSubjectBoundaryConfig,
) -> Router {
    if claw_web_framework_enabled_from_env() {
        router
    } else {
        router.layer(from_fn_with_state(
            config,
            optional_app_request_subject_boundary,
        ))
    }
}

#[cfg(test)]
mod tests {
    use super::claw_web_framework_enabled_from_env;

    #[test]
    fn claw_web_framework_enabled_by_default() {
        let legacy = std::env::var("SDKWORK_CLAW_WEB_FRAMEWORK_LEGACY")
            .ok()
            .filter(|value| !value.trim().is_empty())
            .is_some();
        if legacy {
            return;
        }
        assert!(claw_web_framework_enabled_from_env());
    }
}
