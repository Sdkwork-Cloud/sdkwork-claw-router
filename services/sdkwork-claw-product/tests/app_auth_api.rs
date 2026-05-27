use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_config::{AppSessionConfig, TrustedSubjectConfig};
use sdkwork_claw_http::verify_app_session_token;
use sdkwork_claw_product::application::{
    default_desktop_cache_manager, EntityUuidGenerator, Pbkdf2Sha256PasswordHasher,
    RuntimeCacheManager,
};
use sdkwork_claw_product::domain::{DomainError, DomainResult};
use sdkwork_claw_product::infrastructure::sql::sqlite::{
    SqliteAdminOpenPlatformStore, SqliteAppAuthStore, SqliteAppSessionEventStore,
};
use sdkwork_claw_product::ports::{
    AdminAuthSettings, AdminAuthSettingsFuture, AdminAuthSettingsStore, GetAdminAuthSettingsQuery,
    GetAdminAuthSettingsScopeQuery, RequiredConfiguredVerificationCodeSender,
    UpdateAdminAuthSettingsCommand, VerificationCodeDeliveryFuture,
    VerificationCodeDeliveryReceipt, VerificationCodeDeliveryRequest, VerificationCodeSender,
};
use serde_json::json;
use sha2::{Digest, Sha256};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::{Row, SqlitePool};
use std::sync::Arc;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use tower::ServiceExt;

const APP_AUTH_SESSION_PATH: &str = "/app/v3/api/auth/sessions";
const APP_SESSION_SECRET: &str = "app-auth-session-secret-0123456789";
const TRUSTED_SUBJECT_SECRET: &str = "app-auth-trusted-subject-secret-0123456789";

#[tokio::test]
async fn app_auth_sessions_create_issues_dual_token_context_for_active_iam_user_and_records_standard_events(
) {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router(pool.clone());

    let response = router
        .clone()
        .oneshot(login_request("alice@example.com", "correct-password"))
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert!(payload["data"]["authToken"].as_str().unwrap().len() > 32);
    assert!(payload["data"]["accessToken"].as_str().unwrap().len() > 32);
    assert_ne!(payload["data"]["authToken"], payload["data"]["accessToken"]);
    assert!(payload["data"]["refreshToken"].as_str().unwrap().len() > 32);
    assert_eq!("30", payload["data"]["user"]["id"]);
    assert_eq!("alice", payload["data"]["user"]["username"]);
    assert_eq!("alice@example.com", payload["data"]["user"]["email"]);
    assert_eq!("Alice Router", payload["data"]["user"]["displayName"]);
    assert_eq!(
        "https://cdn.example.com/avatar.png",
        payload["data"]["user"]["avatarUrl"]
    );
    assert_eq!("active", payload["data"]["user"]["status"]);
    assert_eq!("sdkwork-claw-router", payload["data"]["context"]["appId"]);
    assert_eq!("password", payload["data"]["context"]["authLevel"]);
    assert_eq!("local", payload["data"]["context"]["deploymentMode"]);
    assert_eq!("dev", payload["data"]["context"]["environment"]);
    assert_eq!("10", payload["data"]["context"]["tenantId"]);
    assert_eq!("20", payload["data"]["context"]["organizationId"]);
    assert_eq!("30", payload["data"]["context"]["userId"]);
    assert_eq!(
        payload["data"]["sessionId"],
        payload["data"]["context"]["sessionId"]
    );
    assert_eq!("tenant:10", payload["data"]["context"]["dataScope"][0]);
    assert!(payload["data"]["user"].get("password").is_none());

    let auth_token = payload["data"]["authToken"].as_str().unwrap();
    let access_token = payload["data"]["accessToken"].as_str().unwrap();
    for token in [auth_token, access_token] {
        let subject =
            verify_app_session_token(&app_session_config(), token, current_unix_seconds())
                .expect("login response must issue valid IAM session tokens");
        assert_eq!(10, subject.tenant_id);
        assert_eq!(20, subject.organization_id);
        assert_eq!(30, subject.user_id);
    }

    let session = sqlx::query(
        r#"
        SELECT tenant_id, organization_id, user_id, app_id, environment, deployment_mode, auth_level, auth_token_hash, access_token_hash, refresh_token_hash, sharding_key, sharding_strategy, data_scope_json, permission_scope_json
        FROM iam_session
        WHERE user_id = 30
        LIMIT 1
        "#,
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!("10", session.get::<String, _>("tenant_id"));
    assert_eq!(
        Some("20".to_owned()),
        session.get::<Option<String>, _>("organization_id")
    );
    assert_eq!("30", session.get::<String, _>("user_id"));
    assert_eq!("sdkwork-claw-router", session.get::<String, _>("app_id"));
    assert_eq!("dev", session.get::<String, _>("environment"));
    assert_eq!("local", session.get::<String, _>("deployment_mode"));
    assert_eq!("password", session.get::<String, _>("auth_level"));
    assert_eq!(64, session.get::<String, _>("auth_token_hash").len());
    assert_eq!(64, session.get::<String, _>("access_token_hash").len());
    assert_eq!(
        64,
        session
            .get::<Option<String>, _>("refresh_token_hash")
            .unwrap()
            .len()
    );
    assert_eq!("10", session.get::<String, _>("sharding_key"));
    assert_eq!("tenant", session.get::<String, _>("sharding_strategy"));
    assert!(session
        .get::<String, _>("data_scope_json")
        .contains("tenant:10"));
    assert!(session
        .get::<String, _>("permission_scope_json")
        .contains("clawrouter:console"));
    assert!(!session
        .get::<String, _>("auth_token_hash")
        .contains(auth_token));
    assert!(!session
        .get::<String, _>("access_token_hash")
        .contains(access_token));

    let security_event_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_security_event WHERE tenant_id = '10' AND user_id = '30' AND event_type = 'sessions.create'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, security_event_count);

    let audit_request_id: String = sqlx::query_scalar(
        "SELECT request_id FROM iam_audit_event WHERE actor_user_id = '30' AND action = 'sessions.create'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_server_request_id(
        &audit_request_id,
        "66666666-6666-4333-8444-555555555555",
    );
}

