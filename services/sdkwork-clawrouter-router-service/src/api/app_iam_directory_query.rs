use serde::Deserialize;

use crate::ports::AppIamDirectoryQuery;

#[derive(Debug, Clone, Default, Deserialize, PartialEq, Eq)]
pub(super) struct AppIamDirectoryHttpQuery {
    #[serde(default, rename = "organization_id")]
    organization_id: Option<String>,
    #[serde(default, rename = "department_id")]
    department_id: Option<String>,
    #[serde(default, rename = "user_id")]
    user_id: Option<String>,
    #[serde(default, rename = "scope_id")]
    scope_id: Option<String>,
    #[serde(default)]
    status: Option<String>,
    #[serde(default)]
    q: Option<String>,
    #[serde(default)]
    page: Option<i64>,
    #[serde(default, rename = "page_size")]
    page_size: Option<i64>,
}

impl AppIamDirectoryHttpQuery {
    pub(super) fn into_port_query(self) -> AppIamDirectoryQuery {
        AppIamDirectoryQuery {
            organization_id: self.organization_id,
            department_id: self.department_id,
            user_id: self.user_id,
            scope_id: self.scope_id,
            status: self.status,
            q: self.q,
            page: self.page,
            page_size: self.page_size,
        }
    }
}
