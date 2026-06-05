#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Environment {
    Dev,
    Test,
    Prod,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DeploymentMode {
    Saas,
    Local,
    Private,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum AuthLevel {
    Anonymous,
    Password,
    Mfa,
    System,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum IamShardingStrategy {
    Tenant,
    Organization,
    User,
    Single,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IamAppContext {
    pub tenant_id: String,
    pub organization_id: Option<String>,
    pub user_id: String,
    pub session_id: String,
    pub app_id: String,
    pub environment: Environment,
    pub deployment_mode: DeploymentMode,
    pub auth_level: AuthLevel,
    pub data_scope: Vec<String>,
    pub permission_scope: Vec<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IamShardingContext {
    pub sharding_key: String,
    pub sharding_strategy: IamShardingStrategy,
    pub database_key: Option<String>,
    pub schema: Option<String>,
    pub table_partition: Option<String>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IamSessionTokens {
    pub access_token: String,
    pub auth_token: String,
    pub refresh_token: Option<String>,
    pub context: IamAppContext,
}

impl IamAppContext {
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        tenant_id: impl Into<String>,
        organization_id: Option<&str>,
        user_id: impl Into<String>,
        session_id: impl Into<String>,
        app_id: impl Into<String>,
        environment: Environment,
        deployment_mode: DeploymentMode,
        auth_level: AuthLevel,
        data_scope: Vec<String>,
        permission_scope: Vec<String>,
    ) -> Self {
        Self {
            tenant_id: tenant_id.into(),
            organization_id: organization_id.map(str::to_string),
            user_id: user_id.into(),
            session_id: session_id.into(),
            app_id: app_id.into(),
            environment,
            deployment_mode,
            auth_level,
            data_scope,
            permission_scope,
        }
    }
}

impl IamShardingContext {
    pub fn from_app_context(context: &IamAppContext) -> Self {
        if let Some(organization_id) = context.organization_id.as_ref() {
            if !organization_id.trim().is_empty() {
                return Self {
                    sharding_key: organization_id.clone(),
                    sharding_strategy: IamShardingStrategy::Organization,
                    database_key: None,
                    schema: None,
                    table_partition: None,
                };
            }
        }

        if !context.tenant_id.trim().is_empty() {
            return Self {
                sharding_key: context.tenant_id.clone(),
                sharding_strategy: IamShardingStrategy::Tenant,
                database_key: None,
                schema: None,
                table_partition: None,
            };
        }

        if !context.user_id.trim().is_empty() {
            return Self {
                sharding_key: context.user_id.clone(),
                sharding_strategy: IamShardingStrategy::User,
                database_key: None,
                schema: None,
                table_partition: None,
            };
        }

        Self {
            sharding_key: context.app_id.clone(),
            sharding_strategy: IamShardingStrategy::Single,
            database_key: None,
            schema: None,
            table_partition: None,
        }
    }
}

pub fn validate_dual_token_context(
    tokens: &IamSessionTokens,
    request_context: &IamAppContext,
) -> Result<(), &'static str> {
    if tokens.auth_token.trim().is_empty() {
        return Err("auth token is required");
    }

    if tokens.access_token.trim().is_empty() {
        return Err("access token is required");
    }

    if &tokens.context != request_context {
        return Err("access token context does not match request context");
    }

    Ok(())
}
