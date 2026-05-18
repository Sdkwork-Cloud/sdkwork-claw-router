use std::future::Future;
use std::pin::Pin;

use serde::Serialize;

use crate::domain::DomainResult;

pub type AppMessagesReadFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppMessagesSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppMessageItems<T> {
    pub items: Vec<T>,
}

impl<T> AppMessageItems<T> {
    pub fn new(items: Vec<T>) -> Self {
        Self { items }
    }
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppMessageItem {
    pub id: String,
    pub title: String,
    pub desc: String,
    pub content: String,
    pub time: String,
    #[serde(rename = "type")]
    pub message_type: String,
    pub read: bool,
    pub show_as_popup: bool,
}

pub trait AppMessagesReadStore {
    fn load_messages<'a>(
        &'a self,
        subject: Option<AppMessagesSubject>,
    ) -> AppMessagesReadFuture<'a, Vec<AppMessageItem>>;
}
