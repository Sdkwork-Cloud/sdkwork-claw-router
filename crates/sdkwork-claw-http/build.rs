use std::env;
use std::path::{Path, PathBuf};
use std::process::Command;

fn main() {
    let manifest_dir = PathBuf::from(
        env::var("CARGO_MANIFEST_DIR")
            .expect("CARGO_MANIFEST_DIR must be available during cargo build"),
    );
    let workspace_root = manifest_dir
        .parent()
        .and_then(Path::parent)
        .expect("sdkwork-claw-http must live under crates/")
        .to_path_buf();
    let out_dir = PathBuf::from(env::var("OUT_DIR").expect("OUT_DIR must be set by Cargo"));
    let output_path = out_dir.join("gateway-openapi.json");

    println!("cargo:rerun-if-env-changed=PYTHON");
    println!(
        "cargo:rerun-if-changed={}",
        workspace_root
            .join("tools")
            .join("clawrouter_gateway_openapi_generator.py")
            .display()
    );
    println!(
        "cargo:rerun-if-changed={}",
        workspace_root
            .join("services")
            .join("sdkwork-claw-product")
            .join("src")
            .join("api")
            .join("openai_contract.rs")
            .display()
    );

    let python = env::var("PYTHON").unwrap_or_else(|_| "python".to_owned());
    let status = Command::new(&python)
        .current_dir(&workspace_root)
        .arg("-B")
        .arg("-m")
        .arg("tools.clawrouter_gateway_openapi_generator")
        .arg("--root")
        .arg(&workspace_root)
        .arg("--output")
        .arg(&output_path)
        .status()
        .unwrap_or_else(|error| panic!("failed to run {python} OpenAPI generator: {error}"));

    if !status.success() {
        panic!("gateway OpenAPI schema generation failed with status {status}");
    }
}
