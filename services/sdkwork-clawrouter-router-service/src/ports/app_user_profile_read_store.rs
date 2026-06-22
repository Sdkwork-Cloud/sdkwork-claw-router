use std::future::Future;
use std::pin::Pin;

pub use sdkwork_clawrouter_app_user_profile_repository_sqlx::{
    AppUserProfileSnapshot, AppUserProfileSubject,
};

use crate::domain::DomainResult;

pub type AppUserProfileReadFuture<'a> =
    Pin<Box<dyn Future<Output = DomainResult<AppUserProfileSnapshot>> + Send + 'a>>;

pub trait AppUserProfileReadStore {
    fn load_user_profile<'a>(
        &'a self,
        subject: Option<AppUserProfileSubject>,
    ) -> AppUserProfileReadFuture<'a>;
}