#[tokio::test]
async fn app_auth_sessions_current_retrieve_returns_active_persisted_session() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router(pool);

    let login_response = router
        .clone()
        .oneshot(login_request("alice@example.com", "correct-password"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, login_response.status());
    let login_payload = response_json(login_response).await;
    let auth_token = login_payload["data"]["authToken"].as_str().unwrap();
    let access_token = login_payload["data"]["accessToken"].as_str().unwrap();
    let session_id = login_payload["data"]["sessionId"].as_str().unwrap();
    assert_eq!("20", login_payload["data"]["context"]["organizationId"]);

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/auth/sessions/current")
                .header("authorization", format!("Bearer {auth_token}"))
                .header("Access-Token", access_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_eq!(session_id, payload["data"]["sessionId"]);
    assert_eq!("30", payload["data"]["user"]["id"]);
    assert_eq!("alice", payload["data"]["user"]["username"]);
    assert_eq!("alice@example.com", payload["data"]["user"]["email"]);
    assert_eq!("Alice Router", payload["data"]["user"]["displayName"]);
    assert_eq!("password", payload["data"]["context"]["authLevel"]);
    assert_eq!("10", payload["data"]["context"]["tenantId"]);
    assert_eq!("20", payload["data"]["context"]["organizationId"]);
    assert_eq!("30", payload["data"]["context"]["userId"]);
    assert_eq!(auth_token, payload["data"]["authToken"]);
    assert_eq!(access_token, payload["data"]["accessToken"]);
    assert!(payload["data"].get("refreshToken").is_none());
    assert!(payload["data"]["user"].get("password").is_none());
}

#[tokio::test]
async fn app_auth_sessions_current_delete_revokes_active_session() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router(pool.clone());

    let login_response = router
        .clone()
        .oneshot(login_request("alice@example.com", "correct-password"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, login_response.status());
    let login_payload = response_json(login_response).await;
    let auth_token = login_payload["data"]["authToken"].as_str().unwrap();
    let access_token = login_payload["data"]["accessToken"].as_str().unwrap();
    let session_id = login_payload["data"]["sessionId"].as_str().unwrap();

    let delete_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("DELETE")
                .uri("/app/v3/api/auth/sessions/current")
                .header("authorization", format!("Bearer {auth_token}"))
                .header("Access-Token", access_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, delete_response.status());
    let delete_payload = response_json(delete_response).await;
    assert_eq!("2000", delete_payload["code"]);
    assert!(delete_payload["data"].as_object().unwrap().is_empty());

    let revoked_at: Option<String> =
        sqlx::query_scalar("SELECT revoked_at FROM iam_session WHERE id = ?")
            .bind(session_id)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert!(revoked_at.is_some());
    let security_event_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_security_event WHERE session_id = ? AND event_type = 'sessions.revoke'",
    )
    .bind(session_id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, security_event_count);

    let current_response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/auth/sessions/current")
                .header("authorization", format!("Bearer {auth_token}"))
                .header("Access-Token", access_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, current_response.status());
}

#[tokio::test]
async fn app_auth_sessions_refresh_rotates_tokens_for_active_session() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router(pool.clone());

    let login_response = router
        .clone()
        .oneshot(login_request("alice@example.com", "correct-password"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, login_response.status());
    let login_payload = response_json(login_response).await;
    let auth_token = login_payload["data"]["authToken"].as_str().unwrap();
    let access_token = login_payload["data"]["accessToken"].as_str().unwrap();
    let refresh_token = login_payload["data"]["refreshToken"].as_str().unwrap();
    let old_session_id = login_payload["data"]["sessionId"].as_str().unwrap();

    let refresh_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/auth/sessions/refresh")
                .header("content-type", "application/json")
                .header("authorization", format!("Bearer {auth_token}"))
                .header("Access-Token", access_token)
                .body(Body::from(
                    json!({
                        "refreshToken": refresh_token
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, refresh_response.status());
    let refresh_payload = response_json(refresh_response).await;
    assert_eq!("2000", refresh_payload["code"]);
    assert_ne!(auth_token, refresh_payload["data"]["authToken"]);
    assert_ne!(access_token, refresh_payload["data"]["accessToken"]);
    assert_ne!(refresh_token, refresh_payload["data"]["refreshToken"]);
    assert_eq!(old_session_id, refresh_payload["data"]["sessionId"]);
    assert_eq!("30", refresh_payload["data"]["user"]["id"]);
    assert_eq!("20", refresh_payload["data"]["context"]["organizationId"]);

    let old_revoked_at: Option<String> =
        sqlx::query_scalar("SELECT revoked_at FROM iam_session WHERE id = ?")
            .bind(old_session_id)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert!(old_revoked_at.is_none());
    let active_session_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_session WHERE user_id = '30' AND revoked_at IS NULL",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, active_session_count);

    let old_current_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/auth/sessions/current")
                .header("authorization", format!("Bearer {auth_token}"))
                .header("Access-Token", access_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, old_current_response.status());

    let new_current_response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/auth/sessions/current")
                .header(
                    "authorization",
                    format!(
                        "Bearer {}",
                        refresh_payload["data"]["authToken"].as_str().unwrap()
                    ),
                )
                .header(
                    "Access-Token",
                    refresh_payload["data"]["accessToken"].as_str().unwrap(),
                )
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, new_current_response.status());
}

#[tokio::test]
async fn app_auth_sessions_current_update_rotates_session_to_active_member_organization() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    seed_second_organization_membership(&pool, 30).await;
    let router = app_auth_router(pool.clone());

    let login_response = router
        .clone()
        .oneshot(login_request("alice@example.com", "correct-password"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, login_response.status());
    let login_payload = response_json(login_response).await;
    let auth_token = login_payload["data"]["authToken"].as_str().unwrap();
    let access_token = login_payload["data"]["accessToken"].as_str().unwrap();
    let session_id = login_payload["data"]["sessionId"].as_str().unwrap();

    let update_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("PATCH")
                .uri("/app/v3/api/auth/sessions/current")
                .header("content-type", "application/json")
                .header("authorization", format!("Bearer {auth_token}"))
                .header("Access-Token", access_token)
                .body(Body::from(
                    json!({
                        "organizationCode": "workspace",
                        "deviceName": "Console Workstation"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, update_response.status());
    let update_payload = response_json(update_response).await;
    assert_eq!("2000", update_payload["code"]);
    assert_eq!(session_id, update_payload["data"]["sessionId"]);
    assert_eq!("21", update_payload["data"]["context"]["organizationId"]);
    assert_ne!(auth_token, update_payload["data"]["authToken"]);
    assert_ne!(access_token, update_payload["data"]["accessToken"]);
    assert!(
        update_payload["data"]["refreshToken"]
            .as_str()
            .unwrap()
            .len()
            > 32
    );

    let stored_organization_id: String =
        sqlx::query_scalar("SELECT organization_id FROM iam_session WHERE id = ?")
            .bind(session_id)
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!("21", stored_organization_id);
    let update_event_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_security_event WHERE session_id = ? AND event_type = 'sessions.update'",
    )
    .bind(session_id)
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, update_event_count);

    let old_current_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/auth/sessions/current")
                .header("authorization", format!("Bearer {auth_token}"))
                .header("Access-Token", access_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, old_current_response.status());

    let new_current_response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/auth/sessions/current")
                .header(
                    "authorization",
                    format!(
                        "Bearer {}",
                        update_payload["data"]["authToken"].as_str().unwrap()
                    ),
                )
                .header(
                    "Access-Token",
                    update_payload["data"]["accessToken"].as_str().unwrap(),
                )
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, new_current_response.status());
    let new_current_payload = response_json(new_current_response).await;
    assert_eq!(
        "21",
        new_current_payload["data"]["context"]["organizationId"]
    );
}

#[tokio::test]
async fn app_auth_sessions_create_rejects_bad_password_without_disclosing_account_state() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router(pool.clone());

    let response = router
        .oneshot(login_request("alice", "wrong-password"))
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = response_json(response).await;
    assert_eq!("4010", payload["code"]);
    assert_eq!("Invalid account or password", payload["msg"]);

    let event_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM iam_session WHERE user_id = '30'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, event_count);
}

#[tokio::test]
async fn app_auth_sessions_create_rejects_disabled_iam_user() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(
        &pool,
        31,
        "disabled",
        "disabled@example.com",
        "Disabled User",
        0,
    )
    .await;
    let router = app_auth_router(pool);

    let response = router
        .oneshot(login_request("disabled@example.com", "correct-password"))
        .await
        .unwrap();

    assert_eq!(StatusCode::UNAUTHORIZED, response.status());
    let payload = response_json(response).await;
    assert_eq!("4010", payload["code"]);
    assert_eq!("Invalid account or password", payload["msg"]);
}

