use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::{ApiKeySecretGenerator, ApiKeySecretHasher};
use sdkwork_claw_product::domain::{DomainError, DomainResult};
use sdkwork_claw_product::ports::{
    AdjustAdminUserBalanceCommand, AdminUserApiKeyItem, AdminUserCommandFuture, AdminUserItem,
    AdminUserStore, CreateAdminUserApiKeyCommand, CreateAdminUserCommand,
    DeleteAdminUserApiKeyCommand, ListAdminUserApiKeysQuery, ListAdminUsersQuery,
    UpdateAdminUserCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn admin_user_route_lists_users_and_api_keys_by_user() {
    let store = Arc::new(TestAdminUserStore::default());
    let router = sdkwork_claw_product::api::admin_user_router_with_store(
        store,
        Arc::new(TestHasher),
        Arc::new(TestSecretGenerator),
    );

    let users_response = router
        .clone()
        .oneshot(signed_request("POST", "/backend/v3/api/user/list", "{}"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, users_response.status());
    let users_payload = json_payload(users_response).await;
    assert_eq!("2000", users_payload["code"]);
    assert_eq!(30, users_payload["data"]["items"][0]["id"]);
    assert_eq!(
        "owner@example.com",
        users_payload["data"]["items"][0]["email"]
    );
    assert_eq!("standard", users_payload["data"]["items"][0]["group"]);
    assert_eq!("$25.50", users_payload["data"]["items"][0]["balance"]);

    let api_keys_response = router
        .oneshot(signed_request("POST", "/backend/v3/api/apikey/list", "{}"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, api_keys_response.status());
    let api_keys_payload = json_payload(api_keys_response).await;
    assert_eq!("2000", api_keys_payload["code"]);
    assert_eq!("Production", api_keys_payload["data"]["30"][0]["name"]);
    assert_eq!("sk-live********", api_keys_payload["data"]["30"][0]["key"]);
}

#[tokio::test]
async fn admin_user_route_creates_updates_adjusts_and_deletes() {
    let store = Arc::new(TestAdminUserStore::default());
    let router = sdkwork_claw_product::api::admin_user_router_with_store(
        store.clone(),
        Arc::new(TestHasher),
        Arc::new(TestSecretGenerator),
    );

    let create_user_response = router
        .clone()
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/user",
            r#"{"email":"new@example.com","username":"new-user","balance":"$10.00"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_user_response.status());
    let create_user_payload = json_payload(create_user_response).await;
    assert_eq!(
        "new@example.com",
        create_user_payload["data"]["item"]["email"]
    );
    assert_eq!("$10.00", create_user_payload["data"]["item"]["balance"]);

    let update_user_response = router
        .clone()
        .oneshot(signed_request(
            "PUT",
            "/backend/v3/api/user",
            r#"{"id":30,"username":"renamed","group":"vip"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_user_response.status());
    let update_user_payload = json_payload(update_user_response).await;
    assert_eq!("renamed", update_user_payload["data"]["item"]["username"]);
    assert_eq!("vip", update_user_payload["data"]["item"]["group"]);

    let balance_response = router
        .clone()
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/billing/users/30/balance_adjustments",
            r#"{"amount":5,"type":"recharge"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, balance_response.status());
    let balance_payload = json_payload(balance_response).await;
    assert_eq!("$30.50", balance_payload["data"]["item"]["balance"]);

    let create_key_response = router
        .clone()
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/apikey",
            r#"{"userId":30,"name":"Console Key"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_key_response.status());
    let create_key_payload = json_payload(create_key_response).await;
    assert_eq!("sk-claw-test-secret", create_key_payload["data"]["rawKey"]);
    assert_eq!("Console Key", create_key_payload["data"]["key"]["name"]);
    assert_eq!(
        "sk-claw-test-sec********cret",
        create_key_payload["data"]["key"]["key"]
    );

    let delete_key_response = router
        .oneshot(signed_request("DELETE", "/backend/v3/api/apikey/100", ""))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_key_response.status());
    let delete_key_payload = json_payload(delete_key_response).await;
    assert_eq!(true, delete_key_payload["data"]["deleted"]);
    assert_eq!(
        vec![
            "create_user",
            "update_user",
            "adjust_balance",
            "create_api_key",
            "delete_api_key"
        ],
        *store.commands.lock().unwrap()
    );
}

#[tokio::test]
async fn admin_user_route_rejects_missing_trusted_subject() {
    let router = sdkwork_claw_product::api::admin_user_router_with_store(
        Arc::new(TestAdminUserStore::default()),
        Arc::new(TestHasher),
        Arc::new(TestSecretGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/backend/v3/api/user/list")
                .body(Body::from("{}"))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4010", payload["code"]);
}

#[tokio::test]
async fn admin_user_route_returns_not_found_when_api_key_user_is_missing() {
    let router = sdkwork_claw_product::api::admin_user_router_with_store(
        Arc::new(TestAdminUserStore {
            missing_api_key_user: true,
            ..Default::default()
        }),
        Arc::new(TestHasher),
        Arc::new(TestSecretGenerator),
    );

    let response = router
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/apikey",
            r#"{"userId":404,"name":"Missing User Key"}"#,
        ))
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4004", payload["code"]);
    assert_eq!("user was not found", payload["message"]);
}

fn signed_request(method: &str, path: &str, body: &str) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(path)
        .header("content-type", "application/json")
        .header("x-sdkwork-tenant-id", "10")
        .header("x-sdkwork-organization-id", "20")
        .header("x-sdkwork-user-id", "30")
        .header("Idempotency-Key", "idem-admin-user-test")
        .header("X-Request-Id", "request-admin-user-test")
        .body(Body::from(body.to_owned()))
        .unwrap()
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

#[derive(Default)]
struct TestAdminUserStore {
    commands: Mutex<Vec<&'static str>>,
    missing_api_key_user: bool,
}

impl AdminUserStore for TestAdminUserStore {
    fn list_users<'a>(
        &'a self,
        query: ListAdminUsersQuery,
    ) -> AdminUserCommandFuture<'a, Vec<AdminUserItem>> {
        Box::pin(async move {
            assert_eq!(10, query.subject.tenant_id);
            Ok(vec![base_user()])
        })
    }

    fn list_api_keys<'a>(
        &'a self,
        query: ListAdminUserApiKeysQuery,
    ) -> AdminUserCommandFuture<'a, Vec<AdminUserApiKeyItem>> {
        Box::pin(async move {
            assert_eq!(20, query.subject.organization_id);
            Ok(vec![AdminUserApiKeyItem {
                id: 100,
                user_id: 30,
                name: "Production".to_owned(),
                key: "sk-live********".to_owned(),
                used: "1.250000".to_owned(),
                status: "active".to_owned(),
            }])
        })
    }

    fn create_user<'a>(
        &'a self,
        command: CreateAdminUserCommand,
    ) -> AdminUserCommandFuture<'a, AdminUserItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_user");
            Ok(AdminUserItem {
                id: 31,
                email: command.email,
                username: command.username,
                role: "user".to_owned(),
                group: "standard".to_owned(),
                balance: "$10.00".to_owned(),
                status: "active".to_owned(),
                last_active: "-".to_owned(),
                last_used: "-".to_owned(),
                created_at: "2026-04-29 09:00:00".to_owned(),
            })
        })
    }

    fn update_user<'a>(
        &'a self,
        command: UpdateAdminUserCommand,
    ) -> AdminUserCommandFuture<'a, Option<AdminUserItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_user");
            let mut user = base_user();
            user.username = command.username.unwrap_or(user.username);
            user.group = command.group.unwrap_or(user.group);
            Ok(Some(user))
        })
    }

    fn adjust_balance<'a>(
        &'a self,
        command: AdjustAdminUserBalanceCommand,
    ) -> AdminUserCommandFuture<'a, Option<AdminUserItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("adjust_balance");
            assert_eq!(30, command.user_id);
            let mut user = base_user();
            user.balance = "$30.50".to_owned();
            Ok(Some(user))
        })
    }

    fn create_api_key<'a>(
        &'a self,
        command: CreateAdminUserApiKeyCommand,
    ) -> AdminUserCommandFuture<'a, AdminUserApiKeyItem> {
        Box::pin(async move {
            if self.missing_api_key_user {
                return Err(DomainError::not_found("user was not found"));
            }
            self.commands.lock().unwrap().push("create_api_key");
            assert_eq!("hash:sk-claw-test-secret", command.key_hash);
            Ok(AdminUserApiKeyItem {
                id: 101,
                user_id: command.user_id,
                name: command.name,
                key: command.key_display_masked,
                used: "0.000000".to_owned(),
                status: "active".to_owned(),
            })
        })
    }

    fn delete_api_key<'a>(
        &'a self,
        command: DeleteAdminUserApiKeyCommand,
    ) -> AdminUserCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_api_key");
            assert_eq!(100, command.api_key_id);
            Ok(true)
        })
    }
}

fn base_user() -> AdminUserItem {
    AdminUserItem {
        id: 30,
        email: "owner@example.com".to_owned(),
        username: "owner".to_owned(),
        role: "admin".to_owned(),
        group: "standard".to_owned(),
        balance: "$25.50".to_owned(),
        status: "active".to_owned(),
        last_active: "2026-04-29 09:00:00".to_owned(),
        last_used: "2026-04-29 09:05:00".to_owned(),
        created_at: "2026-04-01 08:00:00".to_owned(),
    }
}

struct TestHasher;

impl ApiKeySecretHasher for TestHasher {
    fn hash_secret(&self, secret: &str) -> DomainResult<String> {
        Ok(format!("hash:{secret}"))
    }
}

struct TestSecretGenerator;

impl sdkwork_claw_product::application::EntityUuidGenerator for TestSecretGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok("entity-uuid-test".to_owned())
    }
}

impl ApiKeySecretGenerator for TestSecretGenerator {
    fn generate_api_key_secret(&self) -> DomainResult<String> {
        Ok("sk-claw-test-secret".to_owned())
    }
}
