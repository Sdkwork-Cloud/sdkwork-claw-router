#![allow(dead_code)]

use axum::http::Method;
use sdkwork_claw_product::domain::{
    AiRouteFailureStrategy, AiRouteModelRequirement, AiRouteStrategy, BillingMeter,
    RoutingCapability,
};

const API_OPENAI_AUDIO: &str = "openai.audio";
const API_OPENAI_AUDIO_SPEECH: &str = "openai.audio.speech";
const API_OPENAI_AUDIO_TRANSCRIPTIONS: &str = "openai.audio.transcriptions";
const API_OPENAI_AUDIO_TRANSLATIONS: &str = "openai.audio.translations";
const API_OPENAI_ADMINISTRATION: &str = "openai.administration";
const API_OPENAI_ASSISTANTS: &str = "openai.assistants";
const API_OPENAI_BATCHES: &str = "openai.batches";
const API_OPENAI_CHAT_COMPLETIONS: &str = "openai.chat_completions";
const API_OPENAI_COMPLETIONS: &str = "openai.completions";
const API_OPENAI_CONTAINERS: &str = "openai.containers";
const API_OPENAI_CONVERSATIONS: &str = "openai.conversations";
const API_OPENAI_EVALS: &str = "openai.evals";
const API_OPENAI_FILES: &str = "openai.files";
const API_OPENAI_FINE_TUNING: &str = "openai.fine_tuning";
const API_OPENAI_IMAGES: &str = "openai.images";
const API_OPENAI_IMAGES_EDITS: &str = "openai.images.edits";
const API_OPENAI_IMAGES_GENERATIONS: &str = "openai.images.generations";
const API_OPENAI_IMAGES_VARIATIONS: &str = "openai.images.variations";
const API_OPENAI_MODELS: &str = "openai.models";
const API_OPENAI_MODERATIONS: &str = "openai.moderations";
const API_OPENAI_REALTIME: &str = "openai.realtime";
const API_OPENAI_RESPONSES: &str = "openai.responses";
const API_OPENAI_SKILLS: &str = "openai.skills";
const API_OPENAI_THREADS: &str = "openai.threads";
const API_OPENAI_UPLOADS: &str = "openai.uploads";
const API_OPENAI_VECTOR_STORES: &str = "openai.vector_stores";
const API_OPENAI_VIDEOS: &str = "openai.videos";

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct OpenAiRouteClassification {
    pub(crate) route_key: &'static str,
    pub(crate) api_code: &'static str,
    pub(crate) capability: RoutingCapability,
    pub(crate) billing_meter: BillingMeter,
    pub(crate) route_strategy: AiRouteStrategy,
    pub(crate) failure_strategy: AiRouteFailureStrategy,
    pub(crate) model_requirement: AiRouteModelRequirement,
    pub(crate) sticky_object_type: Option<&'static str>,
    pub(crate) sticky_scope: Option<&'static str>,
}

impl OpenAiRouteClassification {
    pub(crate) fn routes_model_when_present(&self) -> bool {
        self.model_requirement.routes_model_when_present()
    }

    pub(crate) fn permits_missing_model(&self) -> bool {
        self.model_requirement.permits_missing_model()
    }
}

