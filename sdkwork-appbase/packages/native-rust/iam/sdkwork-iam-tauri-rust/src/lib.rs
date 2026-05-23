use sdkwork_iam_http::{app_routes, backend_routes, IamHttpRoute};

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IamTauriAdapterManifest {
    pub app_routes: Vec<IamHttpRoute>,
    pub backend_routes: Vec<IamHttpRoute>,
    pub plugin_name: &'static str,
}

pub fn iam_tauri_adapter_manifest() -> IamTauriAdapterManifest {
    IamTauriAdapterManifest {
        app_routes: app_routes(),
        backend_routes: backend_routes(),
        plugin_name: "sdkwork-iam",
    }
}
