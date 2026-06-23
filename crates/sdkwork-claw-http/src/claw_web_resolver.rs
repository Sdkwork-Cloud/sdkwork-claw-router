use async_trait::async_trait;
use sdkwork_claw_config::AppSessionConfig;
use sdkwork_iam_web_adapter::IamDatabaseWebRequestContextResolver;
use sdkwork_web_core::{
    WebAuthLevel, WebDeploymentMode, WebEnvironment, WebFrameworkError, WebLoginScope,
    WebRequestContextResolver, WebRequestPrincipal, WebSubjectType,
};

use crate::auth::{
    verify_app_session_token, verify_app_session_token_claims, verify_dual_app_session_token_pair,
    AppSessionTokenClaims, AppSessionTokenKind, TrustedRequestSubject,
};

/// Claw Router web-framework resolver that accepts signed v2 app-session bootstrap tokens
/// before delegating to the IAM database resolver.
#[derive(Clone)]
pub struct ClawRouterWebRequestContextResolver {
    iam: IamDatabaseWebRequestContextResolver,
    app_session: AppSessionConfig,
}

impl ClawRouterWebRequestContextResolver {
    pub fn new(
        iam: IamDatabaseWebRequestContextResolver,
        app_session: AppSessionConfig,
    ) -> Self {
        Self { iam, app_session }
    }

    pub async fn from_env() -> Result<Self, String> {
        let iam = sdkwork_iam_web_adapter::iam_database_resolver_from_env().await;
        let app_session = AppSessionConfig::from_env()
            .map_err(|error| error.to_string())?
            .ok_or_else(|| {
                format!(
                    "{} is required for claw router web framework bootstrap access tokens",
                    AppSessionConfig::ENV_APP_SESSION_SECRET
                )
            })?;
        Ok(Self::new(iam, app_session))
    }
}

#[async_trait]
impl WebRequestContextResolver for ClawRouterWebRequestContextResolver {
    async fn resolve_api_key(
        &self,
        raw_api_key: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        self.iam.resolve_api_key(raw_api_key).await
    }

    async fn resolve_oauth_bearer(
        &self,
        raw_bearer_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        self.iam.resolve_oauth_bearer(raw_bearer_token).await
    }

    async fn resolve_dual_token(
        &self,
        raw_auth_token: &str,
        raw_access_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        if let Some(principal) = resolve_claw_dual_token(
            &self.app_session,
            raw_auth_token,
            raw_access_token,
            current_unix_seconds(),
        ) {
            return Ok(principal);
        }
        self.iam
            .resolve_dual_token(raw_auth_token, raw_access_token)
            .await
    }

    async fn resolve_access_token(
        &self,
        raw_access_token: &str,
    ) -> Result<WebRequestPrincipal, WebFrameworkError> {
        if let Some(principal) =
            resolve_claw_access_token(&self.app_session, raw_access_token, current_unix_seconds())
        {
            return Ok(principal);
        }
        self.iam.resolve_access_token(raw_access_token).await
    }
}

fn resolve_claw_access_token(
    config: &AppSessionConfig,
    raw_access_token: &str,
    now_unix_seconds: i64,
) -> Option<WebRequestPrincipal> {
    let token = strip_optional_bearer_prefix(raw_access_token)?;
    if let Ok(claims) = verify_app_session_token_claims(config, token, now_unix_seconds) {
        if claims.token_kind == AppSessionTokenKind::Access {
            return Some(web_principal_from_app_session_claims(&claims));
        }
    }
    verify_app_session_token(config, token, now_unix_seconds)
        .ok()
        .map(|subject| web_principal_from_trusted_subject(&subject))
}

fn resolve_claw_dual_token(
    config: &AppSessionConfig,
    raw_auth_token: &str,
    raw_access_token: &str,
    now_unix_seconds: i64,
) -> Option<WebRequestPrincipal> {
    let subject = verify_dual_app_session_token_pair(
        config,
        raw_auth_token,
        raw_access_token,
        now_unix_seconds,
    )
    .ok()?;
    Some(web_principal_from_trusted_subject(&subject))
}

fn web_principal_from_app_session_claims(claims: &AppSessionTokenClaims) -> WebRequestPrincipal {
    WebRequestPrincipal::builder()
        .tenant_id(claims.tenant_id.to_string())
        .organization_id((claims.organization_id > 0).then(|| claims.organization_id.to_string()))
        .user_id(claims.user_id.to_string())
        .session_id(Some(claims.session_id.clone()))
        .app_id(claims.app_id.clone())
        .login_scope(parse_login_scope(&claims.login_scope, claims.organization_id))
        .environment(parse_environment(&claims.environment))
        .deployment_mode(parse_deployment_mode(&claims.deployment_mode))
        .auth_level(parse_auth_level(&claims.auth_level))
        .data_scope(claims.data_scope.clone())
        .permission_scope(claims.permission_scope.clone())
        .subject_type(WebSubjectType::User)
        .build()
}

