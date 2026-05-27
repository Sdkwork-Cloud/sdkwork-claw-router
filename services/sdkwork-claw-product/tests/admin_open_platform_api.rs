mod common;
use common::InternalTrustedSubjectHeaders;
use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AdminOpenPlatformAccountItem, AdminOpenPlatformCommandFuture, AdminOpenPlatformEntryItem,
    AdminOpenPlatformManifestItem, AdminOpenPlatformPayBindingItem, AdminOpenPlatformProviderItem,
    AdminOpenPlatformStore, CreateAdminOpenPlatformAccountCommand,
    CreateAdminOpenPlatformEntryCommand, CreateAdminOpenPlatformPayBindingCommand,
    DeleteAdminOpenPlatformAccountCommand, DeleteAdminOpenPlatformEntryCommand,
    DeleteAdminOpenPlatformPayBindingCommand, FindOpenPlatformQrDefaultEntryQuery,
    GetAdminOpenPlatformAccountQuery, ListAdminOpenPlatformAccountsQuery,
    ListAdminOpenPlatformEntriesQuery, ListAdminOpenPlatformManifestsQuery,
    ListAdminOpenPlatformPayBindingsQuery, ListAdminOpenPlatformProvidersQuery,
    OpenPlatformQrDefaultEntryItem, UpdateAdminOpenPlatformAccountCommand,
    UpdateAdminOpenPlatformEntryCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn admin_open_platform_route_manages_accounts_entries_and_pay_bindings() {
    let store = Arc::new(TestOpenPlatformStore::default());
    let router = sdkwork_claw_product::api::admin_open_platform_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let provider_response = router
        .clone()
        .oneshot(trusted_request(
            "GET",
            "/backend/v3/api/open_platform/providers?status=active",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, provider_response.status());
    let provider_payload = json_payload(provider_response).await;
    assert_eq!("2000", provider_payload["code"]);
    assert_eq!("wechat", provider_payload["data"]["items"][0]["provider"]);
    assert_eq!("WeChat", provider_payload["data"]["items"][0]["name"]);

    let manifest_response = router
        .clone()
        .oneshot(trusted_request(
            "GET",
            "/backend/v3/api/open_platform/manifests?provider=wechat&type=official_account",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, manifest_response.status());
    let manifest_payload = json_payload(manifest_response).await;
    assert_eq!(
        "wechat.official_account.v1",
        manifest_payload["data"]["items"][0]["key"]
    );

    let create_account_response = router
        .clone()
        .oneshot(trusted_json_request(
            "POST",
            "/backend/v3/api/open_platform/accounts",
            r#"{"key":"wechat.oa.main","name":"WeChat Official Main","provider":"wechat","type":"official_account","appId":"wx123","appSecret":"wx-secret-value","token":"wechat-token","encodingAesKey":"wechat-encoding-aes-key"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_account_response.status());
    let create_account_payload = json_payload(create_account_response).await;
    assert_eq!("1", create_account_payload["data"]["item"]["id"]);
    assert_eq!(
        "wechat.oa.main",
        create_account_payload["data"]["item"]["key"]
    );
    assert_eq!(
        "official_account",
        create_account_payload["data"]["item"]["type"]
    );
    assert_eq!(false, create_account_payload["data"]["item"]["qrDefault"]);
    assert_eq!("active", create_account_payload["data"]["item"]["status"]);
    assert!(create_account_payload["data"]["item"]
        .get("appSecret")
        .is_none());
    assert!(create_account_payload["data"]["item"]["secretRef"]
        .as_str()
        .unwrap()
        .starts_with("secret://open-platform/wechat/official_account/wechat.oa.main/app-secret/"));
    assert!(create_account_payload["data"]["item"]["tokenRef"]
        .as_str()
        .unwrap()
        .starts_with("secret://open-platform/wechat/official_account/wechat.oa.main/token/"));
    assert!(create_account_payload["data"]["item"]["aesKeyRef"]
        .as_str()
        .unwrap()
        .starts_with(
            "secret://open-platform/wechat/official_account/wechat.oa.main/encoding-aes-key/"
        ));
    {
        let credential_materials = store.credential_materials.lock().unwrap();
        assert_eq!(1, credential_materials.len());
        assert_eq!(
            Some("wx-secret-value"),
            credential_materials[0].secret_material.as_deref()
        );
        assert_eq!(
            Some("wechat-token"),
            credential_materials[0].token_material.as_deref()
        );
        assert_eq!(
            Some("wechat-encoding-aes-key"),
            credential_materials[0].aes_key_material.as_deref()
        );
        assert!(!credential_materials[0]
            .secret_ref
            .as_deref()
            .unwrap()
            .contains("wx-secret-value"));
    }

    let create_entry_response = router
        .clone()
        .oneshot(trusted_json_request(
            "POST",
            "/backend/v3/api/open_platform/accounts/1/entries",
            r#"{"key":"wechat.oa.login","type":"qr","url":"https://portal.example.test/auth/qrcode/wechat"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_entry_response.status());
    let create_entry_payload = json_payload(create_entry_response).await;
    assert_eq!("1", create_entry_payload["data"]["item"]["id"]);
    assert_eq!("1", create_entry_payload["data"]["item"]["accountId"]);
    assert_eq!("qr", create_entry_payload["data"]["item"]["type"]);

    let set_default_response = router
        .clone()
        .oneshot(trusted_json_request(
            "PATCH",
            "/backend/v3/api/open_platform/accounts/1",
            r#"{"defaultEntryId":"1","qrDefault":true,"appSecret":"rotated-secret"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, set_default_response.status());
    let set_default_payload = json_payload(set_default_response).await;
    assert_eq!("1", set_default_payload["data"]["item"]["defaultEntryId"]);
    assert_eq!(true, set_default_payload["data"]["item"]["qrDefault"]);
    assert!(set_default_payload["data"]["item"]["secretRef"]
        .as_str()
        .unwrap()
        .starts_with("secret://open-platform/wechat/account/account-1/app-secret/"));
    assert_ne!(
        create_account_payload["data"]["item"]["secretRef"],
        set_default_payload["data"]["item"]["secretRef"]
    );
    {
        let credential_materials = store.credential_materials.lock().unwrap();
        assert_eq!(2, credential_materials.len());
        assert_eq!(
            Some("rotated-secret"),
            credential_materials[1].secret_material.as_deref()
        );
        assert_eq!(None, credential_materials[1].token_material.as_deref());
        assert_eq!(None, credential_materials[1].aes_key_material.as_deref());
    }

    let create_binding_response = router
        .clone()
        .oneshot(trusted_json_request(
            "POST",
            "/backend/v3/api/open_platform/accounts/1/pay_bindings",
            r#"{"paymentAccountId":"pay-wechat-main","paymentChannelId":"channel-wechat-jsapi","scene":"official_account","mode":"direct"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_binding_response.status());
    let create_binding_payload = json_payload(create_binding_response).await;
    assert_eq!("1", create_binding_payload["data"]["item"]["id"]);
    assert_eq!(
        "pay-wechat-main",
        create_binding_payload["data"]["item"]["paymentAccountId"]
    );
    assert_eq!(
        "official_account",
        create_binding_payload["data"]["item"]["scene"]
    );

    let list_accounts_response = router
        .clone()
        .oneshot(trusted_request(
            "GET",
            "/backend/v3/api/open_platform/accounts?provider=wechat&type=official_account&status=active",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_accounts_response.status());
    let list_accounts_payload = json_payload(list_accounts_response).await;
    assert_eq!(
        1,
        list_accounts_payload["data"]["items"]
            .as_array()
            .unwrap()
            .len()
    );
    assert_eq!(
        "1",
        list_accounts_payload["data"]["items"][0]["defaultEntryId"]
    );

    let retrieve_account_response = router
        .clone()
        .oneshot(trusted_request(
            "GET",
            "/backend/v3/api/open_platform/accounts/1",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, retrieve_account_response.status());
    let retrieve_account_payload = json_payload(retrieve_account_response).await;
    assert_eq!(
        "WeChat Official Main",
        retrieve_account_payload["data"]["item"]["name"]
    );

    let list_entries_response = router
        .clone()
        .oneshot(trusted_request(
            "GET",
            "/backend/v3/api/open_platform/accounts/1/entries",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_entries_response.status());
    let list_entries_payload = json_payload(list_entries_response).await;
    assert_eq!(
        1,
        list_entries_payload["data"]["items"]
            .as_array()
            .unwrap()
            .len()
    );

    let list_bindings_response = router
        .clone()
        .oneshot(trusted_request(
            "GET",
            "/backend/v3/api/open_platform/accounts/1/pay_bindings",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_bindings_response.status());
    let list_bindings_payload = json_payload(list_bindings_response).await;
    assert_eq!(
        1,
        list_bindings_payload["data"]["items"]
            .as_array()
            .unwrap()
            .len()
    );

    let update_entry_response = router
        .clone()
        .oneshot(trusted_json_request(
            "PATCH",
            "/backend/v3/api/open_platform/accounts/1/entries/1",
            r#"{"status":"inactive","url":"https://portal.example.test/auth/qrcode/wechat-disabled"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, update_entry_response.status());
    let update_entry_payload = json_payload(update_entry_response).await;
    assert_eq!("inactive", update_entry_payload["data"]["item"]["status"]);

    let delete_binding_response = router
        .clone()
        .oneshot(trusted_request(
            "DELETE",
            "/backend/v3/api/open_platform/accounts/1/pay_bindings/1",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_binding_response.status());
    let delete_binding_payload = json_payload(delete_binding_response).await;
    assert_eq!("inactive", delete_binding_payload["data"]["item"]["status"]);

    let delete_entry_response = router
        .clone()
        .oneshot(trusted_request(
            "DELETE",
            "/backend/v3/api/open_platform/accounts/1/entries/1",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_entry_response.status());
    let delete_entry_payload = json_payload(delete_entry_response).await;
    assert_eq!("inactive", delete_entry_payload["data"]["item"]["status"]);

    let delete_account_response = router
        .clone()
        .oneshot(trusted_request(
            "DELETE",
            "/backend/v3/api/open_platform/accounts/1",
            Body::empty(),
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_account_response.status());
    let delete_account_payload = json_payload(delete_account_response).await;
    assert_eq!("inactive", delete_account_payload["data"]["item"]["status"]);

    let final_list_response = router
        .oneshot(trusted_request(
            "GET",
            "/backend/v3/api/open_platform/accounts?status=active",
            Body::empty(),
        ))
        .await
        .unwrap();
    let final_list_payload = json_payload(final_list_response).await;
    assert_eq!(
        0,
        final_list_payload["data"]["items"]
            .as_array()
            .unwrap()
            .len()
    );

    assert_eq!(
        vec![
            "create_account",
            "create_entry",
            "update_account",
            "create_pay_binding",
            "update_entry",
            "delete_pay_binding",
            "delete_entry",
            "delete_account",
        ],
        *store.commands.lock().unwrap()
    );
}

#[tokio::test]
async fn admin_open_platform_route_rejects_missing_trusted_subject() {
    let router = sdkwork_claw_product::api::admin_open_platform_router_with_store(
        Arc::new(TestOpenPlatformStore::default()),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/open_platform/accounts")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4010", payload["code"]);
}

#[tokio::test]
async fn admin_open_platform_route_rejects_invalid_payloads_without_calling_store() {
    let store = Arc::new(TestOpenPlatformStore::default());
    let router = sdkwork_claw_product::api::admin_open_platform_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let bad_account_response = router
        .clone()
        .oneshot(trusted_json_request(
            "POST",
            "/backend/v3/api/open_platform/accounts",
            r#"{"key":"WeChat Main","name":"Bad","provider":"wechat","type":"official_account","appSecret":"plain"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, bad_account_response.status());
    let bad_account_payload = json_payload(bad_account_response).await;
    assert_eq!("4001", bad_account_payload["code"]);
    assert!(bad_account_payload["msg"]
        .as_str()
        .unwrap()
        .contains("open platform account key"));

    let technical_credential_response = router
        .clone()
        .oneshot(trusted_json_request(
            "POST",
            "/backend/v3/api/open_platform/accounts",
            r#"{"key":"wechat.oa.technical","name":"Technical","provider":"wechat","type":"official_account","secretRef":"vault://open-platform/wechat/main/app-secret"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(
        StatusCode::BAD_REQUEST,
        technical_credential_response.status()
    );
    let technical_credential_payload = json_payload(technical_credential_response).await;
    assert_eq!("4001", technical_credential_payload["code"]);
    assert!(technical_credential_payload["msg"]
        .as_str()
        .unwrap()
        .contains("internal credential reference field"));

    let unsupported_alias_response = router
        .clone()
        .oneshot(trusted_json_request(
            "POST",
            "/backend/v3/api/open_platform/accounts",
            r#"{"key":"wechat.oa.alias","name":"Alias","provider":"wechat","type":"official_account","clientSecret":"plain"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, unsupported_alias_response.status());
    let unsupported_alias_payload = json_payload(unsupported_alias_response).await;
    assert_eq!("4001", unsupported_alias_payload["code"]);
    assert!(unsupported_alias_payload["msg"]
        .as_str()
        .unwrap()
        .contains("AppSecret, Token, and EncodingAESKey"));

    let bad_entry_response = router
        .oneshot(trusted_json_request(
            "POST",
            "/backend/v3/api/open_platform/accounts/1/entries",
            r#"{"key":"wechat.oa.login","type":"qr","url":"javascript:alert(1)"}"#,
        ))
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, bad_entry_response.status());
    let bad_entry_payload = json_payload(bad_entry_response).await;
    assert_eq!("4001", bad_entry_payload["code"]);
    assert!(bad_entry_payload["msg"]
        .as_str()
        .unwrap()
        .contains("entry url"));

    assert!(store.commands.lock().unwrap().is_empty());
}

fn trusted_request(method: &str, uri: &str, body: Body) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .internal_trusted_subject(10, 20, 30)
        .body(body)
        .unwrap()
}

fn trusted_json_request(method: &str, uri: &str, body: &'static str) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(uri)
        .header("content-type", "application/json")
        .internal_trusted_subject(10, 20, 30)
        .header("X-Request-Id", "open-platform-test")
        .body(Body::from(body))
        .unwrap()
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct CapturedOpenPlatformCredentialMaterial {
    secret_ref: Option<String>,
    secret_material: Option<String>,
    token_ref: Option<String>,
    token_material: Option<String>,
    aes_key_ref: Option<String>,
    aes_key_material: Option<String>,
}

#[derive(Default)]
struct TestOpenPlatformStore {
    accounts: Mutex<Vec<AdminOpenPlatformAccountItem>>,
    entries: Mutex<Vec<AdminOpenPlatformEntryItem>>,
    pay_bindings: Mutex<Vec<AdminOpenPlatformPayBindingItem>>,
    commands: Mutex<Vec<&'static str>>,
    credential_materials: Mutex<Vec<CapturedOpenPlatformCredentialMaterial>>,
}

impl AdminOpenPlatformStore for TestOpenPlatformStore {
    fn list_providers<'a>(
        &'a self,
        query: ListAdminOpenPlatformProvidersQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformProviderItem>> {
        Box::pin(async move {
            let providers = vec![
                AdminOpenPlatformProviderItem {
                    id: "wechat".to_owned(),
                    provider: "wechat".to_owned(),
                    name: "WeChat".to_owned(),
                    status: "active".to_owned(),
                },
                AdminOpenPlatformProviderItem {
                    id: "douyin".to_owned(),
                    provider: "douyin".to_owned(),
                    name: "Douyin".to_owned(),
                    status: "active".to_owned(),
                },
            ];
            Ok(providers
                .into_iter()
                .filter(|item| {
                    query
                        .status
                        .as_ref()
                        .is_none_or(|status| status == &item.status)
                })
                .collect())
        })
    }

    fn list_manifests<'a>(
        &'a self,
        query: ListAdminOpenPlatformManifestsQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformManifestItem>> {
        Box::pin(async move {
            let manifests = vec![
                AdminOpenPlatformManifestItem {
                    id: "wechat-official-account".to_owned(),
                    key: "wechat.official_account.v1".to_owned(),
                    provider: "wechat".to_owned(),
                    account_type: "official_account".to_owned(),
                    version: "1.0.0".to_owned(),
                    status: "active".to_owned(),
                },
                AdminOpenPlatformManifestItem {
                    id: "wechat-mini-app".to_owned(),
                    key: "wechat.mini_app.v1".to_owned(),
                    provider: "wechat".to_owned(),
                    account_type: "mini_app".to_owned(),
                    version: "1.0.0".to_owned(),
                    status: "active".to_owned(),
                },
            ];
            Ok(manifests
                .into_iter()
                .filter(|item| {
                    query
                        .provider
                        .as_ref()
                        .is_none_or(|provider| provider == &item.provider)
                })
                .filter(|item| {
                    query
                        .account_type
                        .as_ref()
                        .is_none_or(|account_type| account_type == &item.account_type)
                })
                .collect())
        })
    }

    fn list_accounts<'a>(
        &'a self,
        query: ListAdminOpenPlatformAccountsQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformAccountItem>> {
        Box::pin(async move {
            Ok(self
                .accounts
                .lock()
                .unwrap()
                .iter()
                .filter(|item| item.tenant_id == query.subject.tenant_id)
                .filter(|item| item.organization_id == query.subject.organization_id)
                .filter(|item| item.deleted_at.is_none())
                .filter(|item| {
                    query
                        .provider
                        .as_ref()
                        .is_none_or(|provider| provider == &item.provider)
                })
                .filter(|item| {
                    query
                        .account_type
                        .as_ref()
                        .is_none_or(|account_type| account_type == &item.account_type)
                })
                .filter(|item| {
                    query
                        .status
                        .as_ref()
                        .is_none_or(|status| status == &item.status)
                })
                .cloned()
                .collect())
        })
    }

    fn find_qr_default_entry<'a>(
        &'a self,
        query: FindOpenPlatformQrDefaultEntryQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<OpenPlatformQrDefaultEntryItem>> {
        Box::pin(async move {
            let account = self
                .accounts
                .lock()
                .unwrap()
                .iter()
                .find(|item| {
                    item.qr_default
                        && item.status == "active"
                        && query
                            .provider
                            .as_ref()
                            .is_none_or(|provider| provider == &item.provider)
                        && query
                            .account_type
                            .as_ref()
                            .is_none_or(|account_type| account_type == &item.account_type)
                })
                .cloned();
            let Some(account) = account else {
                return Ok(None);
            };
            let entry = self
                .entries
                .lock()
                .unwrap()
                .iter()
                .find(|item| item.account_id == account.id && item.status == "active")
                .cloned();
            Ok(entry.map(|entry| OpenPlatformQrDefaultEntryItem { account, entry }))
        })
    }

    fn get_account<'a>(
        &'a self,
        query: GetAdminOpenPlatformAccountQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformAccountItem>> {
        Box::pin(async move {
            Ok(self
                .accounts
                .lock()
                .unwrap()
                .iter()
                .find(|item| {
                    item.id == query.account_id
                        && item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                        && item.deleted_at.is_none()
                })
                .cloned())
        })
    }

    fn create_account<'a>(
        &'a self,
        command: CreateAdminOpenPlatformAccountCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, AdminOpenPlatformAccountItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_account");
            self.credential_materials.lock().unwrap().push(
                CapturedOpenPlatformCredentialMaterial {
                    secret_ref: command.secret_ref.clone(),
                    secret_material: command.secret_material.clone(),
                    token_ref: command.token_ref.clone(),
                    token_material: command.token_material.clone(),
                    aes_key_ref: command.aes_key_ref.clone(),
                    aes_key_material: command.aes_key_material.clone(),
                },
            );
            let id = self.accounts.lock().unwrap().len() as i64 + 1;
            let item = AdminOpenPlatformAccountItem {
                id,
                uuid: command.account_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                key: command.key,
                name: command.name,
                provider: command.provider,
                account_type: command.account_type,
                app_id: command.app_id,
                secret_ref: command.secret_ref,
                token_ref: command.token_ref,
                aes_key_ref: command.aes_key_ref,
                default_entry_id: None,
                qr_default: false,
                status: "active".to_owned(),
                created_at: command.requested_at.clone(),
                updated_at: command.requested_at,
                deleted_at: None,
            };
            self.accounts.lock().unwrap().push(item.clone());
            Ok(item)
        })
    }

    fn update_account<'a>(
        &'a self,
        command: UpdateAdminOpenPlatformAccountCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformAccountItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_account");
            self.credential_materials.lock().unwrap().push(
                CapturedOpenPlatformCredentialMaterial {
                    secret_ref: command.secret_ref.clone().flatten(),
                    secret_material: command.secret_material.clone(),
                    token_ref: command.token_ref.clone().flatten(),
                    token_material: command.token_material.clone(),
                    aes_key_ref: command.aes_key_ref.clone().flatten(),
                    aes_key_material: command.aes_key_material.clone(),
                },
            );
            let mut accounts = self.accounts.lock().unwrap();
            let Some(item) = accounts.iter_mut().find(|item| {
                item.id == command.account_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            if let Some(name) = command.name {
                item.name = name;
            }
            if let Some(app_id) = command.app_id {
                item.app_id = app_id;
            }
            if let Some(secret_ref) = command.secret_ref {
                item.secret_ref = secret_ref;
            }
            if let Some(token_ref) = command.token_ref {
                item.token_ref = token_ref;
            }
            if let Some(aes_key_ref) = command.aes_key_ref {
                item.aes_key_ref = aes_key_ref;
            }
            if let Some(default_entry_id) = command.default_entry_id {
                item.default_entry_id = default_entry_id;
            }
            if let Some(qr_default) = command.qr_default {
                item.qr_default = qr_default;
            }
            if let Some(status) = command.status {
                item.status = status;
            }
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn delete_account<'a>(
        &'a self,
        command: DeleteAdminOpenPlatformAccountCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformAccountItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_account");
            let mut accounts = self.accounts.lock().unwrap();
            let Some(item) = accounts.iter_mut().find(|item| {
                item.id == command.account_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            item.status = "inactive".to_owned();
            item.deleted_at = Some(command.requested_at.clone());
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn list_entries<'a>(
        &'a self,
        query: ListAdminOpenPlatformEntriesQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformEntryItem>> {
        Box::pin(async move {
            Ok(self
                .entries
                .lock()
                .unwrap()
                .iter()
                .filter(|item| {
                    item.account_id == query.account_id
                        && item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                        && item.deleted_at.is_none()
                })
                .cloned()
                .collect())
        })
    }

    fn create_entry<'a>(
        &'a self,
        command: CreateAdminOpenPlatformEntryCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformEntryItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_entry");
            if self
                .accounts
                .lock()
                .unwrap()
                .iter()
                .all(|account| account.id != command.account_id || account.deleted_at.is_some())
            {
                return Ok(None);
            }
            let id = self.entries.lock().unwrap().len() as i64 + 1;
            let item = AdminOpenPlatformEntryItem {
                id,
                uuid: command.entry_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                account_id: command.account_id,
                key: command.key,
                entry_type: command.entry_type,
                url: command.url,
                status: "active".to_owned(),
                created_at: command.requested_at.clone(),
                updated_at: command.requested_at,
                deleted_at: None,
            };
            self.entries.lock().unwrap().push(item.clone());
            Ok(Some(item))
        })
    }

    fn update_entry<'a>(
        &'a self,
        command: UpdateAdminOpenPlatformEntryCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformEntryItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_entry");
            let mut entries = self.entries.lock().unwrap();
            let Some(item) = entries.iter_mut().find(|item| {
                item.id == command.entry_id
                    && item.account_id == command.account_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            if let Some(key) = command.key {
                item.key = key;
            }
            if let Some(entry_type) = command.entry_type {
                item.entry_type = entry_type;
            }
            if let Some(url) = command.url {
                item.url = url;
            }
            if let Some(status) = command.status {
                item.status = status;
            }
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn delete_entry<'a>(
        &'a self,
        command: DeleteAdminOpenPlatformEntryCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformEntryItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_entry");
            let mut entries = self.entries.lock().unwrap();
            let Some(item) = entries.iter_mut().find(|item| {
                item.id == command.entry_id
                    && item.account_id == command.account_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            item.status = "inactive".to_owned();
            item.deleted_at = Some(command.requested_at.clone());
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }

    fn list_pay_bindings<'a>(
        &'a self,
        query: ListAdminOpenPlatformPayBindingsQuery,
    ) -> AdminOpenPlatformCommandFuture<'a, Vec<AdminOpenPlatformPayBindingItem>> {
        Box::pin(async move {
            Ok(self
                .pay_bindings
                .lock()
                .unwrap()
                .iter()
                .filter(|item| {
                    item.account_id == query.account_id
                        && item.tenant_id == query.subject.tenant_id
                        && item.organization_id == query.subject.organization_id
                        && item.deleted_at.is_none()
                })
                .cloned()
                .collect())
        })
    }

    fn create_pay_binding<'a>(
        &'a self,
        command: CreateAdminOpenPlatformPayBindingCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformPayBindingItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_pay_binding");
            if self
                .accounts
                .lock()
                .unwrap()
                .iter()
                .all(|account| account.id != command.account_id || account.deleted_at.is_some())
            {
                return Ok(None);
            }
            let id = self.pay_bindings.lock().unwrap().len() as i64 + 1;
            let item = AdminOpenPlatformPayBindingItem {
                id,
                uuid: command.pay_binding_uuid,
                tenant_id: command.subject.tenant_id,
                organization_id: command.subject.organization_id,
                account_id: command.account_id,
                payment_account_id: command.payment_account_id,
                payment_channel_id: command.payment_channel_id,
                scene: command.scene,
                mode: command.mode,
                status: "active".to_owned(),
                created_at: command.requested_at.clone(),
                updated_at: command.requested_at,
                deleted_at: None,
            };
            self.pay_bindings.lock().unwrap().push(item.clone());
            Ok(Some(item))
        })
    }

    fn delete_pay_binding<'a>(
        &'a self,
        command: DeleteAdminOpenPlatformPayBindingCommand,
    ) -> AdminOpenPlatformCommandFuture<'a, Option<AdminOpenPlatformPayBindingItem>> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_pay_binding");
            let mut bindings = self.pay_bindings.lock().unwrap();
            let Some(item) = bindings.iter_mut().find(|item| {
                item.id == command.binding_id
                    && item.account_id == command.account_id
                    && item.tenant_id == command.subject.tenant_id
                    && item.organization_id == command.subject.organization_id
                    && item.deleted_at.is_none()
            }) else {
                return Ok(None);
            };
            item.status = "inactive".to_owned();
            item.deleted_at = Some(command.requested_at.clone());
            item.updated_at = command.requested_at;
            Ok(Some(item.clone()))
        })
    }
}

struct TestUuidGenerator;

impl EntityUuidGenerator for TestUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok("open-platform-test-uuid".to_owned())
    }
}
