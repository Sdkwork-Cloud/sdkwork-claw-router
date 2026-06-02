use std::sync::Arc;

use crate::domain::DomainResult;
use crate::ports::{
    AdminAiResourceItem, AdminAiResourceReadFuture, AdminAiResourceStore,
    AdminChannelCommandFuture, AdminChannelEndpointFuture, AdminChannelEndpointItem,
    AdminChannelEndpointStore, AdminChannelGroupChannelBindingItem, AdminChannelGroupCommandFuture,
    AdminChannelGroupItem, AdminChannelGroupStore, AdminChannelItem, AdminChannelStore,
    AdminChannelTestOutcome, AdminProviderSecretCommandFuture, AdminProviderSecretItem,
    AdminProviderSecretStore, CreateAdminAiResourceCommand, CreateAdminChannelCommand,
    CreateAdminChannelEndpointCommand, CreateAdminChannelGroupCommand,
    CreateAdminProviderSecretCommand, DeleteAdminChannelCommand, DeleteAdminChannelGroupCommand,
    DeleteAdminProviderSecretCommand, ListAdminAiResourcesQuery, ListAdminChannelEndpointsQuery,
    ListAdminChannelGroupChannelBindingsQuery, ListAdminChannelGroupsQuery, ListAdminChannelsQuery,
    ListAdminProviderSecretsQuery, ReplaceAdminChannelGroupChannelBindingsCommand,
    TestAdminChannelCommand, UpdateAdminAiResourceCommand, UpdateAdminChannelCommand,
    UpdateAdminChannelEndpointCommand, UpdateAdminChannelGroupCommand,
    UpdateAdminProviderSecretCommand,
};

use super::{
    RuntimeCacheManager, ROUTING_CONFIG_VERSION_CACHE_NAMESPACE,
    ROUTING_DISABLED_CHANNEL_CACHE_NAMESPACE, ROUTING_SNAPSHOT_CACHE_NAMESPACE,
};

#[derive(Clone)]
pub struct AiRoutingCacheInvalidator {
    manager: RuntimeCacheManager,
}

impl AiRoutingCacheInvalidator {
    pub fn new(manager: RuntimeCacheManager) -> Self {
        Self { manager }
    }

    pub async fn invalidate_routing_facts(&self) -> DomainResult<()> {
        for namespace in [
            ROUTING_SNAPSHOT_CACHE_NAMESPACE,
            ROUTING_CONFIG_VERSION_CACHE_NAMESPACE,
            ROUTING_DISABLED_CHANNEL_CACHE_NAMESPACE,
        ] {
            self.manager.delete_namespace(namespace).await?;
        }
        Ok(())
    }
}

#[derive(Clone)]
pub struct AiRoutingCacheInvalidatingAdminChannelStore {
    inner: Arc<dyn AdminChannelStore + Send + Sync>,
    invalidator: AiRoutingCacheInvalidator,
}

impl AiRoutingCacheInvalidatingAdminChannelStore {
    pub fn new(
        inner: Arc<dyn AdminChannelStore + Send + Sync>,
        manager: RuntimeCacheManager,
    ) -> Self {
        Self {
            inner,
            invalidator: AiRoutingCacheInvalidator::new(manager),
        }
    }
}

impl AdminChannelStore for AiRoutingCacheInvalidatingAdminChannelStore {
    fn list_channels<'a>(
        &'a self,
        query: ListAdminChannelsQuery,
    ) -> AdminChannelCommandFuture<'a, Vec<AdminChannelItem>> {
        self.inner.list_channels(query)
    }

    fn create_channel<'a>(
        &'a self,
        command: CreateAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, AdminChannelItem> {
        Box::pin(async move {
            let item = self.inner.create_channel(command).await?;
            self.invalidator.invalidate_routing_facts().await?;
            Ok(item)
        })
    }

    fn update_channel<'a>(
        &'a self,
        command: UpdateAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, Option<AdminChannelItem>> {
        Box::pin(async move {
            let item = self.inner.update_channel(command).await?;
            if item.is_some() {
                self.invalidator.invalidate_routing_facts().await?;
            }
            Ok(item)
        })
    }

    fn delete_channel<'a>(
        &'a self,
        command: DeleteAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, bool> {
        Box::pin(async move {
            let deleted = self.inner.delete_channel(command).await?;
            if deleted {
                self.invalidator.invalidate_routing_facts().await?;
            }
            Ok(deleted)
        })
    }

    fn test_channel<'a>(
        &'a self,
        command: TestAdminChannelCommand,
    ) -> AdminChannelCommandFuture<'a, Option<AdminChannelTestOutcome>> {
        Box::pin(async move {
            let outcome = self.inner.test_channel(command).await?;
            if outcome.is_some() {
                self.invalidator.invalidate_routing_facts().await?;
            }
            Ok(outcome)
        })
    }
}