fn web_principal_from_trusted_subject(subject: &TrustedRequestSubject) -> WebRequestPrincipal {
    WebRequestPrincipal::builder()
        .tenant_id(subject.tenant_id.to_string())
        .organization_id((subject.organization_id > 0).then(|| subject.organization_id.to_string()))
        .user_id(subject.user_id.to_string())
        .login_scope(if subject.organization_id > 0 {
            WebLoginScope::Organization
        } else {
            WebLoginScope::Tenant
        })
        .auth_level(WebAuthLevel::Password)
        .subject_type(WebSubjectType::User)
        .build()
}

fn parse_login_scope(login_scope: &str, organization_id: i64) -> WebLoginScope {
    match login_scope.trim().to_ascii_uppercase().as_str() {
        "ORGANIZATION" if organization_id > 0 => WebLoginScope::Organization,
        _ => WebLoginScope::Tenant,
    }
}

fn parse_environment(value: &str) -> WebEnvironment {
    match value.trim().to_ascii_lowercase().as_str() {
        "dev" | "development" => WebEnvironment::Dev,
        "test" => WebEnvironment::Test,
        _ => WebEnvironment::Prod,
    }
}

fn parse_deployment_mode(value: &str) -> WebDeploymentMode {
    match value.trim().to_ascii_lowercase().as_str() {
        "local" => WebDeploymentMode::Local,
        "private" => WebDeploymentMode::Private,
        _ => WebDeploymentMode::Saas,
    }
}

fn parse_auth_level(value: &str) -> WebAuthLevel {
    match value.trim().to_ascii_lowercase().as_str() {
        "anonymous" => WebAuthLevel::Anonymous,
        "mfa" => WebAuthLevel::Mfa,
        "system" => WebAuthLevel::System,
        _ => WebAuthLevel::Password,
    }
}

fn strip_optional_bearer_prefix(raw: &str) -> Option<&str> {
    let trimmed = raw.trim();
    if trimmed.is_empty() {
        return None;
    }
    trimmed
        .strip_prefix("Bearer ")
        .or_else(|| trimmed.strip_prefix("bearer "))
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .or(Some(trimmed))
}

fn current_unix_seconds() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::auth::{
        sign_app_session_token, sign_app_session_token_with_claims, AppSessionTokenClaims,
        AppSessionTokenKind,
    };
    use sdkwork_claw_config::AppSessionConfig;

    const TEST_SECRET: &str = "sdkwork-clawrouter-local-dev-secret-20260507";

    fn test_config() -> AppSessionConfig {
        AppSessionConfig::from_signing_secret(TEST_SECRET).unwrap()
    }

    fn test_subject() -> TrustedRequestSubject {
        TrustedRequestSubject {
            tenant_id: 100_001,
            organization_id: 0,
            user_id: 30,
            operator_id: 30,
            operator_type: crate::auth::DEFAULT_USER_OPERATOR_TYPE,
        }
    }

    #[test]
    fn resolve_claw_access_token_accepts_signed_bootstrap_access_claim_token() {
        let config = test_config();
        let now = 1_800_000_000_i64;
        let claims = AppSessionTokenClaims {
            token_kind: AppSessionTokenKind::Access,
            tenant_id: 100_001,
            organization_id: 0,
            user_id: 30,
            session_id: "bootstrap-local-dev".to_owned(),
            app_id: "sdkwork-clawrouter".to_owned(),
            login_scope: "TENANT".to_owned(),
            environment: "dev".to_owned(),
            deployment_mode: "local".to_owned(),
            auth_level: "password".to_owned(),
            data_scope: vec!["tenant:100001".to_owned(), "user:30".to_owned()],
            permission_scope: vec!["clawrouter:console".to_owned()],
            issued_at: now + 1,
            expires_at: now + 300,
        };
        let token = sign_app_session_token_with_claims(&config, &claims);
        let principal = resolve_claw_access_token(&config, &token, now + 2).expect("principal");
        assert_eq!("100001", principal.tenant_id());
        assert_eq!("30", principal.user_id());
        assert_eq!("sdkwork-clawrouter", principal.app_id());
    }

    #[test]
    fn resolve_claw_access_token_accepts_legacy_subject_access_token() {
        let config = test_config();
        let now = 1_800_000_000_i64;
        let token = sign_app_session_token(&config, test_subject(), now + 1, now + 300);
        let principal = resolve_claw_access_token(&config, &token, now + 2).expect("principal");
        assert_eq!("100001", principal.tenant_id());
        assert_eq!("30", principal.user_id());
    }
}
