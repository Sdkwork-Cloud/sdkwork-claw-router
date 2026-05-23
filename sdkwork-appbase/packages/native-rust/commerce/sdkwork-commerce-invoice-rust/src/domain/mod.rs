use sdkwork_commerce_core::CommerceServiceError;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceTitle {
    pub name: String,
    pub tax_no: Option<String>,
    pub title_type: InvoiceTitleType,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum InvoiceTitleType {
    Company,
    Personal,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum InvoiceStatus {
    Draft,
    Submitted,
    Reviewing,
    Issued,
    Cancelled,
    Rejected,
    Voided,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceTransition {
    from: InvoiceStatus,
    to: InvoiceStatus,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceApplicationDraft {
    pub order_id: String,
    pub payment_id: String,
    pub tenant_id: String,
    pub title_id: String,
}

impl InvoiceTitle {
    pub fn company(name: &str, tax_no: &str) -> Result<Self, CommerceServiceError> {
        crate::validation::require_non_empty("invoice title name", name)?;
        crate::validation::require_non_empty("company tax_no", tax_no)?;

        Ok(Self {
            name: name.to_string(),
            tax_no: Some(tax_no.to_string()),
            title_type: InvoiceTitleType::Company,
        })
    }
}

impl InvoiceTransition {
    pub fn new(from: InvoiceStatus, to: InvoiceStatus) -> Self {
        Self { from, to }
    }

    pub fn validate(&self) -> Result<(), CommerceServiceError> {
        match (&self.from, &self.to) {
            (InvoiceStatus::Draft, InvoiceStatus::Submitted)
            | (InvoiceStatus::Submitted, InvoiceStatus::Reviewing)
            | (InvoiceStatus::Reviewing, InvoiceStatus::Issued)
            | (InvoiceStatus::Submitted, InvoiceStatus::Cancelled)
            | (InvoiceStatus::Reviewing, InvoiceStatus::Rejected)
            | (InvoiceStatus::Issued, InvoiceStatus::Voided) => Ok(()),
            _ => Err(CommerceServiceError::invalid_state(
                "invalid invoice status transition",
            )),
        }
    }
}

impl InvoiceApplicationDraft {
    pub fn new(
        tenant_id: &str,
        order_id: &str,
        payment_id: &str,
        title_id: &str,
    ) -> Result<Self, CommerceServiceError> {
        crate::validation::require_non_empty("tenant_id", tenant_id)?;
        crate::validation::require_non_empty("order_id", order_id)?;
        crate::validation::require_non_empty("payment_id", payment_id)?;
        crate::validation::require_non_empty("title_id", title_id)?;

        Ok(Self {
            order_id: order_id.to_string(),
            payment_id: payment_id.to_string(),
            tenant_id: tenant_id.to_string(),
            title_id: title_id.to_string(),
        })
    }
}
