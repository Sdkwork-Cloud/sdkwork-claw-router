use std::sync::{Arc, Mutex};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::ports::{
    AdminCouponBatchItem, AdminCouponItem, AdminExchangeRuleItem, AdminMarketingCommandFuture,
    AdminMarketingStore, AdminPaymentAttemptItem, AdminPromoCodeItem, AdminRechargePackageItem,
    AdminRechargeRecordItem, AdminRedemptionRecordItem, AdminReferralStatItem,
    CreateAdminCouponCommand, CreateAdminRechargePackageCommand, DeleteAdminCouponCommand,
    DeleteAdminRechargePackageCommand, GenerateAdminCouponBatchCommand,
    ListAdminCouponBatchesQuery, ListAdminCouponsQuery, ListAdminExchangeRulesQuery,
    ListAdminPaymentAttemptsQuery, ListAdminPromoCodesQuery, ListAdminRechargePackagesQuery,
    ListAdminRechargeRecordsQuery, ListAdminRedemptionRecordsQuery, ListAdminReferralStatsQuery,
    LoadAdminRechargeRecordQuery, UpdateAdminCouponCommand, UpdateAdminExchangeRuleCommand,
    UpdateAdminPromoCodeStatusCommand, UpdateAdminRechargePackageCommand,
};
use serde_json::Value;
use tower::ServiceExt;

#[tokio::test]
async fn admin_marketing_route_lists_all_marketing_read_models() {
    let router = sdkwork_claw_product::api::admin_marketing_router_with_store(
        Arc::new(TestAdminMarketingStore::default()),
        Arc::new(TestUuidGenerator),
    );

    let coupons = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/coupons", ""),
    )
    .await;
    assert_eq!("2000", coupons["code"]);
    assert_eq!("Welcome credit", coupons["data"]["items"][0]["name"]);
    assert_eq!("amount", coupons["data"]["items"][0]["type"]);
    assert_eq!("$5.00", coupons["data"]["items"][0]["value"]);

    let batches = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/coupon_batches", ""),
    )
    .await;
    assert_eq!("Welcome batch", batches["data"]["items"][0]["name"]);
    assert_eq!("1", batches["data"]["items"][0]["couponId"]);
    assert_eq!(2, batches["data"]["items"][0]["count"]);
    assert_eq!("WELCOME", batches["data"]["items"][0]["prefix"]);

    let promo_codes = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/coupon_codes", ""),
    )
    .await;
    assert_eq!("WELCOME-0001", promo_codes["data"]["items"][0]["code"]);
    assert_eq!("available", promo_codes["data"]["items"][0]["status"]);
    assert_eq!(
        "owner@example.com",
        promo_codes["data"]["items"][1]["usedBy"]
    );

    let redemptions = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/users/coupons", ""),
    )
    .await;
    assert_eq!("30", redemptions["data"]["items"][0]["userId"]);
    assert_eq!("owner@example.com", redemptions["data"]["items"][0]["user"]);
    assert_eq!("$5.00", redemptions["data"]["items"][0]["amount"]);

    let recharges = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/recharges/records", ""),
    )
    .await;
    assert_eq!("recharge-100", recharges["data"]["items"][0]["tradeNo"]);
    assert_eq!("1000", recharges["data"]["items"][0]["usd_credited"]);
    assert_eq!("stripe", recharges["data"]["items"][0]["method"]);

    let recharge = request_json(
        router.clone(),
        signed_request(
            "GET",
            "/backend/v3/api/billing/recharges/records/recharge-100",
            "",
        ),
    )
    .await;
    assert_eq!("recharge-100", recharge["data"]["item"]["tradeNo"]);
    assert_eq!("30", recharge["data"]["item"]["userId"]);
    assert_eq!("completed", recharge["data"]["item"]["status"]);

    let recharge_packages = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/recharges/packages", ""),
    )
    .await;
    assert_eq!("100", recharge_packages["data"]["items"][0]["id"]);
    assert_eq!("10.00", recharge_packages["data"]["items"][0]["rmb"]);
    assert_eq!(25, recharge_packages["data"]["items"][0]["bonus"]);
    assert_eq!(125, recharge_packages["data"]["items"][0]["points"]);

    let exchange_rules = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/exchange_rules", ""),
    )
    .await;
    assert_eq!("exchange-1", exchange_rules["data"][0]["id"]);
    assert_eq!("POINTS", exchange_rules["data"][0]["sourceAssetType"]);
    assert_eq!("CASH", exchange_rules["data"][0]["targetAssetType"]);
    assert_eq!("120", exchange_rules["data"][0]["rate"]);
    assert_eq!("active", exchange_rules["data"][0]["status"]);

    let payment_attempts = request_json(
        router.clone(),
        signed_request("GET", "/backend/v3/api/billing/payments/attempts", ""),
    )
    .await;
    assert_eq!("payment-1", payment_attempts["data"]["items"][0]["id"]);
    assert_eq!("order-100", payment_attempts["data"]["items"][0]["orderNo"]);
    assert_eq!("wechat", payment_attempts["data"]["items"][0]["provider"]);
    assert_eq!("25.50", payment_attempts["data"]["items"][0]["amount"]);
    assert_eq!("success", payment_attempts["data"]["items"][0]["status"]);

    let referrals = request_json(
        router,
        signed_request("GET", "/backend/v3/api/router/referrals/stats", ""),
    )
    .await;
    assert_eq!("Owner", referrals["data"]["items"][0]["inviter"]);
    assert_eq!(3, referrals["data"]["items"][0]["total_invited"]);
    assert_eq!("$120.00", referrals["data"]["items"][0]["total_revenue"]);
}

