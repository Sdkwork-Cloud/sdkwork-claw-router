#![forbid(unsafe_code)]

pub mod manifest;
pub mod paths;
pub mod routes;
mod http_route_manifest;
mod web_bootstrap;

pub use manifest::{route_manifest, RouterApiRouteManifest};
pub use routes::*;
pub use web_bootstrap::{finalize_served_router, maybe_wrap_router_with_web_framework};
