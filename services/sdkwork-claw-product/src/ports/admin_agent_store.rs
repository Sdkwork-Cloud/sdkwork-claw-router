use std::future::Future;
use std::pin::Pin;

use crate::domain::DomainResult;
use crate::ports::AppAgentItem;

pub type AdminAgentReadFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AdminAgentSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub operator_id: i64,
    pub operator_type: i32,
}

impl Default for AdminAgentSubject {
    fn default() -> Self {
        Self {
            tenant_id: 0,
            organization_id: 0,
            operator_id: 0,
            operator_type: 0,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ListAdminAgentsQuery {
    pub subject: AdminAgentSubject,
    pub keyword: Option<String>,
    pub owner_user_id: Option<i64>,
    pub status: Option<String>,
    pub visibility: Option<String>,
    pub page_no: i64,
    pub page_size: i64,
    pub offset: i64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GetAdminAgentQuery {
    pub subject: AdminAgentSubject,
    pub agent_id: String,
}

pub trait AdminAgentStore {
    fn list_agents<'a>(
        &'a self,
        query: ListAdminAgentsQuery,
    ) -> AdminAgentReadFuture<'a, Vec<AppAgentItem>>;

    fn get_agent<'a>(
        &'a self,
        query: GetAdminAgentQuery,
    ) -> AdminAgentReadFuture<'a, Option<AppAgentItem>>;
}
