use serde::{Deserialize, Serialize};

/// Commerce product sku attribute item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductSkuAttributeItem {
    /// Attribute id field on commerce product sku attribute item.
    #[serde(rename = "attributeId")]
    pub attribute_id: String,

    /// Attribute name field on commerce product sku attribute item.
    #[serde(rename = "attributeName")]
    pub attribute_name: String,

    /// Attribute value id field on commerce product sku attribute item.
    #[serde(rename = "attributeValueId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub attribute_value_id: Option<String>,

    /// Custom value field on commerce product sku attribute item.
    #[serde(rename = "customValue")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub custom_value: Option<String>,

    /// Display value field on commerce product sku attribute item.
    #[serde(rename = "displayValue")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub display_value: Option<String>,

    /// Value code field on commerce product sku attribute item.
    #[serde(rename = "valueCode")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub value_code: Option<String>,
}
