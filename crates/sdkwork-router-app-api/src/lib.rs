#![forbid(unsafe_code)]

mod local_auth_runtime;
pub mod manifest;
pub mod paths;
pub mod routes;

pub use manifest::{route_manifest, RouterApiRouteManifest};
pub use routes::*;