#[derive(Clone)]
pub struct AiRoutingCacheInvalidatingAdminAiResourceStore {
    inner: Arc<dyn AdminAiResourceStore + Send + Sync>,
    invalidator: AiRoutingCacheInvalidator,
}

impl AiRoutingCacheInvalidatingAdminAiResourceStore {
    pub fn new(
        inner: Arc<dyn AdminAiResourceStore + Send + Sync>,
        manager: RuntimeCacheManager,
    ) -> Self {
        Self {
            inner,
            invalidator: AiRoutingCacheInvalidator::new(manager),
        }
    }
}

impl AdminAiResourceStore for AiRoutingCacheInvalidatingAdminAiResourceStore {
    fn list_ai_resources<'a>(
        &'a self,
        query: ListAdminAiResourcesQuery,
    ) -> AdminAiResourceReadFuture<'a, Vec<AdminAiResourceItem>> {
        self.inner.list_ai_resources(query)
    }

    fn create_ai_resource<'a>(
        &'a self,
        command: CreateAdminAiResourceCommand,
    ) -> AdminAiResourceReadFuture<'a, AdminAiResourceItem> {
        Box::pin(async move {
            let item = self.inner.create_ai_resource(command).await?;
            self.invalidator.invalidate_routing_facts().await?;
            Ok(item)
        })
    }

    fn update_ai_resource<'a>(
        &'a self,
        command: UpdateAdminAiResourceCommand,
    ) -> AdminAiResourceReadFuture<'a, Option<AdminAiResourceItem>> {
        Box::pin(async move {
            let item = self.inner.update_ai_resource(command).await?;
            if item.is_some() {
                self.invalidator.invalidate_routing_facts().await?;
            }
            Ok(item)
        })
    }
}

#[derive(Clone)]
pub struct AiRoutingCacheInvalidatingAdminChannelGroupStore {
    inner: Arc<dyn AdminChannelGroupStore + Send + Sync>,
    invalidator: AiRoutingCacheInvalidator,
}

impl AiRoutingCacheInvalidatingAdminChannelGroupStore {
    pub fn new(
        inner: Arc<dyn AdminChannelGroupStore + Send + Sync>,
        manager: RuntimeCacheManager,
    ) -> Self {
        Self {
            inner,
            invalidator: AiRoutingCacheInvalidator::new(manager),
        }
    }
}

impl AdminChannelGroupStore for AiRoutingCacheInvalidatingAdminChannelGroupStore {
    fn list_channel_groups<'a>(
        &'a self,
        query: ListAdminChannelGroupsQuery,
    ) -> AdminChannelGroupCommandFuture<'a, Vec<AdminChannelGroupItem>> {
        self.inner.list_channel_groups(query)
    }

    fn create_channel_group<'a>(
        &'a self,
        command: CreateAdminChannelGroupCommand,
    ) -> AdminChannelGroupCommandFuture<'a, AdminChannelGroupItem> {
        Box::pin(async move {
            let item = self.inner.create_channel_group(command).await?;
            self.invalidator.invalidate_routing_facts().await?;
            Ok(item)
        })
    }

    fn update_channel_group<'a>(
        &'a self,
        command: UpdateAdminChannelGroupCommand,
    ) -> AdminChannelGroupCommandFuture<'a, Option<AdminChannelGroupItem>> {
        Box::pin(async move {
            let item = self.inner.update_channel_group(command).await?;
            if item.is_some() {
                self.invalidator.invalidate_routing_facts().await?;
            }
            Ok(item)
        })
    }

    fn delete_channel_group<'a>(
        &'a self,
        command: DeleteAdminChannelGroupCommand,
    ) -> AdminChannelGroupCommandFuture<'a, bool> {
        Box::pin(async move {
            let deleted = self.inner.delete_channel_group(command).await?;
            if deleted {
                self.invalidator.invalidate_routing_facts().await?;
            }
            Ok(deleted)
        })
    }

    fn list_channel_bindings<'a>(
        &'a self,
        query: ListAdminChannelGroupChannelBindingsQuery,
    ) -> AdminChannelGroupCommandFuture<'a, Vec<AdminChannelGroupChannelBindingItem>> {
        self.inner.list_channel_bindings(query)
    }

    fn replace_channel_bindings<'a>(
        &'a self,
        command: ReplaceAdminChannelGroupChannelBindingsCommand,
    ) -> AdminChannelGroupCommandFuture<'a, Vec<AdminChannelGroupChannelBindingItem>> {
        Box::pin(async move {
            let items = self.inner.replace_channel_bindings(command).await?;
            self.invalidator.invalidate_routing_facts().await?;
            Ok(items)
        })
    }
}

