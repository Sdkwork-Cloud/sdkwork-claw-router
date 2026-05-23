#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct IamTables;

impl IamTables {
    pub const TENANT: &'static str = "iam_tenant";
    pub const ORGANIZATION: &'static str = "iam_organization";
    pub const ORGANIZATION_MEMBER: &'static str = "iam_organization_member";
    pub const USER: &'static str = "iam_user";
    pub const USER_IDENTITY: &'static str = "iam_user_identity";
    pub const CREDENTIAL: &'static str = "iam_credential";
    pub const SESSION: &'static str = "iam_session";
    pub const MFA_FACTOR: &'static str = "iam_mfa_factor";
    pub const DEVICE: &'static str = "iam_device";
    pub const ROLE: &'static str = "iam_role";
    pub const PERMISSION: &'static str = "iam_permission";
    pub const POLICY: &'static str = "iam_policy";
    pub const ROLE_PERMISSION: &'static str = "iam_role_permission";
    pub const USER_ROLE: &'static str = "iam_user_role";
    pub const API_KEY: &'static str = "iam_api_key";
    pub const SECURITY_EVENT: &'static str = "iam_security_event";
    pub const AUDIT_EVENT: &'static str = "iam_audit_event";
}

pub const DEFAULT_IAM_TENANT_ID: &str = "10";
pub const DEFAULT_IAM_TENANT_CODE: &str = "default";
pub const DEFAULT_IAM_TENANT_NAME: &str = "Default Tenant";
pub const DEFAULT_IAM_ORGANIZATION_ID: &str = "20";
pub const DEFAULT_IAM_ORGANIZATION_CODE: &str = "root";
pub const DEFAULT_IAM_ORGANIZATION_NAME: &str = "Root Organization";
pub const DEFAULT_IAM_ORGANIZATION_PATH: &str = "/20";
pub const DEFAULT_BOOTSTRAP_ADMIN_USERNAME: &str = "admin";
pub const DEFAULT_BOOTSTRAP_ADMIN_DISPLAY_NAME: &str = "Administrator";
pub const DEFAULT_BOOTSTRAP_ADMIN_EMAIL: &str = "admin@sdkwork.com";

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct IamBootstrapSubject {
    pub tenant_id: &'static str,
    pub tenant_code: &'static str,
    pub tenant_name: &'static str,
    pub organization_id: &'static str,
    pub organization_code: &'static str,
    pub organization_name: &'static str,
    pub organization_path: &'static str,
    pub admin_username: &'static str,
    pub admin_display_name: &'static str,
    pub admin_email: &'static str,
}

impl Default for IamBootstrapSubject {
    fn default() -> Self {
        Self {
            tenant_id: DEFAULT_IAM_TENANT_ID,
            tenant_code: DEFAULT_IAM_TENANT_CODE,
            tenant_name: DEFAULT_IAM_TENANT_NAME,
            organization_id: DEFAULT_IAM_ORGANIZATION_ID,
            organization_code: DEFAULT_IAM_ORGANIZATION_CODE,
            organization_name: DEFAULT_IAM_ORGANIZATION_NAME,
            organization_path: DEFAULT_IAM_ORGANIZATION_PATH,
            admin_username: DEFAULT_BOOTSTRAP_ADMIN_USERNAME,
            admin_display_name: DEFAULT_BOOTSTRAP_ADMIN_DISPLAY_NAME,
            admin_email: DEFAULT_BOOTSTRAP_ADMIN_EMAIL,
        }
    }
}

pub fn iam_database_tables() -> Vec<&'static str> {
    vec![
        IamTables::TENANT,
        IamTables::ORGANIZATION,
        IamTables::ORGANIZATION_MEMBER,
        IamTables::USER,
        IamTables::USER_IDENTITY,
        IamTables::CREDENTIAL,
        IamTables::SESSION,
        IamTables::MFA_FACTOR,
        IamTables::DEVICE,
        IamTables::ROLE,
        IamTables::PERMISSION,
        IamTables::POLICY,
        IamTables::ROLE_PERMISSION,
        IamTables::USER_ROLE,
        IamTables::API_KEY,
        IamTables::SECURITY_EVENT,
        IamTables::AUDIT_EVENT,
    ]
}

pub fn iam_initial_migration_sql() -> &'static str {
    include_str!("../migrations/0001_iam_foundation.sql")
}
