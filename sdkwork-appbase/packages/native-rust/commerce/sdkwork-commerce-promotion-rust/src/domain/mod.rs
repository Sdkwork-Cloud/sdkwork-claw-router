use sdkwork_commerce_core::{CommerceMoney, CommerceServiceError};

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CouponDiscount {
    FixedAmount(CommerceMoney),
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CouponTemplateDraft {
    pub discount: CouponDiscount,
    pub template_id: String,
    pub tenant_id: String,
    pub title: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CouponStatus {
    Draft,
    Active,
    Redeemed,
    Expired,
    Disabled,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CouponTransition {
    from: CouponStatus,
    to: CouponStatus,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CouponClaimDraft {
    pub idempotency_key: String,
    pub owner_user_id: String,
    pub template_id: String,
    pub tenant_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CouponRedemptionDraft {
    pub coupon_id: String,
    pub idempotency_key: String,
    pub order_id: String,
    pub owner_user_id: String,
    pub tenant_id: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CurrentUserCouponItem {
    pub id: String,
    pub code: String,
    pub amount: CommerceMoney,
    pub date: String,
    pub status: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PointsBalance {
    pub available_points: i64,
    pub frozen_points: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PointsHistoryItem {
    pub id: String,
    pub amount: i64,
    pub direction: String,
    pub balance_after: i64,
    pub business_type: String,
    pub created_at: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AppCommerceExchangeRuleItem {
    pub id: String,
    pub rate: String,
    pub source_asset_type: String,
    pub status: String,
    pub target_asset_type: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RedeemCodeOutcome {
    pub message: String,
    pub amount: CommerceMoney,
    pub credited_points: i64,
    pub balance: i64,
}

impl CouponDiscount {
    pub fn fixed_amount(amount: CommerceMoney) -> Result<Self, CommerceServiceError> {
        if amount.as_str() == "0" || amount.as_str() == "0.0" || amount.as_str() == "0.00" {
            return Err(CommerceServiceError::validation(
                "coupon fixed discount must be greater than zero",
            ));
        }

        Ok(Self::FixedAmount(amount))
    }
}

impl CouponTemplateDraft {
    pub fn new(
        tenant_id: &str,
        template_id: &str,
        title: &str,
        discount: CouponDiscount,
    ) -> Result<Self, CommerceServiceError> {
        crate::validation::require_non_empty("tenant_id", tenant_id)?;
        crate::validation::require_non_empty("template_id", template_id)?;
        crate::validation::require_non_empty("title", title)?;

        Ok(Self {
            discount,
            template_id: template_id.to_string(),
            tenant_id: tenant_id.to_string(),
            title: title.to_string(),
        })
    }
}

impl CouponTransition {
    pub fn new(from: CouponStatus, to: CouponStatus) -> Self {
        Self { from, to }
    }

    pub fn validate(&self) -> Result<(), CommerceServiceError> {
        match (&self.from, &self.to) {
            (CouponStatus::Draft, CouponStatus::Active)
            | (CouponStatus::Active, CouponStatus::Redeemed)
            | (CouponStatus::Active, CouponStatus::Expired)
            | (CouponStatus::Active, CouponStatus::Disabled)
            | (CouponStatus::Draft, CouponStatus::Disabled) => Ok(()),
            _ => Err(CommerceServiceError::invalid_state(
                "invalid coupon status transition",
            )),
        }
    }
}

impl CouponClaimDraft {
    pub fn new(
        tenant_id: &str,
        template_id: &str,
        owner_user_id: &str,
        idempotency_key: &str,
    ) -> Result<Self, CommerceServiceError> {
        crate::validation::require_non_empty("tenant_id", tenant_id)?;
        crate::validation::require_non_empty("template_id", template_id)?;
        crate::validation::require_non_empty("owner_user_id", owner_user_id)?;
        crate::validation::require_non_empty("idempotency_key", idempotency_key)?;

        Ok(Self {
            idempotency_key: idempotency_key.to_string(),
            owner_user_id: owner_user_id.to_string(),
            template_id: template_id.to_string(),
            tenant_id: tenant_id.to_string(),
        })
    }
}

impl CouponRedemptionDraft {
    pub fn new(
        tenant_id: &str,
        coupon_id: &str,
        order_id: &str,
        owner_user_id: &str,
        idempotency_key: &str,
    ) -> Result<Self, CommerceServiceError> {
        crate::validation::require_non_empty("tenant_id", tenant_id)?;
        crate::validation::require_non_empty("coupon_id", coupon_id)?;
        crate::validation::require_non_empty("order_id", order_id)?;
        crate::validation::require_non_empty("owner_user_id", owner_user_id)?;
        crate::validation::require_non_empty("idempotency_key", idempotency_key)?;

        Ok(Self {
            coupon_id: coupon_id.to_string(),
            idempotency_key: idempotency_key.to_string(),
            order_id: order_id.to_string(),
            owner_user_id: owner_user_id.to_string(),
            tenant_id: tenant_id.to_string(),
        })
    }
}

impl CurrentUserCouponItem {
    pub fn new(
        id: &str,
        code: &str,
        amount: &str,
        date: &str,
        status: &str,
    ) -> Result<Self, CommerceServiceError> {
        require_non_empty_service("id", id)?;
        require_non_empty_service("code", code)?;
        require_non_empty_service("date", date)?;
        require_non_empty_service("status", status)?;

        Ok(Self {
            id: id.to_string(),
            code: code.to_string(),
            amount: CommerceMoney::new(amount).map_err(CommerceServiceError::validation)?,
            date: date.to_string(),
            status: status.to_string(),
        })
    }
}

impl PointsBalance {
    pub fn new(available_points: i64, frozen_points: i64) -> Result<Self, CommerceServiceError> {
        if available_points < 0 || frozen_points < 0 {
            return Err(CommerceServiceError::validation(
                "points balance must not be negative",
            ));
        }

        Ok(Self {
            available_points,
            frozen_points,
        })
    }
}

impl PointsHistoryItem {
    pub fn new(
        id: &str,
        amount: i64,
        direction: &str,
        balance_after: i64,
        business_type: &str,
        created_at: &str,
    ) -> Result<Self, CommerceServiceError> {
        require_non_empty_service("id", id)?;
        require_non_empty_service("direction", direction)?;
        require_non_empty_service("business_type", business_type)?;
        require_non_empty_service("created_at", created_at)?;
        if amount < 0 || balance_after < 0 {
            return Err(CommerceServiceError::validation(
                "points history amounts must not be negative",
            ));
        }

        Ok(Self {
            id: id.to_string(),
            amount,
            direction: direction.to_string(),
            balance_after,
            business_type: business_type.to_string(),
            created_at: created_at.to_string(),
        })
    }
}

impl AppCommerceExchangeRuleItem {
    pub fn new(
        id: &str,
        source_asset_type: &str,
        target_asset_type: &str,
        rate: &str,
        status: &str,
    ) -> Result<Self, CommerceServiceError> {
        require_non_empty_service("id", id)?;
        require_non_empty_service("source_asset_type", source_asset_type)?;
        require_non_empty_service("target_asset_type", target_asset_type)?;
        require_non_empty_service("rate", rate)?;
        require_non_empty_service("status", status)?;

        Ok(Self {
            id: id.to_string(),
            rate: rate.to_string(),
            source_asset_type: source_asset_type.to_string(),
            status: status.to_string(),
            target_asset_type: target_asset_type.to_string(),
        })
    }
}

impl RedeemCodeOutcome {
    pub fn new(
        message: &str,
        amount: &str,
        credited_points: i64,
        balance: i64,
    ) -> Result<Self, CommerceServiceError> {
        require_non_empty_service("message", message)?;
        if credited_points < 0 || balance < 0 {
            return Err(CommerceServiceError::validation(
                "redeem code outcome points must not be negative",
            ));
        }

        Ok(Self {
            message: message.to_string(),
            amount: CommerceMoney::new(amount).map_err(CommerceServiceError::validation)?,
            credited_points,
            balance,
        })
    }
}

fn require_non_empty_service(field_name: &str, value: &str) -> Result<(), CommerceServiceError> {
    crate::validation::require_non_empty(field_name, value)
}