#[derive(Clone)]
pub struct AiRoutingCacheInvalidatingAdminChannelEndpointStore {
    inner: Arc<dyn AdminChannelEndpointStore + Send + Sync>,
    invalidator: AiRoutingCacheInvalidator,
}

impl AiRoutingCacheInvalidatingAdminChannelEndpointStore {
    pub fn new(
        inner: Arc<dyn AdminChannelEndpointStore + Send + Sync>,
        manager: RuntimeCacheManager,
    ) -> Self {
        Self {
            inner,
            invalidator: AiRoutingCacheInvalidator::new(manager),
        }
    }
}

impl AdminChannelEndpointStore for AiRoutingCacheInvalidatingAdminChannelEndpointStore {
    fn list_channel_endpoints<'a>(
        &'a self,
        query: ListAdminChannelEndpointsQuery,
    ) -> AdminChannelEndpointFuture<'a, Vec<AdminChannelEndpointItem>> {
        self.inner.list_channel_endpoints(query)
    }

    fn create_channel_endpoint<'a>(
        &'a self,
        command: CreateAdminChannelEndpointCommand,
    ) -> AdminChannelEndpointFuture<'a, Option<AdminChannelEndpointItem>> {
        Box::pin(async move {
            let item = self.inner.create_channel_endpoint(command).await?;
            if item.is_some() {
                self.invalidator.invalidate_routing_facts().await?;
            }
            Ok(item)
        })
    }

    fn update_channel_endpoint<'a>(
        &'a self,
        command: UpdateAdminChannelEndpointCommand,
    ) -> AdminChannelEndpointFuture<'a, Option<AdminChannelEndpointItem>> {
        Box::pin(async move {
            let item = self.inner.update_channel_endpoint(command).await?;
            if item.is_some() {
                self.invalidator.invalidate_routing_facts().await?;
            }
            Ok(item)
        })
    }
}

#[derive(Clone)]
pub struct AiRoutingCacheInvalidatingAdminProviderSecretStore {
    inner: Arc<dyn AdminProviderSecretStore + Send + Sync>,
    invalidator: AiRoutingCacheInvalidator,
}

impl AiRoutingCacheInvalidatingAdminProviderSecretStore {
    pub fn new(
        inner: Arc<dyn AdminProviderSecretStore + Send + Sync>,
        manager: RuntimeCacheManager,
    ) -> Self {
        Self {
            inner,
            invalidator: AiRoutingCacheInvalidator::new(manager),
        }
    }
}

impl AdminProviderSecretStore for AiRoutingCacheInvalidatingAdminProviderSecretStore {
    fn list_provider_secrets<'a>(
        &'a self,
        query: ListAdminProviderSecretsQuery,
    ) -> AdminProviderSecretCommandFuture<'a, Vec<AdminProviderSecretItem>> {
        self.inner.list_provider_secrets(query)
    }

    fn create_provider_secret<'a>(
        &'a self,
        command: CreateAdminProviderSecretCommand,
    ) -> AdminProviderSecretCommandFuture<'a, AdminProviderSecretItem> {
        Box::pin(async move {
            let item = self.inner.create_provider_secret(command).await?;
            self.invalidator.invalidate_routing_facts().await?;
            Ok(item)
        })
    }

    fn update_provider_secret<'a>(
        &'a self,
        command: UpdateAdminProviderSecretCommand,
    ) -> AdminProviderSecretCommandFuture<'a, Option<AdminProviderSecretItem>> {
        Box::pin(async move {
            let item = self.inner.update_provider_secret(command).await?;
            if item.is_some() {
                self.invalidator.invalidate_routing_facts().await?;
            }
            Ok(item)
        })
    }

    fn delete_provider_secret<'a>(
        &'a self,
        command: DeleteAdminProviderSecretCommand,
    ) -> AdminProviderSecretCommandFuture<'a, bool> {
        Box::pin(async move {
            let deleted = self.inner.delete_provider_secret(command).await?;
            if deleted {
                self.invalidator.invalidate_routing_facts().await?;
            }
            Ok(deleted)
        })
    }
}