#[tokio::test]
async fn app_auth_login_legacy_path_is_not_exposed() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    let router = app_auth_router(pool);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/auth/login")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"username":"alice","password":"correct-password"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
}

#[tokio::test]
async fn app_auth_open_platform_qr_auth_legacy_qr_login_paths_are_not_exposed() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    create_open_platform_schema(&pool).await;
    let router = app_auth_router_with_open_platform(pool, qr_login_settings());

    for (method, uri) in [
        ("POST", "/app/v3/api/auth/qr_login_codes"),
        ("GET", "/app/v3/api/auth/qr_login_codes/missing-key"),
        (
            "POST",
            "/app/v3/api/auth/qr_login_codes/missing-key/callback",
        ),
        ("POST", "/app/v3/api/auth/qr_login_codes/confirm"),
    ] {
        let response = router
            .clone()
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(uri)
                    .header("content-type", "application/json")
                    .body(Body::from("{}"))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(StatusCode::NOT_FOUND, response.status(), "{method} {uri}");
    }
}

#[tokio::test]
async fn app_auth_open_platform_qr_auth_fallback_scan_and_password_login_complete_session() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    create_open_platform_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router_with_open_platform(pool.clone(), qr_login_settings());

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/open_platform/qr_auth/sessions")
                .header("content-type", "application/json")
                .header("host", "console.example.test")
                .body(Body::from(json!({ "purpose": "login" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = response_json(create_response).await;
    assert_eq!("2000", create_payload["code"]);
    let session_key = create_payload["data"]["sessionKey"].as_str().unwrap();
    assert_eq!("login", create_payload["data"]["purpose"]);
    assert_eq!("pending", create_payload["data"]["status"]);
    assert_eq!("fallback_url", create_payload["data"]["qrContent"]["mode"]);
    assert_eq!(
        format!(
            "https://console.example.test/auth/qr/{session_key}?session_key={session_key}&purpose=login&scan_source=browser"
        ),
        create_payload["data"]["qrContent"]["content"]
    );
    assert_eq!(
        create_payload["data"]["fallbackUrl"],
        create_payload["data"]["qrContent"]["content"]
    );

    let legacy_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/auth/qr_login_codes")
                .header("content-type", "application/json")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::NOT_FOUND, legacy_response.status());

    let scan_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/scans"
                ))
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "scanSource": "browser",
                        "ipHash": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                        "userAgent": "Mozilla/5.0"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, scan_response.status());
    let scan_payload = response_json(scan_response).await;
    assert_eq!("2000", scan_payload["code"]);
    assert_eq!(session_key, scan_payload["data"]["sessionKey"]);
    assert_eq!("browser", scan_payload["data"]["scanSource"]);

    let password_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/passwords"
                ))
                .header("content-type", "application/json")
                .header("X-Request-Id", "77777777-7777-4333-8444-555555555555")
                .body(Body::from(
                    json!({
                        "username": "alice@example.com",
                        "password": "correct-password"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, password_response.status());
    let password_payload = response_json(password_response).await;
    assert_eq!("completed", password_payload["data"]["status"]);
    assert!(
        password_payload["data"]["session"]["authToken"]
            .as_str()
            .unwrap()
            .len()
            > 32
    );
    assert_eq!("30", password_payload["data"]["userInfo"]["id"]);

    let retrieve_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}"
                ))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, retrieve_response.status());
    let retrieve_payload = response_json(retrieve_response).await;
    assert_eq!("completed", retrieve_payload["data"]["status"]);
    assert_eq!("30", retrieve_payload["data"]["userInfo"]["id"]);

    let created_event_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_security_event WHERE event_type = 'qr_auth.session.created'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, created_event_count);
    let completed_detail_json: String = sqlx::query_scalar(
        "SELECT detail_json FROM iam_security_event WHERE event_type = 'qr_auth.session.completed' LIMIT 1",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    let completed_detail: serde_json::Value = serde_json::from_str(&completed_detail_json).unwrap();
    assert_eq!(
        64,
        completed_detail["sessionKeyHash"].as_str().unwrap().len()
    );
    assert!(completed_detail.get("externalUserId").is_none());
    assert!(
        !completed_detail_json.contains(session_key),
        "security event detail must not store the raw sessionKey"
    );

    let rescan_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/scans"
                ))
                .header("content-type", "application/json")
                .body(Body::from(json!({ "scanSource": "browser" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, rescan_response.status());
    let rescan_payload = response_json(rescan_response).await;
    assert_eq!(
        "QR auth session is already completed",
        rescan_payload["msg"]
    );
}

#[tokio::test]
async fn app_auth_open_platform_qr_auth_fallback_rejects_unsafe_public_host_headers() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    let router = app_auth_router_with_settings(pool, qr_login_settings());

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/open_platform/qr_auth/sessions")
                .header("content-type", "application/json")
                .header("host", "trusted.example.test@evil.example.test?x=1")
                .header("x-forwarded-host", "forwarded.example.test#fragment")
                .body(Body::from(json!({ "purpose": "login" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    let session_key = payload["data"]["sessionKey"].as_str().unwrap();
    assert_eq!(
        format!(
            "https://localhost/auth/qr/{session_key}?session_key={session_key}&purpose=login&scan_source=browser"
        ),
        payload["data"]["fallbackUrl"]
    );
}

#[tokio::test]
async fn app_auth_open_platform_qr_auth_requires_scan_and_rejects_scan_metadata_rewrite() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    create_open_platform_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router_with_open_platform(pool.clone(), qr_login_settings());

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/open_platform/qr_auth/sessions")
                .header("content-type", "application/json")
                .body(Body::from(json!({ "purpose": "login" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = response_json(create_response).await;
    let session_key = create_payload["data"]["sessionKey"].as_str().unwrap();

    let password_before_scan = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/passwords"
                ))
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "username": "alice@example.com",
                        "password": "correct-password"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, password_before_scan.status());
    let password_before_scan_payload = response_json(password_before_scan).await;
    assert_eq!(
        "QR auth password completion requires a recorded scan",
        password_before_scan_payload["msg"]
    );

    let forged_binding_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/scans"
                ))
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "scanSource": "browser",
                        "accountId": "1001"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, forged_binding_response.status());
    let forged_binding_payload = response_json(forged_binding_response).await;
    assert_eq!(
        "accountId is not bound to this QR auth session",
        forged_binding_payload["msg"]
    );

    let scan_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/scans"
                ))
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "scanSource": "browser",
                        "externalUserId": "external-user-1",
                        "ipHash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                        "userAgent": "First Agent"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, scan_response.status());

    let duplicate_scan_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/scans"
                ))
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "scanSource": "browser",
                        "externalUserId": "external-user-1",
                        "ipHash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                        "userAgent": "First Agent"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, duplicate_scan_response.status());

    let rewrite_external_user_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/scans"
                ))
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "scanSource": "browser",
                        "externalUserId": "external-user-2",
                        "ipHash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                        "userAgent": "First Agent"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(
        StatusCode::BAD_REQUEST,
        rewrite_external_user_response.status()
    );
    let rewrite_external_user_payload = response_json(rewrite_external_user_response).await;
    assert_eq!(
        "externalUserId does not match QR login scanner",
        rewrite_external_user_payload["msg"]
    );

    let rewrite_agent_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/scans"
                ))
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "scanSource": "browser",
                        "externalUserId": "external-user-1",
                        "ipHash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                        "userAgent": "Second Agent"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, rewrite_agent_response.status());
    let rewrite_agent_payload = response_json(rewrite_agent_response).await;
    assert_eq!(
        "userAgent does not match QR login scanner",
        rewrite_agent_payload["msg"]
    );

    let scanned_event_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_security_event WHERE event_type = 'qr_auth.session.scanned'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, scanned_event_count);

    let scan_detail_json: String = sqlx::query_scalar(
        "SELECT detail_json FROM iam_security_event WHERE event_type = 'qr_auth.session.scanned' LIMIT 1",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    let scan_detail: serde_json::Value = serde_json::from_str(&scan_detail_json).unwrap();
    assert_eq!(
        test_sha256_hex("external-user-1"),
        scan_detail["externalUserIdHash"].as_str().unwrap()
    );
    assert!(!scan_detail_json.contains("external-user-1"));
    assert!(!scan_detail_json.contains("First Agent"));
}

