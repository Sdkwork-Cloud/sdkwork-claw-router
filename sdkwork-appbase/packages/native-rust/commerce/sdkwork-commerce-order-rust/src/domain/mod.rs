use sdkwork_commerce_core::{CommerceMoney, CommerceServiceError};

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OrderItemDraft {
    pub quantity: u32,
    pub sku_id: String,
    pub title: String,
    pub unit_price: CommerceMoney,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OrderAmountBreakdown {
    pub discount_amount: CommerceMoney,
    pub original_amount: CommerceMoney,
    pub payable_amount: CommerceMoney,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum OrderStatus {
    Draft,
    PendingPayment,
    Paid,
    Fulfilled,
    Completed,
    Cancelled,
    Expired,
    Refunding,
    Refunded,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct OrderTransition {
    from: OrderStatus,
    to: OrderStatus,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PaidOrderReference {
    pub order_id: String,
    pub payment_id: String,
}

impl OrderItemDraft {
    pub fn new(
        sku_id: &str,
        title: &str,
        quantity: u32,
        unit_price: CommerceMoney,
    ) -> Result<Self, CommerceServiceError> {
        crate::validation::require_non_empty("sku_id", sku_id)?;
        crate::validation::require_non_empty("title", title)?;
        if quantity == 0 {
            return Err(CommerceServiceError::validation(
                "quantity must be greater than zero",
            ));
        }

        Ok(Self {
            quantity,
            sku_id: sku_id.to_string(),
            title: title.to_string(),
            unit_price,
        })
    }
}

impl OrderAmountBreakdown {
    pub fn from_items(
        items: Vec<OrderItemDraft>,
        discount_amount: CommerceMoney,
    ) -> Result<Self, CommerceServiceError> {
        if items.is_empty() {
            return Err(CommerceServiceError::validation(
                "order requires at least one item",
            ));
        }

        let total_cents = items
            .iter()
            .map(|item| money_to_cents(item.unit_price.as_str()) * i64::from(item.quantity))
            .sum::<i64>();
        let discount_cents = money_to_cents(discount_amount.as_str());
        if discount_cents > total_cents {
            return Err(CommerceServiceError::validation(
                "discount cannot exceed original amount",
            ));
        }

        Ok(Self {
            discount_amount,
            original_amount: cents_to_money(total_cents),
            payable_amount: cents_to_money(total_cents - discount_cents),
        })
    }
}

impl OrderStatus {
    pub fn can_cancel(&self) -> bool {
        matches!(self, Self::PendingPayment)
    }

    pub fn can_expire(&self) -> bool {
        matches!(self, Self::PendingPayment)
    }
}

impl OrderTransition {
    pub fn new(from: OrderStatus, to: OrderStatus) -> Self {
        Self { from, to }
    }

    pub fn validate(&self) -> Result<(), CommerceServiceError> {
        match (&self.from, &self.to) {
            (OrderStatus::Draft, OrderStatus::PendingPayment)
            | (OrderStatus::PendingPayment, OrderStatus::Paid)
            | (OrderStatus::Paid, OrderStatus::Fulfilled)
            | (OrderStatus::Fulfilled, OrderStatus::Completed)
            | (OrderStatus::PendingPayment, OrderStatus::Cancelled)
            | (OrderStatus::PendingPayment, OrderStatus::Expired)
            | (OrderStatus::Paid, OrderStatus::Refunding)
            | (OrderStatus::Refunding, OrderStatus::Refunded) => Ok(()),
            _ => Err(CommerceServiceError::invalid_state(
                "invalid order status transition",
            )),
        }
    }
}

impl PaidOrderReference {
    pub fn new(order_id: &str, payment_id: &str) -> Result<Self, CommerceServiceError> {
        crate::validation::require_non_empty("order_id", order_id)?;
        crate::validation::require_non_empty("payment_id", payment_id)?;

        Ok(Self {
            order_id: order_id.to_string(),
            payment_id: payment_id.to_string(),
        })
    }
}

fn money_to_cents(value: &str) -> i64 {
    let mut parts = value.split('.');
    let integer = parts.next().unwrap_or("0").parse::<i64>().unwrap_or(0);
    let fraction = parts.next().unwrap_or("0");
    let cents = match fraction.len() {
        0 => 0,
        1 => fraction.parse::<i64>().unwrap_or(0) * 10,
        _ => fraction[..2].parse::<i64>().unwrap_or(0),
    };
    integer * 100 + cents
}

fn cents_to_money(cents: i64) -> CommerceMoney {
    CommerceMoney::new(&format!("{}.{:02}", cents / 100, cents % 100))
        .expect("computed money should be valid")
}
