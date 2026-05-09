use crate::domain::DomainResult;

pub trait ProviderSecretResolver {
    fn resolve_bearer_token(&self, secret_ref: &str) -> DomainResult<String>;
}