#[tokio::test]
async fn app_auth_open_platform_qr_auth_uses_configured_mini_app_default_entry() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    create_open_platform_schema(&pool).await;
    seed_open_platform_mini_default(&pool).await;
    let router = app_auth_router_with_open_platform(pool.clone(), qr_login_settings());

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/open_platform/qr_auth/sessions")
                .header("content-type", "application/json")
                .body(Body::from(json!({ "purpose": "login" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    let session_key = payload["data"]["sessionKey"].as_str().unwrap();
    assert_eq!("mini_app_url", payload["data"]["qrContent"]["mode"]);
    assert_eq!("1001", payload["data"]["defaultAccountId"]);
    assert_eq!("2001", payload["data"]["defaultEntryId"]);
    assert_eq!("wechat", payload["data"]["defaultProvider"]);
    assert_eq!("mini_app", payload["data"]["defaultAccountType"]);
    assert_eq!(
        format!(
            "https://wxaurl.cn/sdkwork-login?session_key={session_key}&purpose=login&account_id=1001&entry_id=2001"
        ),
        payload["data"]["qrContent"]["content"]
    );

    let mismatch_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/scans"
                ))
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "scanSource": "mini_app",
                        "accountId": "9999",
                        "entryId": "2001"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, mismatch_response.status());
    let mismatch_payload = response_json(mismatch_response).await;
    assert_eq!(
        "accountId does not match QR login scanner",
        mismatch_payload["msg"]
    );

    let scan_response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/scans"
                ))
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "scanSource": "mini_app",
                        "accountId": "1001",
                        "entryId": "2001",
                        "externalUserId": "mini-user-1"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, scan_response.status());
    let scan_payload = response_json(scan_response).await;
    assert_eq!("mini_app", scan_payload["data"]["scanSource"]);
    assert_eq!("1001", scan_payload["data"]["accountId"]);
    assert_eq!("2001", scan_payload["data"]["entryId"]);
}

