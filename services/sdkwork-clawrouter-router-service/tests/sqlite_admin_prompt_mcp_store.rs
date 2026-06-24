use sdkwork_clawrouter_router_service::infrastructure::sql::installer::DatabaseInstaller;
use sdkwork_clawrouter_router_service::infrastructure::sql::sqlite::SqliteAdminMcpStore;
use sdkwork_clawrouter_router_service::ports::{
    AdminMcpStore, AdminMcpSubject, CreateAdminMcpBindingCommand, CreateAdminMcpServerCommand,
    CreateAdminMcpServerRevisionCommand, DiscoverAdminMcpToolsCommand, ListAdminMcpBindingsQuery,
    ListAdminMcpServerRevisionsQuery, ListAdminMcpServersQuery, ListAdminMcpToolsQuery,
    PublishAdminMcpServerRevisionCommand, TestAdminMcpServerHealthCommand,
    UpdateAdminMcpBindingCommand, UpdateAdminMcpToolCommand,
};
use serde_json::json;
use sqlx::sqlite::SqlitePoolOptions;

#[tokio::test]
async fn sqlite_admin_mcp_store_manages_vertical_assets() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap();
    DatabaseInstaller::for_sqlite(pool.clone())
        .ensure_installed()
        .await
        .unwrap();

    let mcp_store = SqliteAdminMcpStore::new(pool.clone());
    let server = mcp_store
        .create_server(CreateAdminMcpServerCommand {
            subject: mcp_subject(),
            server_key: "tools.files".to_owned(),
            name: "Files MCP".to_owned(),
            description: Some("File tools".to_owned()),
            transport_kind: "stdio".to_owned(),
            endpoint_url: None,
            auth_kind: "none".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!("tools.files", server.server_key);

    let revision = mcp_store
        .create_revision(CreateAdminMcpServerRevisionCommand {
            subject: mcp_subject(),
            mcp_server_id: server.id,
            revision_label: "1.0.0".to_owned(),
            manifest_json: json!({ "tools": [] }),
        })
        .await
        .unwrap();
    assert_eq!("1.0.0", revision.revision_label);

    let published = mcp_store
        .publish_revision(PublishAdminMcpServerRevisionCommand {
            subject: mcp_subject(),
            revision_id: revision.id,
        })
        .await
        .unwrap()
        .unwrap();
    assert_eq!("published", published.lifecycle_status);
}

fn mcp_subject() -> AdminMcpSubject {
    AdminMcpSubject {
        tenant_id: 100001,
        organization_id: 0,
        operator_id: 1,
        operator_type: 1,
    }
}
