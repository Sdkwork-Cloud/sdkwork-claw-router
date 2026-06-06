use crate::domain::{AiRouteFailureStrategy, AiRouteStrategy};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StickyMode {
    None,
    CreateThenSticky,
    ParentSticky,
    LookupSticky,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StickyScope {
    Object,
    Parent,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StickyRouting {
    pub mode: StickyMode,
    pub object_type: String,
    pub object_id: Option<String>,
    pub parent_object_type: Option<String>,
    pub parent_object_id: Option<String>,
    pub scope: StickyScope,
}

impl StickyRouting {
    pub fn create(object_type: impl Into<String>) -> Self {
        Self {
            mode: StickyMode::CreateThenSticky,
            object_type: object_type.into(),
            object_id: None,
            parent_object_type: None,
            parent_object_id: None,
            scope: StickyScope::Object,
        }
    }

    pub fn lookup(object_type: impl Into<String>, object_id: impl Into<String>) -> Self {
        Self {
            mode: StickyMode::LookupSticky,
            object_type: object_type.into(),
            object_id: Some(object_id.into()),
            parent_object_type: None,
            parent_object_id: None,
            scope: StickyScope::Object,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct InvocationRouting {
    pub strategy: AiRouteStrategy,
    pub failure_strategy: AiRouteFailureStrategy,
    pub sticky: Option<StickyRouting>,
    pub policy_id: Option<i64>,
    pub rule_id: Option<i64>,
}

impl InvocationRouting {
    pub fn new(strategy: AiRouteStrategy, sticky: Option<StickyRouting>) -> Self {
        Self {
            strategy,
            failure_strategy: strategy.failure_strategy(),
            sticky,
            policy_id: None,
            rule_id: None,
        }
    }
}
