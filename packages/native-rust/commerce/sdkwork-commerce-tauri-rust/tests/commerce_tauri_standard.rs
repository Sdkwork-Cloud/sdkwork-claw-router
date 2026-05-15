use sdkwork_commerce_tauri::commerce_tauri_adapter_manifest;

#[test]
fn exposes_tauri_adapter_manifest_for_local_private_commerce() {
    let manifest = commerce_tauri_adapter_manifest();

    assert_eq!(manifest.plugin_name, "sdkwork-commerce");
    assert!(manifest.app_routes.iter().any(|route| route.operation_id == "wallet.overview.retrieve"));
    assert!(manifest.app_routes.iter().any(|route| route.operation_id == "vip.purchase.create"));
    assert!(manifest.app_routes.iter().all(|route| route.path.starts_with("/app/v3/api/billing/")));
}
