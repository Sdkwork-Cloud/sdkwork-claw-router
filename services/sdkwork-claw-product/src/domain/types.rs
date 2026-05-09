mod generated {
    include!(concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../generated/types/rust/domain.rs"
    ));
}

pub use generated::{BillingMeter, IntegrationProviderType, ModelVendor};