#[tokio::test]
async fn admin_marketing_route_creates_deletes_generates_and_updates_codes() {
    let store = Arc::new(TestAdminMarketingStore::default());
    let router = sdkwork_claw_product::api::admin_marketing_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let create_coupon = request_json(
        router.clone(),
        signed_request(
            "POST",
            "/backend/v3/api/billing/coupons",
            r#"{"name":"Launch credit","type":"amount","value":"$8.50"}"#,
        ),
    )
    .await;
    assert_eq!("Launch credit", create_coupon["data"]["item"]["name"]);
    assert_eq!("$8.50", create_coupon["data"]["item"]["value"]);
    assert_eq!("active", create_coupon["data"]["item"]["status"]);

    let update_coupon = request_json(
        router.clone(),
        signed_request(
            "PUT",
            "/backend/v3/api/billing/coupons/99",
            r#"{"name":"Launch credit updated","type":"discount","value":"15%","status":"inactive"}"#,
        ),
    )
    .await;
    assert_eq!("99", update_coupon["data"]["item"]["id"]);
    assert_eq!(
        "Launch credit updated",
        update_coupon["data"]["item"]["name"]
    );
    assert_eq!("discount", update_coupon["data"]["item"]["type"]);
    assert_eq!("15.00%", update_coupon["data"]["item"]["value"]);
    assert_eq!("inactive", update_coupon["data"]["item"]["status"]);

    let generate_batch = request_json(
        router.clone(),
        signed_request(
            "POST",
            "/backend/v3/api/billing/coupon_batches",
            r#"{"couponId":"99","name":"Launch batch","count":3,"prefix":"LAUNCH"}"#,
        ),
    )
    .await;
    assert_eq!("Launch batch", generate_batch["data"]["batch"]["name"]);
    assert_eq!(3, generate_batch["data"]["codes"].as_array().unwrap().len());
    assert_eq!("LAUNCH-0001", generate_batch["data"]["codes"][0]["code"]);

    let update_status = request_json(
        router.clone(),
        signed_request(
            "PATCH",
            "/backend/v3/api/billing/coupon_codes/501/status",
            r#"{"status":"voided"}"#,
        ),
    )
    .await;
    assert_eq!(true, update_status["data"]["updated"]);

    let create_package = request_json(
        router.clone(),
        signed_request(
            "POST",
            "/backend/v3/api/billing/recharges/packages",
            r#"{"rmb":"12.00","bonus":30,"status":"active"}"#,
        ),
    )
    .await;
    assert_eq!("901", create_package["data"]["item"]["id"]);
    assert_eq!("12.00", create_package["data"]["item"]["rmb"]);
    assert_eq!(30, create_package["data"]["item"]["bonus"]);
    assert_eq!(150, create_package["data"]["item"]["points"]);

    let update_package = request_json(
        router.clone(),
        signed_request(
            "PUT",
            "/backend/v3/api/billing/recharges/packages/901",
            r#"{"rmb":"20.00","bonus":50,"status":"inactive"}"#,
        ),
    )
    .await;
    assert_eq!("901", update_package["data"]["item"]["id"]);
    assert_eq!("20.00", update_package["data"]["item"]["rmb"]);
    assert_eq!(50, update_package["data"]["item"]["bonus"]);
    assert_eq!(250, update_package["data"]["item"]["points"]);

    let update_exchange_rule = request_json(
        router.clone(),
        signed_request(
            "PUT",
            "/backend/v3/api/billing/exchange_rules",
            r#"{"sourceAssetType":"points","targetAssetType":"cash","rate":"250.000000","status":"active"}"#,
        ),
    )
    .await;
    assert_eq!(
        "exchange-upserted",
        update_exchange_rule["data"]["item"]["id"]
    );
    assert_eq!(
        "POINTS",
        update_exchange_rule["data"]["item"]["sourceAssetType"]
    );
    assert_eq!(
        "CASH",
        update_exchange_rule["data"]["item"]["targetAssetType"]
    );
    assert_eq!("250", update_exchange_rule["data"]["item"]["rate"]);
    assert_eq!("active", update_exchange_rule["data"]["item"]["status"]);

    let delete_package = request_json(
        router.clone(),
        signed_request(
            "DELETE",
            "/backend/v3/api/billing/recharges/packages/901",
            "",
        ),
    )
    .await;
    assert_eq!(true, delete_package["data"]["deleted"]);

    let delete_coupon = request_json(
        router,
        signed_request("DELETE", "/backend/v3/api/billing/coupons/99", ""),
    )
    .await;
    assert_eq!(true, delete_coupon["data"]["deleted"]);

    assert_eq!(
        vec![
            "create_coupon",
            "update_coupon",
            "generate_batch",
            "update_promo_code_status",
            "create_recharge_package",
            "update_recharge_package",
            "update_exchange_rule",
            "delete_recharge_package",
            "delete_coupon"
        ],
        *store.commands.lock().unwrap()
    );
}

