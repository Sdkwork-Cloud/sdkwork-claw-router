#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceListQuery {
    pub owner_user_id: String,
    pub tenant_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct InvoiceDetailQuery {
    pub invoice_id: String,
    pub tenant_id: String,
}
