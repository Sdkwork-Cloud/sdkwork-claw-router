use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

pub type ReadinessCheckFn =
    Arc<dyn Fn() -> Pin<Box<dyn Future<Output = bool> + Send>> + Send + Sync>;
