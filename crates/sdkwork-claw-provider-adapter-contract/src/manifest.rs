use serde::{Deserialize, Serialize};

use crate::endpoint::AdapterInvocationShape;

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ProviderAdapterManifest {
    #[serde(default)]
    pub providers: Vec<ProviderAdapterProviderManifest>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ProviderAdapterProviderManifest {
    pub package: String,
    pub provider_family: String,
    #[serde(default)]
    pub provider_codes: Vec<String>,
    #[serde(default)]
    pub endpoints: Vec<ProviderAdapterEndpointManifest>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ProviderAdapterEndpointManifest {
    pub endpoint_key: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub capability: Option<String>,
    pub method: String,
    pub standard_path_pattern: String,
    pub invocation_shape: AdapterInvocationShape,
}