pub(crate) fn classify_openai_route(method: &Method, path: &str) -> OpenAiRouteClassification {
    if method_is_read(method) && path == "/v1/models" {
        return primary_channel_management(
            "openai/management/models",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if model_path(path) {
        return if method == Method::DELETE {
            stateless_model_action_with_profile(
                "openai/model/models",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                AiRouteStrategy::StatelessFailClosed,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Required,
                None,
                None,
            )
        } else {
            model_action(
                "openai/model/models",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
            )
        };
    }
    if chat_completion_model_action_path(method, path) {
        return model_action(
            "openai/model/chat_completions",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if chat_completion_path(path) {
        return primary_channel_management(
            "openai/management/chat_completions",
            RoutingCapability::Chat,
            BillingMeter::ApiRequest,
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
        if path == "/v1/responses" {
            return create_then_sticky_model_action(
                "openai/model/responses",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
                "response",
                AiRouteModelRequirement::Required,
            );
        }
        return model_action(
            "openai/model/responses",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
        );
    }
    if image_model_action_path(method, path) {
        let route_key = match path {
            "/v1/images/generations" => "openai/model/images/generations",
            "/v1/images/edits" => "openai/model/images/edits",
            "/v1/images/variations" => "openai/model/images/variations",
            _ => "openai/model/images",
        };
        return model_action(
            route_key,
            RoutingCapability::Image,
            BillingMeter::ImageResult,
        );
    }
    if audio_model_action_path(method, path) {
        let route_key = match path {
            "/v1/audio/transcriptions" => "openai/model/audio/transcriptions",
            "/v1/audio/translations" => "openai/model/audio/translations",
            "/v1/audio/speech" => "openai/model/audio/speech",
            _ => "openai/model/audio",
        };
        return model_action(
            route_key,
            RoutingCapability::Audio,
            BillingMeter::AudioInputSecond,
        );
    }
    if video_model_action_path(method, path) {
        return create_then_sticky_model_action(
            "openai/model/videos",
            RoutingCapability::Video,
            BillingMeter::VideoResult,
            "video",
            AiRouteModelRequirement::Required,
        );
    }
    if realtime_model_action_path(method, path) {
        return create_then_sticky_model_action(
            "openai/model/realtime",
            RoutingCapability::Audio,
            BillingMeter::AudioInputSecond,
            "realtime_session",
            AiRouteModelRequirement::Required,
        );
    }
    if assistants_required_model_action_path(method, path) {
        return create_then_sticky_model_action(
            "openai/model/assistants",
            RoutingCapability::Chat,
            BillingMeter::ApiRequest,
            "assistant",
            AiRouteModelRequirement::Required,
        );
    }
    if fine_tuning_required_model_action_path(method, path) {
        return create_then_sticky_model_action(
            "openai/model/fine_tuning",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
            "fine_tuning_job",
            AiRouteModelRequirement::Required,
        );
    }
    if threads_path(path) {
        if method == Method::POST && path == "/v1/threads/runs" {
            return create_then_sticky_optional_model_management(
                "openai/management/threads",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
                "thread",
            );
        }
        if method_writes_resource(method)
            && path.starts_with("/v1/threads/")
            && path.ends_with("/runs")
        {
            return parent_sticky_optional_model_management(
                "openai/management/threads",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
                "thread",
            );
        }
        if path.starts_with("/v1/threads/") {
            return lookup_sticky_management(
                "openai/management/threads",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
                "thread",
            );
        }
        if method == Method::POST && path == "/v1/threads" {
            return create_then_sticky_management(
                "openai/management/threads",
                RoutingCapability::Chat,
                BillingMeter::ApiRequest,
                "thread",
                AiRouteModelRequirement::Ignored,
            );
        }
        return primary_channel_management(
            "openai/management/threads",
            RoutingCapability::Chat,
            BillingMeter::ApiRequest,
        );
    }
    if optional_assistant_model_path(method, path) {
        return lookup_sticky_optional_model_management(
            "openai/management/assistants",
            RoutingCapability::Chat,
            BillingMeter::LlmInputToken,
            "assistant",
        );
    }
    if optional_fine_tuning_model_path(method, path) {
        return optional_model_management_with_profile(
            "openai/management/fine_tuning",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
            AiRouteStrategy::StatelessFailover,
            AiRouteFailureStrategy::Failover,
            AiRouteModelRequirement::Optional,
            None,
            None,
        );
    }
    if optional_eval_model_path(method, path) {
        if path == "/v1/evals" {
            return create_then_sticky_optional_model_management(
                "openai/management/evals",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "eval",
            );
        }
        if path.starts_with("/v1/evals/") && path.ends_with("/runs") {
            return parent_sticky_optional_model_management(
                "openai/management/evals",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "eval",
            );
        }
        if path.starts_with("/v1/evals/") {
            return lookup_sticky_optional_model_management(
                "openai/management/evals",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "eval",
            );
        }
        return optional_model_management_with_profile(
            "openai/management/evals",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
            AiRouteStrategy::StatelessFailover,
            AiRouteFailureStrategy::Failover,
            AiRouteModelRequirement::Optional,
            None,
            None,
        );
    }
    if optional_video_model_path(method, path) {
        if path.ends_with("/remix") {
            return parent_sticky_optional_model_management(
                "openai/management/videos",
                RoutingCapability::Video,
                BillingMeter::VideoResult,
                "video",
            );
        }
        return create_then_sticky_optional_model_management(
            "openai/management/videos",
            RoutingCapability::Video,
            BillingMeter::VideoResult,
            "video",
        );
    }
    if video_management_path(path) {
        if method == Method::GET && path == "/v1/videos" {
            return primary_channel_management(
                "openai/management/videos",
                RoutingCapability::Video,
                BillingMeter::ApiRequest,
            );
        }
        if path == "/v1/videos/characters" && method == Method::POST {
            return create_then_sticky_management(
                "openai/management/videos",
                RoutingCapability::Video,
                BillingMeter::ApiRequest,
                "video_character",
                AiRouteModelRequirement::Ignored,
            );
        }
        if path.starts_with("/v1/videos/") {
            return lookup_sticky_management(
                "openai/management/videos",
                RoutingCapability::Video,
                BillingMeter::ApiRequest,
                "video",
            );
        }
        return primary_channel_management(
            "openai/management/videos",
            RoutingCapability::Video,
            BillingMeter::ApiRequest,
        );
    }
    if files_path(path) {
        if method == Method::POST && path == "/v1/files" {
            return create_then_sticky_management(
                "openai/management/files",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "file",
                AiRouteModelRequirement::Ignored,
            );
        }
        if path.starts_with("/v1/files/") {
            return lookup_sticky_management(
                "openai/management/files",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "file",
            );
        }
        return primary_channel_management(
            "openai/management/files",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if uploads_path(path) {
        if method == Method::POST && path == "/v1/uploads" {
            return create_then_sticky_management(
                "openai/management/uploads",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "upload",
                AiRouteModelRequirement::Ignored,
            );
        }
        if path.starts_with("/v1/uploads/") {
            return parent_sticky_management(
                "openai/management/uploads",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "upload",
            );
        }
        return primary_channel_management(
            "openai/management/uploads",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if audio_voice_management_path(path) {
        return primary_channel_management(
            "openai/management/audio_voices",
            RoutingCapability::Audio,
            BillingMeter::ApiRequest,
        );
    }
    if response_management_path(path) {
        if path.starts_with("/v1/responses/") {
            return lookup_sticky_management(
                "openai/management/responses",
                RoutingCapability::Chat,
                BillingMeter::ApiRequest,
                "response",
            );
        }
        return primary_channel_management(
            "openai/management/responses",
            RoutingCapability::Chat,
            BillingMeter::ApiRequest,
        );
    }
    if vector_store_path(path) {
        if method == Method::POST && path == "/v1/vector_stores" {
            return create_then_sticky_management(
                "openai/management/vector_stores",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "vector_store",
                AiRouteModelRequirement::Ignored,
            );
        }
        if method_writes_resource(method)
            && path.starts_with("/v1/vector_stores/")
            && (path.contains("/files") || path.contains("/file_batches"))
        {
            return parent_sticky_management(
                "openai/management/vector_stores",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "vector_store",
            );
        }
        if path.starts_with("/v1/vector_stores/") {
            return lookup_sticky_management(
                "openai/management/vector_stores",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "vector_store",
            );
        }
        return primary_channel_management(
            "openai/management/vector_stores",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if assistants_path(path) {
        if method == Method::POST && path == "/v1/assistants" {
            return create_then_sticky_management(
                "openai/management/assistants",
                RoutingCapability::Chat,
                BillingMeter::ApiRequest,
                "assistant",
                AiRouteModelRequirement::Required,
            );
        }
        if path.starts_with("/v1/assistants/") {
            return lookup_sticky_management(
                "openai/management/assistants",
                RoutingCapability::Chat,
                BillingMeter::ApiRequest,
                "assistant",
            );
        }
        return primary_channel_management(
            "openai/management/assistants",
            RoutingCapability::Chat,
            BillingMeter::ApiRequest,
        );
    }
    if batches_path(path) {
        if method == Method::POST && path == "/v1/batches" {
            return create_then_sticky_management(
                "openai/management/batches",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "batch",
                AiRouteModelRequirement::Ignored,
            );
        }
        if path.starts_with("/v1/batches/") {
            return lookup_sticky_management(
                "openai/management/batches",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "batch",
            );
        }
        return primary_channel_management(
            "openai/management/batches",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if fine_tuning_path(path) {
        if method == Method::POST && path == "/v1/fine_tuning/jobs" {
            return create_then_sticky_management(
                "openai/management/fine_tuning",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "fine_tuning_job",
                AiRouteModelRequirement::Required,
            );
        }
        if path.starts_with("/v1/fine_tuning/jobs/") {
            return lookup_sticky_management(
                "openai/management/fine_tuning",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "fine_tuning_job",
            );
        }
        return primary_channel_management(
            "openai/management/fine_tuning",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if conversations_path(path) {
        if method == Method::POST && path == "/v1/conversations" {
            return create_then_sticky_management(
                "openai/management/conversations",
                RoutingCapability::Chat,
                BillingMeter::ApiRequest,
                "conversation",
                AiRouteModelRequirement::Ignored,
            );
        }
        if path.starts_with("/v1/conversations/") {
            return lookup_sticky_management(
                "openai/management/conversations",
                RoutingCapability::Chat,
                BillingMeter::ApiRequest,
                "conversation",
            );
        }
        return primary_channel_management(
            "openai/management/conversations",
            RoutingCapability::Chat,
            BillingMeter::ApiRequest,
        );
    }
    if containers_path(path) {
        if method == Method::POST && path == "/v1/containers" {
            return create_then_sticky_management(
                "openai/management/containers",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "container",
                AiRouteModelRequirement::Ignored,
            );
        }
        if path.starts_with("/v1/containers/") {
            return lookup_sticky_management(
                "openai/management/containers",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "container",
            );
        }
        return primary_channel_management(
            "openai/management/containers",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if evals_path(path) {
        if method == Method::POST && path == "/v1/evals" {
            return create_then_sticky_management(
                "openai/management/evals",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "eval",
                AiRouteModelRequirement::Optional,
            );
        }
        if path.starts_with("/v1/evals/") && path.ends_with("/runs") {
            return parent_sticky_management(
                "openai/management/evals",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "eval",
            );
        }
        if path.starts_with("/v1/evals/") {
            return lookup_sticky_management(
                "openai/management/evals",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "eval",
            );
        }
        return primary_channel_management(
            "openai/management/evals",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if skills_path(path) {
        if method == Method::POST && path == "/v1/skills" {
            return create_then_sticky_management(
                "openai/management/skills",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "skill",
                AiRouteModelRequirement::Ignored,
            );
        }
        if path.starts_with("/v1/skills/") {
            return lookup_sticky_management(
                "openai/management/skills",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "skill",
            );
        }
        return primary_channel_management(
            "openai/management/skills",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if organization_path(path) {
        return primary_channel_management(
            "openai/management/organization",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if projects_path(path) {
        if method == Method::POST && path == "/v1/projects" {
            return create_then_sticky_management(
                "openai/management/projects",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "project",
                AiRouteModelRequirement::Ignored,
            );
        }
        if path.starts_with("/v1/projects/") {
            return lookup_sticky_management(
                "openai/management/projects",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
                "project",
            );
        }
        return primary_channel_management(
            "openai/management/projects",
            RoutingCapability::Network,
            BillingMeter::ApiRequest,
        );
    }
    if realtime_management_path(path) {
        if path.starts_with("/v1/realtime/calls/") {
            return parent_sticky_management(
                "openai/management/realtime_calls",
                RoutingCapability::Audio,
                BillingMeter::ApiRequest,
                "realtime_call",
            );
        }
        return create_then_sticky_management(
            "openai/management/realtime_calls",
            RoutingCapability::Audio,
            BillingMeter::ApiRequest,
            "realtime_call",
            AiRouteModelRequirement::Ignored,
        );
    }
    if threads_path(path) {
        return primary_channel_management(
            "openai/management/threads",
            RoutingCapability::Chat,
            BillingMeter::ApiRequest,
        );
    }
    primary_channel_management(
        "openai/management/default",
        RoutingCapability::Network,
        BillingMeter::ApiRequest,
    )
}

fn model_action(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
) -> OpenAiRouteClassification {
    stateless_model_action(route_key, capability, billing_meter)
}

fn stateless_model_action(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
) -> OpenAiRouteClassification {
    stateless_model_action_with_profile(
        route_key,
        capability,
        billing_meter,
        AiRouteStrategy::StatelessFailover,
        AiRouteFailureStrategy::Failover,
        AiRouteModelRequirement::Required,
        None,
        None,
    )
}

fn model_action_with_profile(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    route_strategy: AiRouteStrategy,
    failure_strategy: AiRouteFailureStrategy,
    model_requirement: AiRouteModelRequirement,
    sticky_object_type: Option<&'static str>,
    sticky_scope: Option<&'static str>,
) -> OpenAiRouteClassification {
    OpenAiRouteClassification {
        route_key,
        api_code: model_route_api_code(route_key),
        capability,
        billing_meter,
        route_strategy,
        failure_strategy,
        model_requirement,
        sticky_object_type,
        sticky_scope,
    }
}

fn create_then_sticky_model_action(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    sticky_object_type: &'static str,
    model_requirement: AiRouteModelRequirement,
) -> OpenAiRouteClassification {
    model_action_with_profile(
        route_key,
        capability,
        billing_meter,
        AiRouteStrategy::CreateThenSticky,
        AiRouteFailureStrategy::FailClosed,
        model_requirement,
        Some(sticky_object_type),
        Some("object"),
    )
}

fn stateless_model_action_with_profile(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    route_strategy: AiRouteStrategy,
    failure_strategy: AiRouteFailureStrategy,
    model_requirement: AiRouteModelRequirement,
    sticky_object_type: Option<&'static str>,
    sticky_scope: Option<&'static str>,
) -> OpenAiRouteClassification {
    OpenAiRouteClassification {
        route_key,
        api_code: model_route_api_code(route_key),
        capability,
        billing_meter,
        route_strategy,
        failure_strategy,
        model_requirement,
        sticky_object_type,
        sticky_scope,
    }
}

fn primary_channel_management(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
) -> OpenAiRouteClassification {
    management_with_profile(
        route_key,
        capability,
        billing_meter,
        AiRouteStrategy::PrimaryChannel,
        AiRouteFailureStrategy::FailClosed,
        AiRouteModelRequirement::Ignored,
        None,
        None,
    )
}

fn management_with_profile(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    route_strategy: AiRouteStrategy,
    failure_strategy: AiRouteFailureStrategy,
    model_requirement: AiRouteModelRequirement,
    sticky_object_type: Option<&'static str>,
    sticky_scope: Option<&'static str>,
) -> OpenAiRouteClassification {
    OpenAiRouteClassification {
        route_key,
        api_code: management_route_api_code(route_key),
        capability,
        billing_meter,
        route_strategy,
        failure_strategy,
        model_requirement,
        sticky_object_type,
        sticky_scope,
    }
}

fn lookup_sticky_management(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    sticky_object_type: &'static str,
) -> OpenAiRouteClassification {
    management_with_profile(
        route_key,
        capability,
        billing_meter,
        AiRouteStrategy::LookupSticky,
        AiRouteFailureStrategy::FailClosed,
        AiRouteModelRequirement::Ignored,
        Some(sticky_object_type),
        Some("object"),
    )
}

fn parent_sticky_management(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    sticky_object_type: &'static str,
) -> OpenAiRouteClassification {
    management_with_profile(
        route_key,
        capability,
        billing_meter,
        AiRouteStrategy::ParentSticky,
        AiRouteFailureStrategy::FailClosed,
        AiRouteModelRequirement::Ignored,
        Some(sticky_object_type),
        Some("parent"),
    )
}

fn create_then_sticky_management(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    sticky_object_type: &'static str,
    model_requirement: AiRouteModelRequirement,
) -> OpenAiRouteClassification {
    management_with_profile(
        route_key,
        capability,
        billing_meter,
        AiRouteStrategy::CreateThenSticky,
        AiRouteFailureStrategy::FailClosed,
        model_requirement,
        Some(sticky_object_type),
        Some("object"),
    )
}

fn optional_model_management_with_profile(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    route_strategy: AiRouteStrategy,
    failure_strategy: AiRouteFailureStrategy,
    model_requirement: AiRouteModelRequirement,
    sticky_object_type: Option<&'static str>,
    sticky_scope: Option<&'static str>,
) -> OpenAiRouteClassification {
    OpenAiRouteClassification {
        route_key,
        api_code: optional_model_route_api_code(route_key),
        capability,
        billing_meter,
        route_strategy,
        failure_strategy,
        model_requirement,
        sticky_object_type,
        sticky_scope,
    }
}

fn create_then_sticky_optional_model_management(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    sticky_object_type: &'static str,
) -> OpenAiRouteClassification {
    optional_model_management_with_profile(
        route_key,
        capability,
        billing_meter,
        AiRouteStrategy::CreateThenSticky,
        AiRouteFailureStrategy::FailClosed,
        AiRouteModelRequirement::Optional,
        Some(sticky_object_type),
        Some("object"),
    )
}

fn parent_sticky_optional_model_management(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    sticky_object_type: &'static str,
) -> OpenAiRouteClassification {
    optional_model_management_with_profile(
        route_key,
        capability,
        billing_meter,
        AiRouteStrategy::ParentSticky,
        AiRouteFailureStrategy::FailClosed,
        AiRouteModelRequirement::Optional,
        Some(sticky_object_type),
        Some("parent"),
    )
}

fn lookup_sticky_optional_model_management(
    route_key: &'static str,
    capability: RoutingCapability,
    billing_meter: BillingMeter,
    sticky_object_type: &'static str,
) -> OpenAiRouteClassification {
    optional_model_management_with_profile(
        route_key,
        capability,
        billing_meter,
        AiRouteStrategy::LookupSticky,
        AiRouteFailureStrategy::FailClosed,
        AiRouteModelRequirement::Optional,
        Some(sticky_object_type),
        Some("object"),
    )
}

fn model_route_api_code(route_key: &'static str) -> &'static str {
    match route_key {
        "openai/model/audio" => API_OPENAI_AUDIO,
        "openai/model/audio/speech" => API_OPENAI_AUDIO_SPEECH,
        "openai/model/audio/transcriptions" => API_OPENAI_AUDIO_TRANSCRIPTIONS,
        "openai/model/audio/translations" => API_OPENAI_AUDIO_TRANSLATIONS,
        "openai/model/images" => API_OPENAI_IMAGES,
        "openai/model/images/edits" => API_OPENAI_IMAGES_EDITS,
        "openai/model/images/generations" => API_OPENAI_IMAGES_GENERATIONS,
        "openai/model/images/variations" => API_OPENAI_IMAGES_VARIATIONS,
        "openai/model/responses" => API_OPENAI_RESPONSES,
        "openai/model/videos" => API_OPENAI_VIDEOS,
        "openai/model/realtime" => API_OPENAI_REALTIME,
        "openai/model/models" => API_OPENAI_MODELS,
        "openai/model/completions" => API_OPENAI_COMPLETIONS,
        "openai/model/moderations" => API_OPENAI_MODERATIONS,
        "openai/model/assistants" => API_OPENAI_ASSISTANTS,
        "openai/model/fine_tuning" => API_OPENAI_FINE_TUNING,
        _ => API_OPENAI_CHAT_COMPLETIONS,
    }
}

fn optional_model_route_api_code(route_key: &'static str) -> &'static str {
    match route_key {
        "openai/management/videos" => API_OPENAI_VIDEOS,
        "openai/management/threads" => API_OPENAI_THREADS,
        "openai/management/assistants" => API_OPENAI_ASSISTANTS,
        "openai/management/fine_tuning" => API_OPENAI_FINE_TUNING,
        "openai/management/evals" => API_OPENAI_EVALS,
        _ => management_route_api_code(route_key),
    }
}

fn management_route_api_code(route_key: &'static str) -> &'static str {
    match route_key {
        "openai/management/audio_voices" => API_OPENAI_AUDIO,
        "openai/management/realtime_calls" => API_OPENAI_REALTIME,
        "openai/management/chat_completions" => API_OPENAI_CHAT_COMPLETIONS,
        "openai/management/models" => API_OPENAI_MODELS,
        "openai/management/files" => API_OPENAI_FILES,
        "openai/management/responses" => API_OPENAI_RESPONSES,
        "openai/management/uploads" => API_OPENAI_UPLOADS,
        "openai/management/videos" => API_OPENAI_VIDEOS,
        "openai/management/batches" => API_OPENAI_BATCHES,
        "openai/management/fine_tuning" => API_OPENAI_FINE_TUNING,
        "openai/management/vector_stores" => API_OPENAI_VECTOR_STORES,
        "openai/management/assistants" => API_OPENAI_ASSISTANTS,
        "openai/management/threads" => API_OPENAI_THREADS,
        "openai/management/evals" => API_OPENAI_EVALS,
        "openai/management/conversations" => API_OPENAI_CONVERSATIONS,
        "openai/management/containers" => API_OPENAI_CONTAINERS,
        "openai/management/skills" => API_OPENAI_SKILLS,
        "openai/management/organization" | "openai/management/projects" => {
            API_OPENAI_ADMINISTRATION
        }
        _ => API_OPENAI_ADMINISTRATION,
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
    use sdkwork_claw_product::domain::{
        AiRouteFailureStrategy, AiRouteModelRequirement, AiRouteStrategy, BillingMeter,
        RoutingCapability,
    };

    #[test]
    fn classifies_model_action_routes_as_requiring_model() {
        for (method, path, route_key, api_code, capability, billing_meter) in [
            (
                Method::POST,
                "/v1/chat/completions",
                "openai/model/chat_completions",
                "openai.chat_completions",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/images/generations",
                "openai/model/images/generations",
                "openai.images.generations",
                RoutingCapability::Image,
                BillingMeter::ImageResult,
            ),
            (
                Method::POST,
                "/v1/audio/transcriptions",
                "openai/model/audio/transcriptions",
                "openai.audio.transcriptions",
                RoutingCapability::Audio,
                BillingMeter::AudioInputSecond,
            ),
            (
                Method::POST,
                "/v1/videos",
                "openai/model/videos",
                "openai.videos",
                RoutingCapability::Video,
                BillingMeter::VideoResult,
            ),
            (
                Method::POST,
                "/v1/realtime/sessions",
                "openai/model/realtime",
                "openai.realtime",
                RoutingCapability::Audio,
                BillingMeter::AudioInputSecond,
            ),
            (
                Method::DELETE,
                "/v1/models/gpt-4o-mini",
                "openai/model/models",
                "openai.models",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
            ),
            (
                Method::POST,
                "/v1/responses",
                "openai/model/responses",
                "openai.responses",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/responses/input_tokens",
                "openai/model/responses",
                "openai.responses",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/fine_tuning/jobs",
                "openai/model/fine_tuning",
                "openai.fine_tuning",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
            ),
            (
                Method::POST,
                "/v1/assistants",
                "openai/model/assistants",
                "openai.assistants",
                RoutingCapability::Chat,
                BillingMeter::ApiRequest,
            ),
        ] {
            let classification = classify_openai_route(&method, path);
            assert_eq!(route_key, classification.route_key, "{path}");
            assert_eq!(api_code, classification.api_code, "{path}");
            assert_eq!(capability, classification.capability, "{path}");
            assert_eq!(billing_meter, classification.billing_meter, "{path}");
            assert!(!classification.permits_missing_model(), "{path}");
            assert!(classification.routes_model_when_present(), "{path}");
        }
    }

    #[test]
    fn classifies_optional_model_routes_as_channel_routes_when_model_is_absent() {
        for (method, path, route_key, api_code, capability, billing_meter) in [
            (
                Method::POST,
                "/v1/threads/thread_123/runs",
                "openai/management/threads",
                "openai.threads",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/threads/runs",
                "openai/management/threads",
                "openai.threads",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/assistants/asst_123",
                "openai/management/assistants",
                "openai.assistants",
                RoutingCapability::Chat,
                BillingMeter::LlmInputToken,
            ),
            (
                Method::POST,
                "/v1/fine_tuning/alpha/graders/run",
                "openai/management/fine_tuning",
                "openai.fine_tuning",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
            ),
            (
                Method::POST,
                "/v1/evals",
                "openai/management/evals",
                "openai.evals",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
            ),
            (
                Method::POST,
                "/v1/evals/eval_123",
                "openai/management/evals",
                "openai.evals",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
            ),
            (
                Method::POST,
                "/v1/evals/eval_123/runs",
                "openai/management/evals",
                "openai.evals",
                RoutingCapability::Network,
                BillingMeter::ApiRequest,
            ),
            (
                Method::POST,
                "/v1/videos/extensions",
                "openai/management/videos",
                "openai.videos",
                RoutingCapability::Video,
                BillingMeter::VideoResult,
            ),
            (
                Method::POST,
                "/v1/videos/vid_123/remix",
                "openai/management/videos",
                "openai.videos",
                RoutingCapability::Video,
                BillingMeter::VideoResult,
            ),
        ] {
            let classification = classify_openai_route(&method, path);
            assert_eq!(route_key, classification.route_key, "{path}");
            assert_eq!(api_code, classification.api_code, "{path}");
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
        for (method, path, route_key, api_code, capability) in [
            (
                Method::GET,
                "/v1/files/file_123/content",
                "openai/management/files",
                "openai.files",
                RoutingCapability::Network,
            ),
            (
                Method::GET,
                "/v1/audio/voices",
                "openai/management/audio_voices",
                "openai.audio",
                RoutingCapability::Audio,
            ),
            (
                Method::GET,
                "/v1/vector_stores/vs_123/files",
                "openai/management/vector_stores",
                "openai.vector_stores",
                RoutingCapability::Network,
            ),
            (
                Method::GET,
                "/v1/assistants/asst_123",
                "openai/management/assistants",
                "openai.assistants",
                RoutingCapability::Chat,
            ),
            (
                Method::GET,
                "/v1/organization/projects/proj_123/api_keys",
                "openai/management/organization",
                "openai.administration",
                RoutingCapability::Network,
            ),
            (
                Method::GET,
                "/v1/models",
                "openai/management/models",
                "openai.models",
                RoutingCapability::Network,
            ),
            (
                Method::GET,
                "/v1/responses/resp_123/input_items",
                "openai/management/responses",
                "openai.responses",
                RoutingCapability::Chat,
            ),
            (
                Method::GET,
                "/v1/videos/vid_123/content",
                "openai/management/videos",
                "openai.videos",
                RoutingCapability::Video,
            ),
            (
                Method::GET,
                "/v1/videos",
                "openai/management/videos",
                "openai.videos",
                RoutingCapability::Video,
            ),
            (
                Method::POST,
                "/v1/videos/characters",
                "openai/management/videos",
                "openai.videos",
                RoutingCapability::Video,
            ),
            (
                Method::GET,
                "/v1/chat/completions",
                "openai/management/chat_completions",
                "openai.chat_completions",
                RoutingCapability::Chat,
            ),
            (
                Method::GET,
                "/v1/evals/eval_123/runs",
                "openai/management/evals",
                "openai.evals",
                RoutingCapability::Network,
            ),
            (
                Method::GET,
                "/v1/fine_tuning/jobs",
                "openai/management/fine_tuning",
                "openai.fine_tuning",
                RoutingCapability::Network,
            ),
            (
                Method::POST,
                "/v1/conversations",
                "openai/management/conversations",
                "openai.conversations",
                RoutingCapability::Chat,
            ),
            (
                Method::POST,
                "/v1/containers",
                "openai/management/containers",
                "openai.containers",
                RoutingCapability::Network,
            ),
            (
                Method::POST,
                "/v1/skills",
                "openai/management/skills",
                "openai.skills",
                RoutingCapability::Network,
            ),
        ] {
            let classification = classify_openai_route(&method, path);
            assert_eq!(route_key, classification.route_key, "{path}");
            assert_eq!(api_code, classification.api_code, "{path}");
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

    #[test]
    fn classifies_route_strategy_failure_mode_and_sticky_profile() {
        for (
            method,
            path,
            expected_strategy,
            expected_failure,
            expected_model_requirement,
            expected_sticky_object_type,
            expected_sticky_scope,
        ) in [
            (
                Method::POST,
                "/v1/chat/completions",
                AiRouteStrategy::StatelessFailover,
                AiRouteFailureStrategy::Failover,
                AiRouteModelRequirement::Required,
                None,
                None,
            ),
            (
                Method::POST,
                "/v1/responses",
                AiRouteStrategy::CreateThenSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Required,
                Some("response"),
                Some("object"),
            ),
            (
                Method::POST,
                "/v1/responses/input_tokens",
                AiRouteStrategy::StatelessFailover,
                AiRouteFailureStrategy::Failover,
                AiRouteModelRequirement::Required,
                None,
                None,
            ),
            (
                Method::GET,
                "/v1/responses/resp_123/input_items",
                AiRouteStrategy::LookupSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Ignored,
                Some("response"),
                Some("object"),
            ),
            (
                Method::POST,
                "/v1/files",
                AiRouteStrategy::CreateThenSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Ignored,
                Some("file"),
                Some("object"),
            ),
            (
                Method::GET,
                "/v1/files/file_123/content",
                AiRouteStrategy::LookupSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Ignored,
                Some("file"),
                Some("object"),
            ),
            (
                Method::POST,
                "/v1/uploads",
                AiRouteStrategy::CreateThenSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Ignored,
                Some("upload"),
                Some("object"),
            ),
            (
                Method::POST,
                "/v1/uploads/upload_123/parts",
                AiRouteStrategy::ParentSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Ignored,
                Some("upload"),
                Some("parent"),
            ),
            (
                Method::POST,
                "/v1/assistants",
                AiRouteStrategy::CreateThenSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Required,
                Some("assistant"),
                Some("object"),
            ),
            (
                Method::POST,
                "/v1/threads/thread_123/runs",
                AiRouteStrategy::ParentSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Optional,
                Some("thread"),
                Some("parent"),
            ),
            (
                Method::GET,
                "/v1/threads/thread_123/messages",
                AiRouteStrategy::LookupSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Ignored,
                Some("thread"),
                Some("object"),
            ),
            (
                Method::POST,
                "/v1/vector_stores/vs_123/files",
                AiRouteStrategy::ParentSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Ignored,
                Some("vector_store"),
                Some("parent"),
            ),
            (
                Method::POST,
                "/v1/fine_tuning/jobs",
                AiRouteStrategy::CreateThenSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Required,
                Some("fine_tuning_job"),
                Some("object"),
            ),
            (
                Method::POST,
                "/v1/videos",
                AiRouteStrategy::CreateThenSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Required,
                Some("video"),
                Some("object"),
            ),
            (
                Method::GET,
                "/v1/videos/vid_123/content",
                AiRouteStrategy::LookupSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Ignored,
                Some("video"),
                Some("object"),
            ),
            (
                Method::GET,
                "/v1/models",
                AiRouteStrategy::PrimaryChannel,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Ignored,
                None,
                None,
            ),
            (
                Method::DELETE,
                "/v1/models/gpt-4o-mini",
                AiRouteStrategy::StatelessFailClosed,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Required,
                None,
                None,
            ),
            (
                Method::GET,
                "/v1/videos",
                AiRouteStrategy::PrimaryChannel,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Ignored,
                None,
                None,
            ),
            (
                Method::POST,
                "/v1/realtime/sessions",
                AiRouteStrategy::CreateThenSticky,
                AiRouteFailureStrategy::FailClosed,
                AiRouteModelRequirement::Required,
                Some("realtime_session"),
                Some("object"),
            ),
        ] {
            let classification = classify_openai_route(&method, path);
            assert_eq!(
                expected_strategy, classification.route_strategy,
                "{path} strategy"
            );
            assert_eq!(
                expected_failure, classification.failure_strategy,
                "{path} failure strategy"
            );
            assert_eq!(
                expected_model_requirement, classification.model_requirement,
                "{path} model requirement"
            );
            assert_eq!(
                expected_sticky_object_type, classification.sticky_object_type,
                "{path} sticky object type"
            );
            assert_eq!(
                expected_sticky_scope, classification.sticky_scope,
                "{path} sticky scope"
            );
        }
    }
}