#[tokio::test]
async fn admin_marketing_route_rejects_missing_trusted_subject() {
    let router = sdkwork_claw_product::api::admin_marketing_router_with_store(
        Arc::new(TestAdminMarketingStore::default()),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/backend/v3/api/router/referrals/stats")
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
async fn admin_marketing_route_rejects_invalid_batch_count_without_calling_store() {
    let store = Arc::new(TestAdminMarketingStore::default());
    let router = sdkwork_claw_product::api::admin_marketing_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(signed_request(
            "POST",
            "/backend/v3/api/billing/coupon_batches",
            r#"{"couponId":"1","name":"Invalid","count":0,"prefix":"BAD"}"#,
        ))
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("count must be between"));
    assert!(store.commands.lock().unwrap().is_empty());
}

#[tokio::test]
async fn admin_marketing_route_rejects_inactive_exchange_rules_without_calling_store() {
    let store = Arc::new(TestAdminMarketingStore::default());
    let router = sdkwork_claw_product::api::admin_marketing_router_with_store(
        store.clone(),
        Arc::new(TestUuidGenerator),
    );

    let response = router
        .oneshot(signed_request(
            "PUT",
            "/backend/v3/api/billing/exchange_rules",
            r#"{"sourceAssetType":"POINTS","targetAssetType":"CASH","rate":"250","status":"inactive"}"#,
        ))
        .await
        .unwrap();

    assert_eq!(StatusCode::BAD_REQUEST, response.status());
    let payload = json_payload(response).await;
    assert_eq!("4001", payload["code"]);
    assert!(payload["msg"]
        .as_str()
        .unwrap()
        .contains("exchange rule status only supports active"));
    assert!(store.commands.lock().unwrap().is_empty());
}

fn signed_request(method: &str, path: &str, body: &str) -> Request<Body> {
    Request::builder()
        .method(method)
        .uri(path)
        .header("content-type", "application/json")
        .header("x-sdkwork-tenant-id", "10")
        .header("x-sdkwork-organization-id", "20")
        .header("x-sdkwork-user-id", "30")
        .header("X-Request-Id", "request-admin-marketing-test")
        .body(Body::from(body.to_owned()))
        .unwrap()
}

async fn request_json(router: axum::Router, request: Request<Body>) -> Value {
    let response = router.oneshot(request).await.unwrap();
    assert_eq!(StatusCode::OK, response.status());
    json_payload(response).await
}

async fn json_payload(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

#[derive(Default)]
struct TestAdminMarketingStore {
    commands: Mutex<Vec<&'static str>>,
}

impl AdminMarketingStore for TestAdminMarketingStore {
    fn list_coupons<'a>(
        &'a self,
        query: ListAdminCouponsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminCouponItem>> {
        Box::pin(async move {
            assert_eq!(10, query.subject.tenant_id);
            Ok(vec![AdminCouponItem {
                id: "1".to_owned(),
                name: "Welcome credit".to_owned(),
                coupon_type: "amount".to_owned(),
                value: "$5.00".to_owned(),
                status: "active".to_owned(),
            }])
        })
    }

    fn create_coupon<'a>(
        &'a self,
        command: CreateAdminCouponCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminCouponItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("create_coupon");
            assert_eq!(20, command.subject.organization_id);
            assert_eq!(850, command.amount_cents);
            Ok(AdminCouponItem {
                id: "99".to_owned(),
                name: command.name,
                coupon_type: command.coupon_type,
                value: command.value,
                status: "active".to_owned(),
            })
        })
    }

    fn delete_coupon<'a>(
        &'a self,
        command: DeleteAdminCouponCommand,
    ) -> AdminMarketingCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("delete_coupon");
            assert_eq!(99, command.coupon_id);
            Ok(true)
        })
    }

    fn update_coupon<'a>(
        &'a self,
        command: UpdateAdminCouponCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminCouponItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_coupon");
            assert_eq!(99, command.coupon_id);
            assert_eq!("Launch credit updated", command.name);
            assert_eq!("discount", command.coupon_type);
            assert_eq!("15.00%", command.value);
            assert_eq!(0, command.amount_cents);
            assert_eq!(Some("15.0000".to_owned()), command.discount_value);
            assert_eq!("inactive", command.status);
            Ok(AdminCouponItem {
                id: command.coupon_id.to_string(),
                name: command.name,
                coupon_type: command.coupon_type,
                value: command.value,
                status: command.status,
            })
        })
    }

    fn list_batches<'a>(
        &'a self,
        query: ListAdminCouponBatchesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminCouponBatchItem>> {
        Box::pin(async move {
            assert_eq!(30, query.subject.operator_id);
            Ok(vec![AdminCouponBatchItem {
                id: "11".to_owned(),
                coupon_id: "1".to_owned(),
                name: "Welcome batch".to_owned(),
                count: 2,
                prefix: "WELCOME".to_owned(),
                created_at: "2026-04-29 09:00:00".to_owned(),
            }])
        })
    }

    fn generate_batch<'a>(
        &'a self,
        command: GenerateAdminCouponBatchCommand,
    ) -> AdminMarketingCommandFuture<'a, (AdminCouponBatchItem, Vec<AdminPromoCodeItem>)> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("generate_batch");
            assert_eq!(99, command.coupon_id);
            assert_eq!(3, command.count);
            let batch = AdminCouponBatchItem {
                id: "12".to_owned(),
                coupon_id: command.coupon_id.to_string(),
                name: command.name,
                count: command.count,
                prefix: command.prefix.clone(),
                created_at: command.requested_at,
            };
            let codes = (1..=command.count)
                .map(|sequence| AdminPromoCodeItem {
                    id: format!("{}", 500 + sequence),
                    batch_id: "12".to_owned(),
                    code: format!("{}-{sequence:04}", command.prefix),
                    status: "available".to_owned(),
                    used_by: None,
                    used_at: None,
                })
                .collect();
            Ok((batch, codes))
        })
    }

    fn list_promo_codes<'a>(
        &'a self,
        _query: ListAdminPromoCodesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminPromoCodeItem>> {
        Box::pin(async move {
            Ok(vec![
                AdminPromoCodeItem {
                    id: "501".to_owned(),
                    batch_id: "11".to_owned(),
                    code: "WELCOME-0001".to_owned(),
                    status: "available".to_owned(),
                    used_by: None,
                    used_at: None,
                },
                AdminPromoCodeItem {
                    id: "502".to_owned(),
                    batch_id: "11".to_owned(),
                    code: "WELCOME-0002".to_owned(),
                    status: "used".to_owned(),
                    used_by: Some("owner@example.com".to_owned()),
                    used_at: Some("2026-04-29 09:30:00".to_owned()),
                },
            ])
        })
    }

    fn update_promo_code_status<'a>(
        &'a self,
        command: UpdateAdminPromoCodeStatusCommand,
    ) -> AdminMarketingCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands
                .lock()
                .unwrap()
                .push("update_promo_code_status");
            assert_eq!(501, command.promo_code_id);
            assert_eq!("voided", command.status);
            Ok(true)
        })
    }

    fn list_redemption_records<'a>(
        &'a self,
        _query: ListAdminRedemptionRecordsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminRedemptionRecordItem>> {
        Box::pin(async move {
            Ok(vec![AdminRedemptionRecordItem {
                id: "502".to_owned(),
                user_id: "30".to_owned(),
                user: "owner@example.com".to_owned(),
                code: "WELCOME-0002".to_owned(),
                amount: "$5.00".to_owned(),
                time: "2026-04-29 09:30:00".to_owned(),
            }])
        })
    }

    fn list_recharge_records<'a>(
        &'a self,
        _query: ListAdminRechargeRecordsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminRechargeRecordItem>> {
        Box::pin(async move {
            Ok(vec![AdminRechargeRecordItem {
                id: "701".to_owned(),
                trade_no: "recharge-100".to_owned(),
                user_id: "30".to_owned(),
                user: "owner@example.com".to_owned(),
                amount: "$10.00".to_owned(),
                usd_credited: "1000".to_owned(),
                method: "stripe".to_owned(),
                status: "success".to_owned(),
                time: "2026-04-29 10:00:00".to_owned(),
            }])
        })
    }

    fn load_recharge_record<'a>(
        &'a self,
        query: LoadAdminRechargeRecordQuery,
    ) -> AdminMarketingCommandFuture<'a, Option<AdminRechargeRecordItem>> {
        Box::pin(async move {
            assert_eq!("recharge-100", query.order_no);
            Ok(Some(AdminRechargeRecordItem {
                id: "100".to_owned(),
                trade_no: "recharge-100".to_owned(),
                user_id: "30".to_owned(),
                user: "owner@example.com".to_owned(),
                amount: "10.00".to_owned(),
                usd_credited: "1000".to_owned(),
                method: "stripe".to_owned(),
                status: "completed".to_owned(),
                time: "2026-04-29 10:00:00".to_owned(),
            }))
        })
    }

    fn list_recharge_packages<'a>(
        &'a self,
        query: ListAdminRechargePackagesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminRechargePackageItem>> {
        Box::pin(async move {
            assert_eq!(10, query.subject.tenant_id);
            Ok(vec![AdminRechargePackageItem {
                id: "100".to_owned(),
                rmb: "10.00".to_owned(),
                bonus: 25,
                points: 125,
            }])
        })
    }

    fn list_exchange_rules<'a>(
        &'a self,
        query: ListAdminExchangeRulesQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminExchangeRuleItem>> {
        Box::pin(async move {
            assert_eq!(10, query.subject.tenant_id);
            if let Some(source_asset_type) = query.source_asset_type.as_deref() {
                assert_eq!("POINTS", source_asset_type);
            }
            if let Some(target_asset_type) = query.target_asset_type.as_deref() {
                assert_eq!("CASH", target_asset_type);
            }
            if let Some(status) = query.status.as_deref() {
                assert_eq!("active", status);
            }
            Ok(vec![AdminExchangeRuleItem {
                id: "exchange-1".to_owned(),
                source_asset_type: "POINTS".to_owned(),
                target_asset_type: "CASH".to_owned(),
                rate: "120".to_owned(),
                status: "active".to_owned(),
            }])
        })
    }

    fn create_recharge_package<'a>(
        &'a self,
        command: CreateAdminRechargePackageCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminRechargePackageItem> {
        Box::pin(async move {
            self.commands
                .lock()
                .unwrap()
                .push("create_recharge_package");
            assert_eq!("12.00", command.rmb);
            assert_eq!(30, command.bonus);
            Ok(AdminRechargePackageItem {
                id: "901".to_owned(),
                rmb: command.rmb,
                bonus: command.bonus,
                points: 150,
            })
        })
    }

    fn update_recharge_package<'a>(
        &'a self,
        command: UpdateAdminRechargePackageCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminRechargePackageItem> {
        Box::pin(async move {
            self.commands
                .lock()
                .unwrap()
                .push("update_recharge_package");
            assert_eq!(901, command.package_id);
            assert_eq!("20.00", command.rmb);
            assert_eq!(50, command.bonus);
            Ok(AdminRechargePackageItem {
                id: command.package_id.to_string(),
                rmb: command.rmb,
                bonus: command.bonus,
                points: 250,
            })
        })
    }

    fn update_exchange_rule<'a>(
        &'a self,
        command: UpdateAdminExchangeRuleCommand,
    ) -> AdminMarketingCommandFuture<'a, AdminExchangeRuleItem> {
        Box::pin(async move {
            self.commands.lock().unwrap().push("update_exchange_rule");
            assert_eq!(10, command.subject.tenant_id);
            assert_eq!(20, command.subject.organization_id);
            assert_eq!("POINTS", command.source_asset_type);
            assert_eq!("CASH", command.target_asset_type);
            assert_eq!("250", command.rate);
            Ok(AdminExchangeRuleItem {
                id: "exchange-upserted".to_owned(),
                source_asset_type: command.source_asset_type,
                target_asset_type: command.target_asset_type,
                rate: command.rate,
                status: "active".to_owned(),
            })
        })
    }

    fn delete_recharge_package<'a>(
        &'a self,
        command: DeleteAdminRechargePackageCommand,
    ) -> AdminMarketingCommandFuture<'a, bool> {
        Box::pin(async move {
            self.commands
                .lock()
                .unwrap()
                .push("delete_recharge_package");
            assert_eq!(901, command.package_id);
            Ok(true)
        })
    }

    fn list_payment_attempts<'a>(
        &'a self,
        query: ListAdminPaymentAttemptsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminPaymentAttemptItem>> {
        Box::pin(async move {
            assert_eq!(10, query.subject.tenant_id);
            Ok(vec![AdminPaymentAttemptItem {
                id: "payment-1".to_owned(),
                order_no: "order-100".to_owned(),
                provider: "wechat".to_owned(),
                amount: "25.50".to_owned(),
                status: "success".to_owned(),
                created_at: "2026-04-29 09:10:00".to_owned(),
            }])
        })
    }

    fn list_referral_stats<'a>(
        &'a self,
        _query: ListAdminReferralStatsQuery,
    ) -> AdminMarketingCommandFuture<'a, Vec<AdminReferralStatItem>> {
        Box::pin(async move {
            Ok(vec![AdminReferralStatItem {
                id: "801".to_owned(),
                inviter: "Owner".to_owned(),
                total_invited: 3,
                total_revenue: "$120.00".to_owned(),
                bonus_awarded: "$12.00".to_owned(),
                link: "https://claw.local/invite/OWNER".to_owned(),
            }])
        })
    }
}

struct TestUuidGenerator;

impl EntityUuidGenerator for TestUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        Ok("entity-uuid-test".to_owned())
    }
}
