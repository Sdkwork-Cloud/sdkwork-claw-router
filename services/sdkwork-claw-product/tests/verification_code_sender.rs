use std::sync::{Arc, Mutex};

use sdkwork_claw_product::domain::DomainError;
use sdkwork_claw_product::ports::{
    ConfiguredVerificationCodeSender, ProviderVerificationDeliveryFuture,
    ProviderVerificationDeliveryReceipt, ProviderVerificationDeliveryRequest,
    ProviderVerificationDeliverySender, VerificationCodeDeliveryRequest, VerificationCodeSender,
    VerificationDeliveryConfig, VerificationDeliveryConfigFuture, VerificationDeliveryConfigQuery,
    VerificationDeliveryConfigStore,
};

#[tokio::test]
async fn configured_verification_code_sender_selects_active_config_and_dispatches_to_provider_driver(
) {
    let config_store = Arc::new(TestConfigStore::with_config(VerificationDeliveryConfig {
        channel_id: 2002,
        account_id: 9002,
        tenant_id: 10,
        organization_id: 20,
        provider_code: "sendgrid".to_owned(),
        channel: "email".to_owned(),
        scene: "login".to_owned(),
        account_code: "email-primary".to_owned(),
        secret_ref: "vault://providers/sendgrid/account/primary".to_owned(),
        base_url: Some("https://api.sendgrid.test".to_owned()),
        template_code: Some("LOGIN_TEMPLATE".to_owned()),
        sender: Some("noreply@example.com".to_owned()),
        priority: 10,
        weight: 20,
    }));
    let driver = Arc::new(CapturingProviderSender::default());
    let sender = ConfiguredVerificationCodeSender::new(config_store.clone())
        .with_subject(10, 20)
        .with_provider_sender("sendgrid", driver.clone());

    let receipt = sender
        .send_verification_code(VerificationCodeDeliveryRequest {
            code_id: "code-1".to_owned(),
            target: "alice@example.com".to_owned(),
            scene: "LOGIN".to_owned(),
            channel: "EMAIL".to_owned(),
            code: "123456".to_owned(),
            expires_at: "2026-05-14T12:05:00Z".to_owned(),
        })
        .await
        .unwrap();

    assert_eq!("sendgrid", receipt.provider_code);
    assert_eq!("email", receipt.channel);
    assert_eq!("provider-message-code-1", receipt.message_id);

    let queries = config_store.queries();
    assert_eq!(1, queries.len());
    assert_eq!(10, queries[0].tenant_id);
    assert_eq!(20, queries[0].organization_id);
    assert_eq!("EMAIL", queries[0].channel);
    assert_eq!("LOGIN", queries[0].scene);

    let requests = driver.requests();
    assert_eq!(1, requests.len());
    assert_eq!("sendgrid", requests[0].config.provider_code);
    assert_eq!(
        "vault://providers/sendgrid/account/primary",
        requests[0].config.secret_ref
    );
    assert_eq!("alice@example.com", requests[0].delivery.target);
    assert_eq!("123456", requests[0].delivery.code);
}

#[tokio::test]
async fn configured_verification_code_sender_fails_closed_when_provider_driver_is_not_registered() {
    let config_store = Arc::new(TestConfigStore::with_config(VerificationDeliveryConfig {
        channel_id: 2004,
        account_id: 9004,
        tenant_id: 10,
        organization_id: 20,
        provider_code: "aliyun_sms".to_owned(),
        channel: "sms".to_owned(),
        scene: "register".to_owned(),
        account_code: "sms-default".to_owned(),
        secret_ref: "vault://providers/aliyun-sms/account/default".to_owned(),
        base_url: None,
        template_code: Some("SMS_REGISTER".to_owned()),
        sender: Some("SDKWORK".to_owned()),
        priority: 10,
        weight: 10,
    }));
    let sender = ConfiguredVerificationCodeSender::new(config_store);

    let error = sender
        .send_verification_code(VerificationCodeDeliveryRequest {
            code_id: "code-2".to_owned(),
            target: "+15555550100".to_owned(),
            scene: "REGISTER".to_owned(),
            channel: "SMS".to_owned(),
            code: "123456".to_owned(),
            expires_at: "2026-05-14T12:05:00Z".to_owned(),
        })
        .await
        .unwrap_err();

    assert!(
        error.to_string().contains(
            "verification code delivery sender is not registered for provider aliyun_sms"
        ),
        "unexpected error: {error}"
    );
}

#[derive(Debug)]
struct TestConfigStore {
    config: Option<VerificationDeliveryConfig>,
    queries: Mutex<Vec<VerificationDeliveryConfigQuery>>,
}

impl TestConfigStore {
    fn with_config(config: VerificationDeliveryConfig) -> Self {
        Self {
            config: Some(config),
            queries: Mutex::new(Vec::new()),
        }
    }

    fn queries(&self) -> Vec<VerificationDeliveryConfigQuery> {
        self.queries.lock().unwrap().clone()
    }
}

impl VerificationDeliveryConfigStore for TestConfigStore {
    fn active_config_for<'a>(
        &'a self,
        query: VerificationDeliveryConfigQuery,
    ) -> VerificationDeliveryConfigFuture<'a, Option<VerificationDeliveryConfig>> {
        Box::pin(async move {
            self.queries.lock().unwrap().push(query);
            Ok(self.config.clone())
        })
    }
}

#[derive(Debug, Default)]
struct CapturingProviderSender {
    requests: Mutex<Vec<ProviderVerificationDeliveryRequest>>,
}

impl CapturingProviderSender {
    fn requests(&self) -> Vec<ProviderVerificationDeliveryRequest> {
        self.requests.lock().unwrap().clone()
    }
}

impl ProviderVerificationDeliverySender for CapturingProviderSender {
    fn send_with_config<'a>(
        &'a self,
        request: ProviderVerificationDeliveryRequest,
    ) -> ProviderVerificationDeliveryFuture<'a, ProviderVerificationDeliveryReceipt> {
        Box::pin(async move {
            self.requests.lock().unwrap().push(request.clone());
            Ok(ProviderVerificationDeliveryReceipt {
                message_id: format!("provider-message-{}", request.delivery.code_id),
                delivered_at: "2026-05-14T12:00:00Z".to_owned(),
            })
        })
    }
}

#[derive(Debug)]
struct _FailingProviderSender;

impl ProviderVerificationDeliverySender for _FailingProviderSender {
    fn send_with_config<'a>(
        &'a self,
        _request: ProviderVerificationDeliveryRequest,
    ) -> ProviderVerificationDeliveryFuture<'a, ProviderVerificationDeliveryReceipt> {
        Box::pin(async { Err(DomainError::new("test provider failure")) })
    }
}
