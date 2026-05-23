use sdkwork_commerce_core::{CommerceMoney, CommerceServiceError};

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RechargePackageItem {
    pub id: String,
    pub rmb: CommerceMoney,
    pub bonus: i64,
    pub points: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CreatePointsRechargeOrderOutcome {
    pub success: bool,
    pub order_no: String,
    pub amount: CommerceMoney,
    pub points: i64,
    pub payment_method: String,
    pub status: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CheckoutStatusSnapshot {
    pub order_no: String,
    pub out_trade_no: String,
    pub amount: CommerceMoney,
    pub points: i64,
    pub payment_method: String,
    pub order_status: String,
    pub payment_status: String,
    pub recharge_status: String,
    pub status: String,
    pub created_at: String,
    pub expires_at: String,
    pub paid_at: String,
    pub next_action: String,
    pub qr_code_payload: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PaymentRecordItem {
    pub id: String,
    pub order_no: String,
    pub method: String,
    pub amount: CommerceMoney,
    pub date: String,
    pub status: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PaymentIntentDraft {
    pub amount: CommerceMoney,
    pub idempotency_key: String,
    pub order_id: String,
    pub provider: String,
    pub tenant_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum PaymentStatus {
    Created,
    Pending,
    Succeeded,
    Failed,
    Closed,
    Refunding,
    Refunded,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PaymentTransition {
    from: PaymentStatus,
    to: PaymentStatus,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum RefundStatus {
    Requested,
    Processing,
    Succeeded,
    Failed,
    Closed,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RefundTransition {
    from: RefundStatus,
    to: RefundStatus,
}

impl RechargePackageItem {
    pub fn new(
        id: &str,
        rmb: CommerceMoney,
        bonus: i64,
        points: i64,
    ) -> Result<Self, CommerceServiceError> {
        crate::validation::require_non_empty("id", id)?;
        if bonus < 0 {
            return Err(CommerceServiceError::validation(
                "recharge bonus points must be non-negative",
            ));
        }
        if points < 0 {
            return Err(CommerceServiceError::validation(
                "recharge points must be non-negative",
            ));
        }

        Ok(Self {
            id: id.trim().to_string(),
            rmb,
            bonus,
            points,
        })
    }
}

impl PaymentRecordItem {
    pub fn new(
        id: &str,
        order_no: &str,
        method: &str,
        amount: CommerceMoney,
        date: &str,
        status: &str,
    ) -> Result<Self, CommerceServiceError> {
        crate::validation::require_non_empty("id", id)?;
        crate::validation::require_non_empty("order_no", order_no)?;
        crate::validation::require_non_empty("method", method)?;
        crate::validation::require_non_empty("date", date)?;
        crate::validation::require_non_empty("status", status)?;

        Ok(Self {
            id: id.trim().to_string(),
            order_no: order_no.trim().to_string(),
            method: method.trim().to_string(),
            amount,
            date: date.trim().to_string(),
            status: status.trim().to_string(),
        })
    }
}

impl PaymentIntentDraft {
    pub fn new(
        tenant_id: &str,
        order_id: &str,
        provider: &str,
        amount: CommerceMoney,
        idempotency_key: &str,
    ) -> Result<Self, CommerceServiceError> {
        crate::validation::require_non_empty("tenant_id", tenant_id)?;
        crate::validation::require_non_empty("order_id", order_id)?;
        if provider.trim().is_empty() {
            return Err(CommerceServiceError::provider_unavailable(
                "payment provider is required",
            ));
        }
        crate::validation::require_non_empty("idempotency_key", idempotency_key)?;

        Ok(Self {
            amount,
            idempotency_key: idempotency_key.to_string(),
            order_id: order_id.to_string(),
            provider: provider.to_string(),
            tenant_id: tenant_id.to_string(),
        })
    }
}

impl PaymentTransition {
    pub fn new(from: PaymentStatus, to: PaymentStatus) -> Self {
        Self { from, to }
    }

    pub fn validate(&self) -> Result<(), CommerceServiceError> {
        match (&self.from, &self.to) {
            (PaymentStatus::Created, PaymentStatus::Pending)
            | (PaymentStatus::Pending, PaymentStatus::Succeeded)
            | (PaymentStatus::Pending, PaymentStatus::Failed)
            | (PaymentStatus::Pending, PaymentStatus::Closed)
            | (PaymentStatus::Succeeded, PaymentStatus::Refunding)
            | (PaymentStatus::Refunding, PaymentStatus::Refunded) => Ok(()),
            _ => Err(CommerceServiceError::invalid_state(
                "invalid payment status transition",
            )),
        }
    }
}

impl RefundTransition {
    pub fn new(from: RefundStatus, to: RefundStatus) -> Self {
        Self { from, to }
    }

    pub fn validate(&self) -> Result<(), CommerceServiceError> {
        match (&self.from, &self.to) {
            (RefundStatus::Requested, RefundStatus::Processing)
            | (RefundStatus::Processing, RefundStatus::Succeeded)
            | (RefundStatus::Processing, RefundStatus::Failed)
            | (RefundStatus::Requested, RefundStatus::Closed) => Ok(()),
            _ => Err(CommerceServiceError::invalid_state(
                "invalid refund status transition",
            )),
        }
    }
}
