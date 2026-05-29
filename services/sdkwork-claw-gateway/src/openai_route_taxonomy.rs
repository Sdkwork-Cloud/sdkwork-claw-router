use axum::http::Method;
use sdkwork_claw_product::domain::{BillingMeter, RoutingCapability};

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct OpenAiRouteClassification {
    pub(crate) route_key: &'static str,
    pub(crate) capability: RoutingCapability,
    pub(crate) billing_meter: BillingMeter,
    model_routing: ModelRoutingMode,
}

impl OpenAiRouteClassification {
    pub(crate) fn routes_model_when_present(&self) -> bool {
        matches!(
            self.model_routing,
            ModelRoutingMode::Required | ModelRoutingMode::Optional
        )
    }

    pub(crate) fn permits_missing_model(&self) -> bool {
        matches!(
            self.model_routing,
            ModelRoutingMode::Optional | ModelRoutingMode::Ignored
        )
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ModelRoutingMode {
    Required,
    Optional,
    Ignored,
}

pub(crate) fn classify_openai_route(method: &Method, path: &str) -> OpenAiRouteClassification {
    if method_is_read(method) && path == "/v1/models" {
        return management("openai/management/models", RoutingCapability::Chat);
    }
    if model_path(path) {
        return model_action(
            "openai/model/models",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if chat_completion_model_action_path(method, path) {
        return model_action(
            "openai/model/chat_completions",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if chat_completion_path(path) {
        return management(
            "openai/management/chat_completions",
            RoutingCapability::Chat,
        );
    }
    if method == Method::POST && path == "/v1/completions" {
        return model_action(
            "openai/model/completions",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if method == Method::POST && path == "/v1/moderations" {
        return model_action(
            "openai/model/moderations",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if response_model_action_path(method, path) {
        return model_action(
            "openai/model/responses",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if image_model_action_path(method, path) {
        return model_action(
            "openai/model/images",
            RoutingCapability::Image,
            BillingMeter::ImageResult,
        );
    }
    if audio_model_action_path(method, path) {
        return model_action(
            "openai/model/audio",
            RoutingCapability::Audio,
            BillingMeter::AudioInputSecond,
        );
    }
    if video_model_action_path(method, path) {
        return model_action(
            "openai/model/videos",
            RoutingCapability::Video,
            BillingMeter::VideoResult,
        );
    }
    if realtime_model_action_path(method, path) {
        return model_action(
            "openai/model/realtime",
            RoutingCapability::Audio,
            BillingMeter::AudioInputSecond,
        );
    }
    if assistants_required_model_action_path(method, path) {
        return model_action(
            "openai/model/assistants",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if fine_tuning_required_model_action_path(method, path) {
        return model_action(
            "openai/model/fine_tuning",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if optional_chat_model_path(method, path) {
        return optional_model_management(
            "openai/management/threads",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if optional_assistant_model_path(method, path) {
        return optional_model_management(
            "openai/management/assistants",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if optional_fine_tuning_model_path(method, path) {
        return optional_model_management(
            "openai/management/fine_tuning",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if optional_eval_model_path(method, path) {
        return optional_model_management(
            "openai/management/evals",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if optional_video_model_path(method, path) {
        return optional_model_management(
            "openai/management/videos",
            RoutingCapability::Video,
            BillingMeter::VideoResult,
        );
    }
    if video_management_path(path) {
        return management("openai/management/videos", RoutingCapability::Video);
    }
    if files_path(path) {
        return management("openai/management/files", RoutingCapability::Network);
    }
    if uploads_path(path) {
        return management("openai/management/uploads", RoutingCapability::Network);
    }
    if audio_voice_management_path(path) {
        return management("openai/management/audio_voices", RoutingCapability::Audio);
    }
    if response_management_path(path) {
        return management("openai/management/responses", RoutingCapability::Chat);
    }
    if vector_store_path(path) {
        return management(
            "openai/management/vector_stores",
            RoutingCapability::Network,
        );
    }
    if assistants_path(path) {
        return management("openai/management/assistants", RoutingCapability::Chat);
    }
    if threads_path(path) {
        return management("openai/management/threads", RoutingCapability::Chat);
    }
    if batches_path(path) {
        return management("openai/management/batches", RoutingCapability::Network);
    }
    if fine_tuning_path(path) {
        return management("openai/management/fine_tuning", RoutingCapability::Network);
    }
    if conversations_path(path) {
        return management("openai/management/conversations", RoutingCapability::Chat);
    }
    if containers_path(path) {
        return management("openai/management/containers", RoutingCapability::Network);
    }
    if evals_path(path) {
        return management("openai/management/evals", RoutingCapability::Network);
    }
    if skills_path(path) {
        return management("openai/management/skills", RoutingCapability::Network);
    }
    if organization_path(path) {
        return management("openai/management/organization", RoutingCapability::Network);
    }
    if projects_path(path) {
        return management("openai/management/projects", RoutingCapability::Network);
    }
    if realtime_management_path(path) {
        return management("openai/management/realtime_calls", RoutingCapability::Audio);
    }
    management("openai/management/default", RoutingCapability::Network)
}

fn model_action(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
) -> OpenAiRouteClassification {
    OpenAiRouteClassification {
        route_key,
        capability,
        billing_meter,
        model_routing: ModelRoutingMode::Required,
    }
}

fn management(route_key: &'static str, capability: RoutingCapability) -> OpenAiRouteClassification {
    OpenAiRouteClassification {
        route_key,
        capability,
        billing_meter: BillingMeter::ApiRequest,
        model_routing: ModelRoutingMode::Ignored,
    }
}

fn optional_model_management(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
) -> OpenAiRouteClassification {
    OpenAiRouteClassification {
        route_key,
        capability,
        billing_meter,
        model_routing: ModelRoutingMode::Optional,
    }
}

fn method_is_read(method: &Method) -> bool {
    matches!(method, &Method::GET | &Method::HEAD)
}

fn method_writes_resource(method: &Method) -> bool {
    matches!(method, &Method::POST | &Method::PUT | &Method::PATCH)
}

fn exact_or_prefix(path: &str, exact: &str, prefix: &str) -> bool {
    path == exact || path.starts_with(prefix)
}

fn model_path(path: &str) -> bool {
    path.starts_with("/v1/models/")
}

fn chat_completion_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/chat/completions", "/v1/chat/completions/")
}

fn chat_completion_model_action_path(method: &Method, path: &str) -> bool {
    method == Method::POST && path == "/v1/chat/completions"
}

fn response_model_action_path(method: &Method, path: &str) -> bool {
    method == Method::POST
        && (path == "/v1/responses"
            || path == "/v1/responses/input_tokens"
            || path == "/v1/responses/compact")
}

fn response_management_path(path: &str) -> bool {
    path.starts_with("/v1/responses/")
}

fn files_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/files", "/v1/files/")
}

fn uploads_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/uploads", "/v1/uploads/")
}

fn image_model_action_path(method: &Method, path: &str) -> bool {
    method == Method::POST && path.starts_with("/v1/images/")
}

fn audio_model_action_path(method: &Method, path: &str) -> bool {
    method == Method::POST
        && (path == "/v1/audio/speech"
            || path == "/v1/audio/transcriptions"
            || path == "/v1/audio/translations")
}

fn audio_voice_management_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/audio/voices", "/v1/audio/voices/")
        || exact_or_prefix(
            path,
            "/v1/audio/voice_consents",
            "/v1/audio/voice_consents/",
        )
}

fn video_model_action_path(method: &Method, path: &str) -> bool {
    method == Method::POST && path == "/v1/videos"
}

fn video_management_path(path: &str) -> bool {
    path == "/v1/videos" || path.starts_with("/v1/videos/")
}

fn realtime_model_action_path(method: &Method, path: &str) -> bool {
    method == Method::POST
        && (path == "/v1/realtime/calls"
            || path == "/v1/realtime/client_secrets"
            || path == "/v1/realtime/sessions"
            || path == "/v1/realtime/transcription_sessions"
            || path == "/v1/realtime/translations")
}

fn realtime_management_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/realtime/calls", "/v1/realtime/calls/")
}

fn vector_store_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/vector_stores", "/v1/vector_stores/")
}

fn assistants_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/assistants", "/v1/assistants/")
}

fn threads_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/threads", "/v1/threads/")
}

fn batches_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/batches", "/v1/batches/")
}

fn fine_tuning_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/fine_tuning", "/v1/fine_tuning/")
}

fn conversations_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/conversations", "/v1/conversations/")
}

fn containers_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/containers", "/v1/containers/")
}

fn evals_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/evals", "/v1/evals/")
}

fn skills_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/skills", "/v1/skills/")
}

fn organization_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/organization", "/v1/organization/")
}

fn projects_path(path: &str) -> bool {
    exact_or_prefix(path, "/v1/projects", "/v1/projects/")
}

fn assistants_required_model_action_path(method: &Method, path: &str) -> bool {
    method == Method::POST && path == "/v1/assistants"
}

fn fine_tuning_required_model_action_path(method: &Method, path: &str) -> bool {
    method == Method::POST && path == "/v1/fine_tuning/jobs"
}

fn optional_chat_model_path(method: &Method, path: &str) -> bool {
    method_writes_resource(method)
        && (path == "/v1/threads/runs"
            || path.starts_with("/v1/threads/") && path.ends_with("/runs"))
}

fn optional_assistant_model_path(method: &Method, path: &str) -> bool {
    method_writes_resource(method)
        && path.starts_with("/v1/assistants/")
        && path.matches('/').count() == 3
}

fn optional_fine_tuning_model_path(method: &Method, path: &str) -> bool {
    method == Method::POST
        && (path == "/v1/fine_tuning/alpha/graders/run"
            || path == "/v1/fine_tuning/alpha/graders/validate")
}

fn optional_eval_model_path(method: &Method, path: &str) -> bool {
    method_writes_resource(method) && (path == "/v1/evals" || path.starts_with("/v1/evals/"))
}

fn optional_video_model_path(method: &Method, path: &str) -> bool {
    method == Method::POST
        && (path == "/v1/videos/edits"
            || path == "/v1/videos/extensions"
            || path.ends_with("/remix"))
}

#[cfg(test)]
mod tests {
    use super::classify_openai_route;
    use axum::http::Method;
    use sdkwork_claw_product::domain::{BillingMeter, RoutingCapability};

    #[test]
    fn classifies_model_action_routes_as_requiring_model() {
        for (method, path, route_key, capability, billing_meter) in [
            (
                Method::POST,
                "/v1/chat/completions",
                "openai/model/chat_completions",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/images/generations",
                "openai/model/images",
                RoutingCapability::Image,
                BillingMeter::ImageResult,
            ),
            (
                Method::POST,
                "/v1/audio/transcriptions",
                "openai/model/audio",
                RoutingCapability::Audio,
                BillingMeter::AudioInputSecond,
            ),
            (
                Method::POST,
                "/v1/videos",
                "openai/model/videos",
                RoutingCapability::Video,
                BillingMeter::VideoResult,
            ),
            (
                Method::POST,
                "/v1/realtime/sessions",
                "openai/model/realtime",
                RoutingCapability::Audio,
                BillingMeter::AudioInputSecond,
            ),
            (
                Method::DELETE,
                "/v1/models/gpt-4o-mini",
                "openai/model/models",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/responses",
                "openai/model/responses",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/responses/input_tokens",
                "openai/model/responses",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/fine_tuning/jobs",
                "openai/model/fine_tuning",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/assistants",
                "openai/model/assistants",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
        ] {
            let classification = classify_openai_route(&method, path);
            assert_eq!(route_key, classification.route_key, "{path}");
            assert_eq!(capability, classification.capability, "{path}");
            assert_eq!(billing_meter, classification.billing_meter, "{path}");
            assert!(!classification.permits_missing_model(), "{path}");
            assert!(classification.routes_model_when_present(), "{path}");
        }
    }

    #[test]
    fn classifies_optional_model_routes_as_channel_routes_when_model_is_absent() {
        for (method, path, route_key, capability, billing_meter) in [
            (
                Method::POST,
                "/v1/threads/thread_123/runs",
                "openai/management/threads",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/threads/runs",
                "openai/management/threads",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/assistants/asst_123",
                "openai/management/assistants",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/fine_tuning/alpha/graders/run",
                "openai/management/fine_tuning",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/evals",
                "openai/management/evals",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/evals/eval_123",
                "openai/management/evals",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/evals/eval_123/runs",
                "openai/management/evals",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/videos/extensions",
                "openai/management/videos",
                RoutingCapability::Video,
                BillingMeter::VideoResult,
            ),
            (
                Method::POST,
                "/v1/videos/vid_123/remix",
                "openai/management/videos",
                RoutingCapability::Video,
                BillingMeter::VideoResult,
            ),
        ] {
            let classification = classify_openai_route(&method, path);
            assert_eq!(route_key, classification.route_key, "{path}");
            assert_eq!(capability, classification.capability, "{path}");
            assert_eq!(billing_meter, classification.billing_meter, "{path}");
            assert!(
                classification.permits_missing_model(),
                "{path} should route by channel route when the request omits a model"
            );
            assert!(
                classification.routes_model_when_present(),
                "{path} should route by model when the request supplies a model"
            );
        }
    }

    #[test]
    fn classifies_management_routes_as_channel_routes() {
        for (method, path, route_key, capability) in [
            (
                Method::GET,
                "/v1/files/file_123/content",
                "openai/management/files",
                RoutingCapability::Network,
            ),
            (
                Method::GET,
                "/v1/audio/voices",
                "openai/management/audio_voices",
                RoutingCapability::Audio,
            ),
            (
                Method::GET,
                "/v1/vector_stores/vs_123/files",
                "openai/management/vector_stores",
                RoutingCapability::Network,
            ),
            (
                Method::GET,
                "/v1/assistants/asst_123",
                "openai/management/assistants",
                RoutingCapability::Chat,
            ),
            (
                Method::GET,
                "/v1/organization/projects/proj_123/api_keys",
                "openai/management/organization",
                RoutingCapability::Network,
            ),
            (
                Method::GET,
                "/v1/models",
                "openai/management/models",
                RoutingCapability::Chat,
            ),
            (
                Method::GET,
                "/v1/responses/resp_123/input_items",
                "openai/management/responses",
                RoutingCapability::Chat,
            ),
            (
                Method::GET,
                "/v1/videos/vid_123/content",
                "openai/management/videos",
                RoutingCapability::Video,
            ),
            (
                Method::GET,
                "/v1/videos",
                "openai/management/videos",
                RoutingCapability::Video,
            ),
            (
                Method::POST,
                "/v1/videos/characters",
                "openai/management/videos",
                RoutingCapability::Video,
            ),
            (
                Method::GET,
                "/v1/chat/completions",
                "openai/management/chat_completions",
                RoutingCapability::Chat,
            ),
            (
                Method::GET,
                "/v1/evals/eval_123/runs",
                "openai/management/evals",
                RoutingCapability::Network,
            ),
            (
                Method::GET,
                "/v1/fine_tuning/jobs",
                "openai/management/fine_tuning",
                RoutingCapability::Network,
            ),
        ] {
            let classification = classify_openai_route(&method, path);
            assert_eq!(route_key, classification.route_key, "{path}");
            assert_eq!(capability, classification.capability, "{path}");
            assert_eq!(
                BillingMeter::ApiRequest,
                classification.billing_meter,
                "{path}"
            );
            assert!(classification.permits_missing_model(), "{path}");
            assert!(!classification.routes_model_when_present(), "{path}");
        }
    }
}