#[tokio::test]
async fn app_auth_open_platform_qr_auth_uses_configured_official_account_default_entry() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    create_open_platform_schema(&pool).await;
    seed_open_platform_official_default(&pool).await;
    let router = app_auth_router_with_open_platform(pool, qr_login_settings());

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/open_platform/qr_auth/sessions")
                .header("content-type", "application/json")
                .body(Body::from(json!({ "purpose": "login" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    let session_key = payload["data"]["sessionKey"].as_str().unwrap();
    assert_eq!(
        "official_account_entry",
        payload["data"]["qrContent"]["mode"]
    );
    assert_eq!("1002", payload["data"]["defaultAccountId"]);
    assert_eq!("2002", payload["data"]["defaultEntryId"]);
    assert_eq!("wechat", payload["data"]["defaultProvider"]);
    assert_eq!("official_account", payload["data"]["defaultAccountType"]);
    assert_eq!(
        format!(
            "https://mp.weixin.qq.com/sdkwork-login?campaign=auth&session_key={session_key}&purpose=login&account_id=1002&entry_id=2002"
        ),
        payload["data"]["qrContent"]["content"]
    );
}

#[tokio::test]
async fn app_auth_open_platform_qr_auth_encodes_added_qr_query_params() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    create_open_platform_schema(&pool).await;
    seed_open_platform_official_default_with_url(
        &pool,
        "https://mp.weixin.qq.com/sdkwork-login?campaign=auth%20spring",
    )
    .await;
    let router = app_auth_router_with_open_platform_and_uuid_generator(
        pool,
        qr_login_settings(),
        Arc::new(ReservedQueryUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/open_platform/qr_auth/sessions")
                .header("content-type", "application/json")
                .body(Body::from(json!({ "purpose": "register" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    let session_key = payload["data"]["sessionKey"].as_str().unwrap();
    assert_eq!(
        "official_account_entry",
        payload["data"]["qrContent"]["mode"]
    );
    assert_eq!("qr+auth/session=1", session_key);
    assert_eq!(
        "https://mp.weixin.qq.com/sdkwork-login?campaign=auth%20spring&session_key=qr%2Bauth%2Fsession%3D1&purpose=register&account_id=1002&entry_id=2002",
        payload["data"]["qrContent"]["content"]
    );
}

#[tokio::test]
async fn app_auth_open_platform_qr_auth_overrides_reserved_qr_query_params() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    create_open_platform_schema(&pool).await;
    seed_open_platform_official_default_with_url(
        &pool,
        "https://mp.weixin.qq.com/sdkwork-login?session_key=stale-session&purpose=login&account_id=stale-account&entry_id=stale-entry&campaign=auth",
    )
    .await;
    let router = app_auth_router_with_open_platform_and_uuid_generator(
        pool,
        qr_login_settings(),
        Arc::new(ReservedQueryUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/open_platform/qr_auth/sessions")
                .header("content-type", "application/json")
                .body(Body::from(json!({ "purpose": "register" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!(
        "https://mp.weixin.qq.com/sdkwork-login?campaign=auth&session_key=qr%2Bauth%2Fsession%3D1&purpose=register&account_id=1002&entry_id=2002",
        payload["data"]["qrContent"]["content"]
    );
}

#[tokio::test]
async fn app_auth_open_platform_qr_auth_falls_back_when_default_entry_is_not_scannable() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    create_open_platform_schema(&pool).await;
    seed_open_platform_mini_default_with_url(&pool, "https://example.com/not-a-wechat-mini-url")
        .await;
    let router = app_auth_router_with_open_platform(pool.clone(), qr_login_settings());

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/open_platform/qr_auth/sessions")
                .header("content-type", "application/json")
                .header("host", "console.example.test")
                .body(Body::from(json!({ "purpose": "login" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    let session_key = payload["data"]["sessionKey"].as_str().unwrap();
    assert_eq!("fallback_url", payload["data"]["qrContent"]["mode"]);
    assert_eq!("1001", payload["data"]["defaultAccountId"]);
    assert_eq!(
        format!(
            "https://console.example.test/auth/qr/{session_key}?session_key={session_key}&purpose=login&scan_source=browser"
        ),
        payload["data"]["qrContent"]["content"]
    );

    let fallback_detail_json: String = sqlx::query_scalar(
        "SELECT detail_json FROM iam_security_event WHERE event_type = 'qr_auth.session.fallback' LIMIT 1",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    let fallback_detail: serde_json::Value = serde_json::from_str(&fallback_detail_json).unwrap();
    assert_eq!(
        "mini app URL does not match provider URL rules",
        fallback_detail["reason"]
    );
    assert!(!fallback_detail_json.contains(session_key));
}

#[tokio::test]
async fn app_auth_open_platform_qr_auth_falls_back_when_default_entry_url_has_userinfo() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    create_open_platform_schema(&pool).await;
    seed_open_platform_official_default_with_url(
        &pool,
        "https://trusted.example.test@evil.example.test/sdkwork-login",
    )
    .await;
    let router = app_auth_router_with_open_platform(pool.clone(), qr_login_settings());

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/open_platform/qr_auth/sessions")
                .header("content-type", "application/json")
                .header("host", "console.example.test")
                .body(Body::from(json!({ "purpose": "login" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    let session_key = payload["data"]["sessionKey"].as_str().unwrap();
    assert_eq!("fallback_url", payload["data"]["qrContent"]["mode"]);
    assert_eq!(
        format!(
            "https://console.example.test/auth/qr/{session_key}?session_key={session_key}&purpose=login&scan_source=browser"
        ),
        payload["data"]["qrContent"]["content"]
    );

    let fallback_detail_json: String = sqlx::query_scalar(
        "SELECT detail_json FROM iam_security_event WHERE event_type = 'qr_auth.session.fallback' LIMIT 1",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    let fallback_detail: serde_json::Value = serde_json::from_str(&fallback_detail_json).unwrap();
    assert_eq!(
        "QR entry URL must not contain user info",
        fallback_detail["reason"]
    );
    assert!(!fallback_detail_json.contains("trusted.example.test@evil.example.test"));
}

#[tokio::test]
async fn app_auth_open_platform_qr_auth_registers_new_user_after_scan() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    create_open_platform_schema(&pool).await;
    seed_user(
        &pool,
        10,
        "bootstrap",
        "bootstrap@example.com",
        "Bootstrap",
        1,
    )
    .await;
    let router = app_auth_router_with_open_platform(pool.clone(), qr_login_settings());

    let create_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/open_platform/qr_auth/sessions")
                .header("content-type", "application/json")
                .body(Body::from(json!({ "purpose": "register" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, create_response.status());
    let create_payload = response_json(create_response).await;
    let session_key = create_payload["data"]["sessionKey"].as_str().unwrap();
    assert_eq!("register", create_payload["data"]["purpose"]);

    let scan_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/scans"
                ))
                .header("content-type", "application/json")
                .body(Body::from(json!({ "scanSource": "browser" }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, scan_response.status());

    let password_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/open_platform/qr_auth/sessions/{session_key}/passwords"
                ))
                .header("content-type", "application/json")
                .header("X-Request-Id", "88888888-8888-4333-8444-555555555555")
                .body(Body::from(
                    json!({
                        "username": "qr-new-user",
                        "email": "qr-new-user@example.com",
                        "channel": "EMAIL",
                        "password": "new-user-password",
                        "confirmPassword": "new-user-password"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, password_response.status());
    let password_payload = response_json(password_response).await;
    assert_eq!("completed", password_payload["data"]["status"]);
    assert_eq!(
        "qr-new-user",
        password_payload["data"]["userInfo"]["username"]
    );
    assert!(
        password_payload["data"]["session"]["authToken"]
            .as_str()
            .unwrap()
            .len()
            > 32
    );

    let created_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(1) FROM iam_user WHERE username = 'qr-new-user' AND email = 'qr-new-user@example.com'",
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert_eq!(1, created_count);
}

#[tokio::test]
async fn app_auth_runtime_settings_enable_qr_login_by_default() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    let router = app_auth_router_with_settings(pool, AdminAuthSettings::default());

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/system/iam/runtime")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!(true, payload["data"]["qrLoginEnabled"]);
}

#[tokio::test]
async fn app_auth_runtime_settings_expose_default_qr_login_type_without_provider_secrets() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    let mut settings = qr_login_settings();
    settings.qr_login_type = "mini".to_owned();
    let router = app_auth_router_with_settings(pool, settings);

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/system/iam/runtime")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("mini", payload["data"]["qrLoginType"]);
    assert!(payload["data"].get("wechat").is_none());
}

#[tokio::test]
async fn app_auth_runtime_settings_do_not_expose_legacy_auth_settings_path() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    let router = app_auth_router_with_settings(pool, qr_login_settings());

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/app/v3/api/auth/runtime_settings")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::NOT_FOUND, response.status());
}

#[tokio::test]
async fn app_auth_verification_codes_create_allows_immediate_resend_for_same_target() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router_with_settings(pool, email_code_login_settings());

    let first_response = router
        .clone()
        .oneshot(verification_code_request("alice@example.com"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, first_response.status());
    let first_payload = response_json(first_response).await;
    let first_code_id = first_payload["data"]["codeId"].as_str().unwrap();
    let first_debug_code = first_payload["data"]["debugCode"].as_str().unwrap();
    let first_expires_at = first_payload["data"]["expiresAt"].as_str().unwrap();
    assert!(!first_code_id.is_empty());
    assert_eq!("666666", first_debug_code);
    assert!(first_expires_at.ends_with('Z'));
    assert!(first_expires_at.contains('T'));

    let second_response = router
        .oneshot(verification_code_request("alice@example.com"))
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, second_response.status());
    let second_payload = response_json(second_response).await;
    let second_code_id = second_payload["data"]["codeId"].as_str().unwrap();
    let second_debug_code = second_payload["data"]["debugCode"].as_str().unwrap();
    assert!(!second_code_id.is_empty());
    assert_ne!(first_code_id, second_code_id);
    assert_eq!("666666", second_debug_code);
}

#[tokio::test]
async fn app_auth_verification_codes_create_dispatches_code_without_exposing_debug_code_in_production(
) {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let sender = Arc::new(RecordingVerificationCodeSender::default());
    let router = app_auth_router_with_sender_and_settings(
        pool,
        sender.clone(),
        false,
        email_code_login_settings(),
    );

    let response = router
        .oneshot(verification_code_request("alice@example.com"))
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert!(payload["data"]["codeId"].as_str().unwrap().len() > 12);
    assert!(payload["data"]["expiresAt"]
        .as_str()
        .unwrap()
        .ends_with('Z'));
    assert!(payload["data"].get("debugCode").is_none());

    let deliveries = sender.deliveries();
    assert_eq!(1, deliveries.len());
    let delivery = &deliveries[0];
    assert_eq!("alice@example.com", delivery.target);
    assert_eq!("LOGIN", delivery.scene);
    assert_eq!("EMAIL", delivery.channel);
    assert_eq!(6, delivery.code.len());
    assert!(delivery
        .code
        .chars()
        .all(|character| character.is_ascii_digit()));
    assert_eq!(
        payload["data"]["codeId"].as_str().unwrap(),
        delivery.code_id
    );
}

#[tokio::test]
async fn app_auth_password_reset_requests_dispatch_reset_code_without_exposing_debug_code_in_production(
) {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let sender = Arc::new(RecordingVerificationCodeSender::default());
    let router = app_auth_router_with_sender(pool, sender.clone(), false);

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/auth/password_reset_requests")
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "account": "alice@example.com",
                        "channel": "EMAIL"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert!(payload["data"]["requestId"].as_str().unwrap().len() > 12);
    assert!(payload["data"]["expiresAt"]
        .as_str()
        .unwrap()
        .ends_with('Z'));
    assert!(payload["data"].get("debugCode").is_none());

    let deliveries = sender.deliveries();
    assert_eq!(1, deliveries.len());
    let delivery = &deliveries[0];
    assert_eq!("alice@example.com", delivery.target);
    assert_eq!("RESET_PASSWORD", delivery.scene);
    assert_eq!("EMAIL", delivery.channel);
    assert_eq!(6, delivery.code.len());
    assert!(delivery
        .code
        .chars()
        .all(|character| character.is_ascii_digit()));
    assert_eq!(
        payload["data"]["requestId"].as_str().unwrap(),
        delivery.code_id
    );
}

#[tokio::test]
async fn app_auth_verification_codes_create_fails_closed_when_production_sender_is_not_configured()
{
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router_with_sender_and_settings(
        pool,
        Arc::new(RequiredConfiguredVerificationCodeSender),
        false,
        email_code_login_settings(),
    );

    let response = router
        .oneshot(verification_code_request("alice@example.com"))
        .await
        .unwrap();

    assert_eq!(StatusCode::INTERNAL_SERVER_ERROR, response.status());
    let payload = response_json(response).await;
    assert_eq!("5000", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("verification code delivery provider is not configured"));
    assert!(!payload.to_string().contains("debugCode"));
}

#[tokio::test]
async fn app_auth_verification_codes_create_returns_too_many_requests_when_sender_rate_limits() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router = app_auth_router_with_sender_and_settings(
        pool,
        Arc::new(RateLimitedVerificationCodeSender),
        false,
        email_code_login_settings(),
    );

    let response = router
        .oneshot(verification_code_request("alice@example.com"))
        .await
        .unwrap();

    assert_eq!(StatusCode::TOO_MANY_REQUESTS, response.status());
    let payload = response_json(response).await;
    assert_eq!("4290", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("verification code delivery is rate limited"));
    assert!(!payload.to_string().contains("debugCode"));
}

#[tokio::test]
async fn app_auth_registrations_create_requires_verification_code() {
    let pool = create_pool().await;
    create_minimal_auth_schema(&pool).await;
    seed_user(&pool, 30, "alice", "alice@example.com", "Alice Router", 1).await;
    let router =
        app_auth_router_with_settings(pool.clone(), email_registration_verification_settings());

    let response = router
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/auth/registrations")
                .header("content-type", "application/json")
                .body(Body::from(
                    json!({
                        "channel": "EMAIL",
                        "email": "missing-code@example.com",
                        "username": "missing-code",
                        "password": "new-user-password",
                        "confirmPassword": "new-user-password"
                    })
                    .to_string(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = response_json(response).await;
    assert_eq!("4001", payload["code"]);
    assert_eq!("verificationCode must not be empty", payload["msg"]);

    let created_count: i64 =
        sqlx::query_scalar("SELECT COUNT(1) FROM iam_user WHERE username = 'missing-code'")
            .fetch_one(&pool)
            .await
            .unwrap();
    assert_eq!(0, created_count);
}

fn app_auth_router(pool: SqlitePool) -> axum::Router {
    app_auth_router_with_cache(pool, default_desktop_cache_manager())
}

fn app_auth_router_with_cache(
    pool: SqlitePool,
    cache_manager: RuntimeCacheManager,
) -> axum::Router {
    sdkwork_claw_product::api::app_auth_router_with_store_and_cache_manager(
        Arc::new(SqliteAppAuthStore::new(pool.clone())),
        Arc::new(SqliteAppSessionEventStore::new(pool)),
        Arc::new(sdkwork_claw_product::infrastructure::OsApiKeySecretGenerator),
        trusted_subject_config(),
        app_session_config(),
        Arc::new(Pbkdf2Sha256PasswordHasher),
        cache_manager,
    )
}

fn app_auth_router_with_sender(
    pool: SqlitePool,
    sender: Arc<dyn VerificationCodeSender + Send + Sync>,
    expose_debug_code: bool,
) -> axum::Router {
    sdkwork_claw_product::api::app_auth_router_with_store_and_verification_sender(
        Arc::new(SqliteAppAuthStore::new(pool.clone())),
        Arc::new(SqliteAppSessionEventStore::new(pool)),
        Arc::new(sdkwork_claw_product::infrastructure::OsApiKeySecretGenerator),
        trusted_subject_config(),
        app_session_config(),
        Arc::new(Pbkdf2Sha256PasswordHasher),
        sender,
        expose_debug_code,
    )
}

fn app_auth_router_with_settings(pool: SqlitePool, settings: AdminAuthSettings) -> axum::Router {
    app_auth_router_with_sender_and_settings(
        pool,
        Arc::new(sdkwork_claw_product::ports::DebugVerificationCodeSender),
        true,
        settings,
    )
}

fn app_auth_router_with_open_platform(
    pool: SqlitePool,
    settings: AdminAuthSettings,
) -> axum::Router {
    app_auth_router_with_open_platform_and_uuid_generator(
        pool,
        settings,
        Arc::new(sdkwork_claw_product::infrastructure::OsApiKeySecretGenerator),
    )
}

fn app_auth_router_with_open_platform_and_uuid_generator(
    pool: SqlitePool,
    settings: AdminAuthSettings,
    entity_uuid_generator: Arc<dyn EntityUuidGenerator + Send + Sync>,
) -> axum::Router {
    sdkwork_claw_product::api::app_auth_router_with_store_auth_settings_store_open_platform_store_cache_and_verification_sender(
        Arc::new(SqliteAppAuthStore::new(pool.clone())),
        Some(Arc::new(TestAdminAuthSettingsStore::new(settings))),
        Some(Arc::new(SqliteAdminOpenPlatformStore::new(pool.clone()))),
        Arc::new(SqliteAppSessionEventStore::new(pool)),
        entity_uuid_generator,
        trusted_subject_config(),
        app_session_config(),
        Arc::new(Pbkdf2Sha256PasswordHasher),
        default_desktop_cache_manager(),
        Arc::new(sdkwork_claw_product::ports::DebugVerificationCodeSender),
        true,
    )
}

fn app_auth_router_with_sender_and_settings(
    pool: SqlitePool,
    sender: Arc<dyn VerificationCodeSender + Send + Sync>,
    expose_debug_code: bool,
    settings: AdminAuthSettings,
) -> axum::Router {
    sdkwork_claw_product::api::app_auth_router_with_store_auth_settings_store_cache_and_verification_sender(
        Arc::new(SqliteAppAuthStore::new(pool.clone())),
        Some(Arc::new(TestAdminAuthSettingsStore::new(settings))),
        Arc::new(SqliteAppSessionEventStore::new(pool)),
        Arc::new(sdkwork_claw_product::infrastructure::OsApiKeySecretGenerator),
        trusted_subject_config(),
        app_session_config(),
        Arc::new(Pbkdf2Sha256PasswordHasher),
        None,
        default_desktop_cache_manager(),
        sender,
        expose_debug_code,
    )
}

#[derive(Debug)]
struct TestAdminAuthSettingsStore {
    settings: AdminAuthSettings,
}

impl TestAdminAuthSettingsStore {
    fn new(settings: AdminAuthSettings) -> Self {
        Self {
            settings: settings.normalized(),
        }
    }
}

struct ReservedQueryUuidGenerator;

impl EntityUuidGenerator for ReservedQueryUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok("qr+auth/session=1".to_owned())
    }
}

impl AdminAuthSettingsStore for TestAdminAuthSettingsStore {
    fn get_auth_settings<'a>(
        &'a self,
        _query: GetAdminAuthSettingsQuery,
    ) -> AdminAuthSettingsFuture<'a, AdminAuthSettings> {
        Box::pin(async move { Ok(self.settings.clone()) })
    }

    fn get_auth_settings_for_scope<'a>(
        &'a self,
        _query: GetAdminAuthSettingsScopeQuery,
    ) -> AdminAuthSettingsFuture<'a, AdminAuthSettings> {
        Box::pin(async move { Ok(self.settings.clone()) })
    }

    fn update_auth_settings<'a>(
        &'a self,
        command: UpdateAdminAuthSettingsCommand,
    ) -> AdminAuthSettingsFuture<'a, AdminAuthSettings> {
        Box::pin(async move { Ok(command.settings.normalized()) })
    }
}

fn qr_login_settings() -> AdminAuthSettings {
    let mut settings = AdminAuthSettings::default();
    settings.qr_login_enabled = true;
    settings
}

fn email_code_login_settings() -> AdminAuthSettings {
    let mut settings = AdminAuthSettings::default();
    settings.verification_policy.email_code_login_enabled = true;
    settings
}

fn email_registration_verification_settings() -> AdminAuthSettings {
    let mut settings = AdminAuthSettings::default();
    settings
        .verification_policy
        .email_registration_verification_required = true;
    settings
}

#[derive(Default)]
struct RecordingVerificationCodeSender {
    deliveries: Mutex<Vec<VerificationCodeDeliveryRequest>>,
}

impl RecordingVerificationCodeSender {
    fn deliveries(&self) -> Vec<VerificationCodeDeliveryRequest> {
        self.deliveries.lock().unwrap().clone()
    }
}

impl VerificationCodeSender for RecordingVerificationCodeSender {
    fn send_verification_code<'a>(
        &'a self,
        request: VerificationCodeDeliveryRequest,
    ) -> VerificationCodeDeliveryFuture<'a, VerificationCodeDeliveryReceipt> {
        Box::pin(async move {
            let code_id = request.code_id.clone();
            self.deliveries.lock().unwrap().push(request);
            Ok(VerificationCodeDeliveryReceipt {
                provider_code: "test-provider".to_owned(),
                channel: "test-channel".to_owned(),
                message_id: format!("message-{code_id}"),
                delivered_at: "2026-05-14T00:00:00Z".to_owned(),
            })
        })
    }
}

struct RateLimitedVerificationCodeSender;

impl VerificationCodeSender for RateLimitedVerificationCodeSender {
    fn send_verification_code<'a>(
        &'a self,
        _request: VerificationCodeDeliveryRequest,
    ) -> VerificationCodeDeliveryFuture<'a, VerificationCodeDeliveryReceipt> {
        Box::pin(async {
            Err(DomainError::conflict(
                "verification code delivery is rate limited",
            ))
        })
    }
}

fn verification_code_request(target: &str) -> Request<Body> {
    Request::builder()
        .method("POST")
        .uri("/app/v3/api/auth/verification_codes")
        .header("content-type", "application/json")
        .body(Body::from(
            json!({
                "target": target,
                "scene": "LOGIN",
                "verifyType": "EMAIL"
            })
            .to_string(),
        ))
        .unwrap()
}

fn login_request(username: &str, password: &str) -> Request<Body> {
    Request::builder()
        .method("POST")
        .uri(APP_AUTH_SESSION_PATH)
        .header("content-type", "application/json")
        .header("X-Request-Id", "66666666-6666-4333-8444-555555555555")
        .body(Body::from(
            json!({
                "grantType": "password",
                "username": username,
                "password": password
            })
            .to_string(),
        ))
        .unwrap()
}

fn assert_server_request_id(value: &str, client_header_value: &str) {
    let bytes = value.as_bytes();
    assert_eq!(36, bytes.len(), "request id must be a canonical UUID");
    assert_ne!(
        client_header_value, value,
        "server-generated request id must ignore client X-Request-Id"
    );
    assert_eq!(b'-', bytes[8]);
    assert_eq!(b'-', bytes[13]);
    assert_eq!(b'-', bytes[18]);
    assert_eq!(b'-', bytes[23]);
    assert_eq!(b'4', bytes[14], "generated request id must be UUID v4");
    assert!(
        matches!(bytes[19], b'8' | b'9' | b'a' | b'b'),
        "generated request id must use RFC 4122 variant"
    );
    assert!(bytes.iter().enumerate().all(|(index, byte)| {
        matches!(index, 8 | 13 | 18 | 23) && *byte == b'-'
            || !matches!(index, 8 | 13 | 18 | 23) && byte.is_ascii_hexdigit()
    }));
}

fn app_session_config() -> AppSessionConfig {
    AppSessionConfig::from_signing_secret(APP_SESSION_SECRET).unwrap()
}

fn trusted_subject_config() -> TrustedSubjectConfig {
    TrustedSubjectConfig::from_signing_secret(TRUSTED_SUBJECT_SECRET).unwrap()
}

async fn create_pool() -> SqlitePool {
    SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .unwrap()
}

async fn create_minimal_auth_schema(pool: &SqlitePool) {
    sqlx::query(
        r#"
        CREATE TABLE iam_tenant (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_organization (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            parent_id TEXT,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_user (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            username TEXT NOT NULL,
            display_name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            avatar_url TEXT,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_organization_member (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            role_code TEXT,
            status TEXT NOT NULL,
            joined_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_credential (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            credential_type TEXT NOT NULL,
            credential_hash TEXT NOT NULL,
            status TEXT NOT NULL,
            expires_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_user_identity (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            provider TEXT NOT NULL,
            subject TEXT NOT NULL,
            email TEXT,
            created_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_session (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            user_id TEXT NOT NULL,
            app_id TEXT NOT NULL,
            environment TEXT NOT NULL,
            deployment_mode TEXT NOT NULL,
            auth_level TEXT NOT NULL,
            auth_token_hash TEXT NOT NULL,
            access_token_hash TEXT NOT NULL,
            refresh_token_hash TEXT,
            sharding_key TEXT NOT NULL,
            sharding_strategy TEXT NOT NULL,
            data_scope_json TEXT NOT NULL,
            permission_scope_json TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            revoked_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_security_event (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            user_id TEXT,
            session_id TEXT,
            event_type TEXT NOT NULL,
            severity TEXT NOT NULL,
            detail_json TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_audit_event (
            id TEXT PRIMARY KEY,
            tenant_id TEXT NOT NULL,
            organization_id TEXT,
            actor_user_id TEXT,
            action TEXT NOT NULL,
            resource_type TEXT NOT NULL,
            resource_id TEXT,
            request_id TEXT,
            app_id TEXT,
            environment TEXT,
            sharding_key TEXT,
            detail_json TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_user_preference (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            language TEXT
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_user_security_setting (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            password_last_changed_at TEXT,
            mfa_enabled INTEGER NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        CREATE TABLE iam_user_login_event (
            id INTEGER PRIMARY KEY,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            occurred_at TEXT,
            client_ip_masked TEXT
        )
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
}

async fn create_open_platform_schema(pool: &SqlitePool) {
    for statement in [
        r#"
        CREATE TABLE open_platform_account (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            account_key TEXT NOT NULL,
            name TEXT NOT NULL,
            provider TEXT NOT NULL,
            account_type TEXT NOT NULL,
            app_id TEXT,
            secret_ref TEXT,
            token_ref TEXT,
            aes_key_ref TEXT,
            default_entry_id INTEGER,
            qr_default INTEGER NOT NULL DEFAULT 0
        )
        "#,
        r#"
        CREATE TABLE open_platform_entry (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            data_scope INTEGER NOT NULL DEFAULT 1,
            status INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            version INTEGER NOT NULL DEFAULT 0,
            deleted_at TEXT,
            deleted_by INTEGER,
            metadata TEXT NOT NULL DEFAULT '{}',
            account_id INTEGER NOT NULL,
            entry_key TEXT NOT NULL,
            entry_type TEXT NOT NULL,
            entry_url TEXT NOT NULL
        )
        "#,
        r#"
        CREATE TABLE ops_audit_log (
            id INTEGER PRIMARY KEY,
            uuid TEXT NOT NULL,
            tenant_id INTEGER NOT NULL,
            organization_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            target_type INTEGER NOT NULL,
            target_id INTEGER NOT NULL,
            request_id TEXT NOT NULL,
            operator_id INTEGER NOT NULL,
            operator_type INTEGER NOT NULL,
            change_summary TEXT NOT NULL
        )
        "#,
    ] {
        sqlx::query(statement).execute(pool).await.unwrap();
    }
}

async fn seed_open_platform_mini_default(pool: &SqlitePool) {
    seed_open_platform_mini_default_with_url(pool, "https://wxaurl.cn/sdkwork-login").await;
}

async fn seed_open_platform_mini_default_with_url(pool: &SqlitePool, entry_url: &str) {
    sqlx::query(
        r#"
        INSERT INTO open_platform_account
            (id, uuid, tenant_id, organization_id, account_key, name, provider, account_type, app_id, secret_ref, token_ref, aes_key_ref, default_entry_id, qr_default, status, created_at, updated_at)
        VALUES
            (1001, 'account-1001', 10, 20, 'mini-main', 'Main Mini', 'wechat', 'mini_app', 'wxabcdef1234567890', 'secret://wechat/mini-main/secret', NULL, NULL, 2001, 1, 1, '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO open_platform_entry
            (id, uuid, tenant_id, organization_id, account_id, entry_key, entry_type, entry_url, status, created_at, updated_at)
        VALUES
            (2001, 'entry-2001', 10, 20, 1001, 'login', 'mini_app_url', ?, 1, '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .bind(entry_url)
    .execute(pool)
    .await
    .unwrap();
}

async fn seed_open_platform_official_default(pool: &SqlitePool) {
    seed_open_platform_official_default_with_url(
        pool,
        "https://mp.weixin.qq.com/sdkwork-login?campaign=auth",
    )
    .await;
}

async fn seed_open_platform_official_default_with_url(pool: &SqlitePool, entry_url: &str) {
    sqlx::query(
        r#"
        INSERT INTO open_platform_account
            (id, uuid, tenant_id, organization_id, account_key, name, provider, account_type, app_id, secret_ref, token_ref, aes_key_ref, default_entry_id, qr_default, status, created_at, updated_at)
        VALUES
            (1002, 'account-1002', 10, 20, 'oa-main', 'Main Official', 'wechat', 'official_account', 'wxofficial1234567890', 'secret://wechat/oa-main/secret', 'secret://wechat/oa-main/token', 'secret://wechat/oa-main/aes', 2002, 1, 1, '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT INTO open_platform_entry
            (id, uuid, tenant_id, organization_id, account_id, entry_key, entry_type, entry_url, status, created_at, updated_at)
        VALUES
            (2002, 'entry-2002', 10, 20, 1002, 'login', 'url', ?, 1, '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .bind(entry_url)
    .execute(pool)
    .await
    .unwrap();
}

async fn seed_user(
    pool: &SqlitePool,
    user_id: i64,
    username: &str,
    email: &str,
    nickname: &str,
    status: i64,
) {
    sqlx::query(
        r#"
        INSERT OR IGNORE INTO iam_tenant
            (id, code, name, status, created_at, updated_at)
        VALUES
            ('10', 'default', 'Default Tenant', 'active', '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();
    sqlx::query(
        r#"
        INSERT OR IGNORE INTO iam_organization
            (id, tenant_id, parent_id, code, name, path, status, created_at, updated_at)
        VALUES
            ('20', '10', NULL, 'root', 'Root Organization', '/20', 'active', '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    let password_hash = Pbkdf2Sha256PasswordHasher::hash_password_with_salt(
        "correct-password",
        b"app-auth-test-salt-000000000001",
        2_000,
    )
    .expect("test password must hash");
    sqlx::query(
        r#"
        INSERT INTO iam_user
            (id, tenant_id, username, display_name, email, phone, avatar_url, status, created_at, updated_at)
        VALUES
            (?, '10', ?, ?, ?, '+15550000030', 'https://cdn.example.com/avatar.png', ?, '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .bind(user_id.to_string())
    .bind(username)
    .bind(nickname)
    .bind(email)
    .bind(if status == 1 { "active" } else { "disabled" })
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO iam_organization_member
            (id, tenant_id, organization_id, user_id, role_code, status, joined_at)
        VALUES
            (?, '10', '20', ?, 'owner', 'active', '2026-05-01T00:00:00Z')
        "#,
    )
    .bind(format!("member-{user_id}"))
    .bind(user_id.to_string())
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO iam_credential
            (id, tenant_id, user_id, credential_type, credential_hash, status, created_at, updated_at)
        VALUES
            (?, '10', ?, 'password', ?, ?, '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .bind(format!("credential-{user_id}"))
    .bind(user_id.to_string())
    .bind(password_hash)
    .bind(if status == 1 { "active" } else { "disabled" })
    .execute(pool)
    .await
    .unwrap();
}

async fn seed_second_organization_membership(pool: &SqlitePool, user_id: i64) {
    sqlx::query(
        r#"
        INSERT OR IGNORE INTO iam_organization
            (id, tenant_id, parent_id, code, name, path, status, created_at, updated_at)
        VALUES
            ('21', '10', NULL, 'workspace', 'Workspace Organization', '/21', 'active', '2026-05-01T00:00:00Z', '2026-05-01T00:00:00Z')
        "#,
    )
    .execute(pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        INSERT INTO iam_organization_member
            (id, tenant_id, organization_id, user_id, role_code, status, joined_at)
        VALUES
            (?, '10', '21', ?, 'member', 'active', '2026-04-30T00:00:00Z')
        "#,
    )
    .bind(format!("workspace-member-{user_id}"))
    .bind(user_id.to_string())
    .execute(pool)
    .await
    .unwrap();
}

async fn response_json(response: axum::response::Response) -> serde_json::Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

fn test_sha256_hex(value: &str) -> String {
    hex::encode(Sha256::digest(value.as_bytes()))
}

fn current_unix_seconds() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .unwrap_or(0)
}
