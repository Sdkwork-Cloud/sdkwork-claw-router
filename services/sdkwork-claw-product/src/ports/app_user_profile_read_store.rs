use std::future::Future;
use std::pin::Pin;

use serde::Serialize;

use crate::domain::DomainResult;

pub type AppUserProfileReadFuture<'a> =
    Pin<Box<dyn Future<Output = DomainResult<AppUserProfileSnapshot>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppUserProfileSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppUserProfileSnapshot {
    pub id: String,
    pub username: String,
    pub display_name: String,
    pub email: String,
    pub avatar_url: String,
    pub phone: String,
    pub language: String,
    pub is_verified: bool,
    pub status: String,
    pub registered_at: String,
    pub last_login: String,
    pub last_login_ip: String,
    pub password_last_changed: String,
    pub two_factor_enabled: bool,
    pub third_party_bound: String,
}

impl Default for AppUserProfileSnapshot {
    fn default() -> Self {
        Self {
            id: String::new(),
            username: String::new(),
            display_name: String::new(),
            email: String::new(),
            avatar_url: String::new(),
            phone: String::new(),
            language: "en-US".to_owned(),
            is_verified: false,
            status: String::new(),
            registered_at: String::new(),
            last_login: String::new(),
            last_login_ip: String::new(),
            password_last_changed: String::new(),
            two_factor_enabled: false,
            third_party_bound: "0".to_owned(),
        }
    }
}

pub trait AppUserProfileReadStore {
    fn load_user_profile<'a>(
        &'a self,
        subject: Option<AppUserProfileSubject>,
    ) -> AppUserProfileReadFuture<'a>;
}
