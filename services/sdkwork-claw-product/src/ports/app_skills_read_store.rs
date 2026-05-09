use std::future::Future;
use std::pin::Pin;

use serde::Serialize;
use serde_json::Value;

use crate::domain::DomainResult;

pub type AppSkillsReadFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;
pub type AppSkillsCommandFuture<'a, T> = Pin<Box<dyn Future<Output = DomainResult<T>> + Send + 'a>>;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AppSkillsSubject {
    pub tenant_id: i64,
    pub organization_id: i64,
    pub user_id: i64,
}

#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct AppSkillsQuery {
    pub keyword: Option<String>,
    pub page_no: Option<i64>,
    pub page_size: Option<i64>,
    pub status: Option<String>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppSkillsItems<T> {
    pub items: Vec<T>,
}

impl<T> AppSkillsItems<T> {
    pub fn new(items: Vec<T>) -> Self {
        Self { items }
    }
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppSkillItem {
    pub id: String,
    pub name: String,
    pub developer: String,
    pub description: String,
    pub category: String,
    pub image: String,
    pub rating: f64,
    pub downloads: String,
    pub features: Vec<String>,
    pub last_updated: String,
    pub clawhub_image: String,
    pub version: String,
    pub size: String,
    pub license: String,
    pub frameworks: Vec<String>,
    pub screenshots: Vec<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub packages: Vec<AppSkillPackageItem>,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppInstalledSkillItem {
    pub id: String,
    pub skill_id: String,
    pub enabled: bool,
    pub config: Value,
    pub installed_at: String,
    pub last_enabled_at: String,
    pub skill: AppSkillItem,
}

#[derive(Debug, Clone, Default, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AppSkillPackageItem {
    pub id: String,
    pub version: String,
    pub artifact_ref: String,
    pub artifact_size_bytes: i64,
    pub frameworks: Vec<String>,
    pub license_name: String,
    pub published_at: String,
}

pub trait AppSkillsReadStore {
    fn load_skills<'a>(
        &'a self,
        query: AppSkillsQuery,
        subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<AppSkillItem>>;

    fn load_skill_by_id<'a>(
        &'a self,
        skill_id: String,
        subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Option<AppSkillItem>>;

    fn load_categories<'a>(
        &'a self,
        subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<String>>;

    fn load_user_skills<'a>(
        &'a self,
        subject: Option<AppSkillsSubject>,
    ) -> AppSkillsReadFuture<'a, Vec<AppInstalledSkillItem>>;
}

#[derive(Debug, Clone, PartialEq)]
pub struct EnableAppSkillCommand {
    pub subject: AppSkillsSubject,
    pub skill_id: String,
    pub install_uuid: String,
    pub config: Option<Value>,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct SetAppSkillEnabledCommand {
    pub subject: AppSkillsSubject,
    pub skill_id: String,
    pub enabled: bool,
    pub requested_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct UpdateAppSkillConfigCommand {
    pub subject: AppSkillsSubject,
    pub skill_id: String,
    pub config: Value,
    pub requested_at: String,
}

pub trait AppSkillsCommandStore {
    fn enable_skill<'a>(
        &'a self,
        command: EnableAppSkillCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem>;

    fn set_skill_enabled<'a>(
        &'a self,
        command: SetAppSkillEnabledCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem>;

    fn update_skill_config<'a>(
        &'a self,
        command: UpdateAppSkillConfigCommand,
    ) -> AppSkillsCommandFuture<'a, AppInstalledSkillItem>;
}
