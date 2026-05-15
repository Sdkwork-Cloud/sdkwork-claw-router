use crate::application::{AuthenticatedApiKeyContext, PricingResolver, ResolveModelPriceQuery};
use std::fmt::{Display, Formatter};

use crate::domain::{
    BillingMeter, DomainError, DomainResult, ModelProviderRoute, ProviderAccountPoolRoute,
    RouteCandidate, RoutingCapability, RoutingPolicy, RoutingPolicyScope, RoutingRule,
};
use crate::ports::PricingCatalog;

pub struct ProviderRouteSelector<'a, C: PricingCatalog> {
    catalog: &'a C,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SelectProviderRouteQuery {
    pub context: AuthenticatedApiKeyContext,
    pub catalog_key: String,
    pub requested_model: String,
    pub capability: RoutingCapability,
    pub billing_meter: BillingMeter,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SelectedProviderRoute {
    pub route: ModelProviderRoute,
    pub policy_id: Option<i64>,
    pub rule_id: Option<i64>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SelectProviderAccountPoolRouteQuery {
    pub context: AuthenticatedApiKeyContext,
    pub route_key: String,
    pub capability: RoutingCapability,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SelectedProviderAccountPoolRoute {
    pub route: ProviderAccountPoolRoute,
    pub policy_id: Option<i64>,
    pub rule_id: Option<i64>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ProviderRouteSelectionError {
    kind: ProviderRouteSelectionErrorKind,
    message: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProviderRouteSelectionErrorKind {
    ProviderRouteUnavailable,
    PricingUnavailable,
}

impl ProviderRouteSelectionError {
    pub fn provider_route_unavailable(message: impl Into<String>) -> Self {
        Self {
            kind: ProviderRouteSelectionErrorKind::ProviderRouteUnavailable,
            message: message.into(),
        }
    }

    pub fn pricing_unavailable(message: impl Into<String>) -> Self {
        Self {
            kind: ProviderRouteSelectionErrorKind::PricingUnavailable,
            message: message.into(),
        }
    }

    pub fn kind(&self) -> ProviderRouteSelectionErrorKind {
        self.kind
    }
}

impl Display for ProviderRouteSelectionError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.message)
    }
}

impl std::error::Error for ProviderRouteSelectionError {}

#[derive(Debug, Clone, PartialEq, Eq)]
struct SelectedPolicyScope {
    scope: RoutingPolicyScope,
    policies: Vec<RoutingPolicy>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum PolicyScopeRouteSelection {
    Selected(SelectedProviderRoute),
    SoftUnavailable(ProviderRouteSelectionError),
    HardError(ProviderRouteSelectionError),
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum PolicyScopeAccountPoolSelection {
    Selected(SelectedProviderAccountPoolRoute),
    SoftUnavailable(ProviderRouteSelectionError),
    HardError(ProviderRouteSelectionError),
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum CandidateRouteEvaluation {
    Selected(ModelProviderRoute),
    PricingUnavailable(DomainError),
    NoCallableCandidate,
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum CandidateAccountPoolRouteEvaluation {
    Selected(ProviderAccountPoolRoute),
    NoCallableCandidate,
}

impl<'a, C: PricingCatalog> ProviderRouteSelector<'a, C> {
    pub fn new(catalog: &'a C) -> Self {
        Self { catalog }
    }

    pub fn select(
        &self,
        query: SelectProviderRouteQuery,
    ) -> Result<SelectedProviderRoute, ProviderRouteSelectionError> {
        let routes = self.catalog.list_provider_routes(&query.catalog_key);
        if routes.is_empty() {
            return Err(ProviderRouteSelectionError::provider_route_unavailable(
                format!(
                    "provider route is not available for model: {}",
                    query.catalog_key
                ),
            ));
        }

        let policy_scopes = self.select_policy_scopes(&query.context);
        let mut last_unavailable = None;
        for policy_scope in policy_scopes {
            match self.select_from_policy_scope(&query, &routes, policy_scope) {
                PolicyScopeRouteSelection::Selected(selection) => return Ok(selection),
                PolicyScopeRouteSelection::SoftUnavailable(error) => {
                    last_unavailable = Some(error);
                }
                PolicyScopeRouteSelection::HardError(error) => return Err(error),
            }
        }
        if let Some(error) = last_unavailable {
            return Err(error);
        }

        Err(ProviderRouteSelectionError::provider_route_unavailable(
            format!(
                "provider route is not available for configured account pool: routing policy scope is required for model {}",
                query.catalog_key
            ),
        ))
    }

    pub fn select_account_pool(
        &self,
        query: SelectProviderAccountPoolRouteQuery,
    ) -> Result<SelectedProviderAccountPoolRoute, ProviderRouteSelectionError> {
        let routes = self.catalog.list_provider_account_pool_routes();
        if routes.is_empty() {
            return Err(ProviderRouteSelectionError::provider_route_unavailable(
                "provider route is not available for configured account pool: no account pool channels are configured",
            ));
        }

        let policy_scopes = self.select_policy_scopes(&query.context);
        let mut last_unavailable = None;
        for policy_scope in policy_scopes {
            match self.select_account_pool_from_policy_scope(&query, &routes, policy_scope) {
                PolicyScopeAccountPoolSelection::Selected(selection) => return Ok(selection),
                PolicyScopeAccountPoolSelection::SoftUnavailable(error) => {
                    last_unavailable = Some(error);
                }
                PolicyScopeAccountPoolSelection::HardError(error) => return Err(error),
            }
        }
        if let Some(error) = last_unavailable {
            return Err(error);
        }

        Err(ProviderRouteSelectionError::provider_route_unavailable(
            format!(
                "provider route is not available for configured account pool: routing policy scope is required for route {}",
                query.route_key
            ),
        ))
    }

    fn select_policy_scopes(
        &self,
        context: &AuthenticatedApiKeyContext,
    ) -> Vec<SelectedPolicyScope> {
        let mut policies = self
            .catalog
            .list_routing_policies()
            .into_iter()
            .filter(|policy| self.policy_is_in_scope(policy, context))
            .collect::<Vec<_>>();
        policies.sort_by_key(|policy| (policy_rank(policy.policy_scope), policy.id));
        let mut scopes = Vec::new();
        for policy in policies {
            if let Some(existing) = scopes
                .iter_mut()
                .find(|scope: &&mut SelectedPolicyScope| scope.scope == policy.policy_scope)
            {
                existing.policies.push(policy);
            } else {
                scopes.push(SelectedPolicyScope {
                    scope: policy.policy_scope,
                    policies: vec![policy],
                });
            }
        }
        scopes
    }

    fn select_from_policy_scope(
        &self,
        query: &SelectProviderRouteQuery,
        routes: &[ModelProviderRoute],
        policy_scope: SelectedPolicyScope,
    ) -> PolicyScopeRouteSelection {
        let policy = match self
            .select_policy_for_capability(&policy_scope.policies, query.capability)
        {
            Some(policy) => policy,
            None => {
                return PolicyScopeRouteSelection::HardError(
                    ProviderRouteSelectionError::provider_route_unavailable(format!(
                        "provider route is not available for configured account pool: {} policy scope has no routing policy for capability {:?}",
                        scope_label(policy_scope.scope),
                        query.capability
                    )),
                );
            }
        };
        let Some(profile_id) = policy.default_profile_id else {
            return PolicyScopeRouteSelection::SoftUnavailable(
                ProviderRouteSelectionError::provider_route_unavailable(format!(
                    "provider route is not available for configured account pool: routing policy {} has no default profile",
                    policy.policy_code
                )),
            );
        };
        let mut rules = self.catalog.list_routing_rules(profile_id);
        rules.sort_by_key(|rule| (rule.priority, rule.id));
        for rule in rules
            .into_iter()
            .filter(|rule| self.rule_is_in_scope(rule, &query.context))
            .filter(|rule| rule.matches_catalog_key(&query.catalog_key, &query.requested_model))
        {
            let candidate_chain = candidate_chain(&rule, &policy);
            let used_rule_fallback_chain = candidate_chain.len() > rule.candidate_channels.len();
            match self.evaluate_candidate_routes(query, routes, candidate_chain) {
                CandidateRouteEvaluation::Selected(route) => {
                    return PolicyScopeRouteSelection::Selected(SelectedProviderRoute {
                        route,
                        policy_id: Some(policy.id),
                        rule_id: Some(rule.id),
                    });
                }
                CandidateRouteEvaluation::PricingUnavailable(error) => {
                    return PolicyScopeRouteSelection::HardError(
                        ProviderRouteSelectionError::pricing_unavailable(format!(
                            "pricing is not available for configured account pool: policy {} rule {} candidate price is unavailable for model {}: {}",
                            policy.policy_code, rule.rule_code, query.catalog_key, error
                        )),
                    );
                }
                CandidateRouteEvaluation::NoCallableCandidate => {}
            }
            if !policy
                .fallback_mode_or_default()
                .allows_rule_fallback_chain()
                && !rule.fallback_chain.is_empty()
            {
                return PolicyScopeRouteSelection::SoftUnavailable(
                    ProviderRouteSelectionError::provider_route_unavailable(format!(
                        "provider route is not available for configured account pool: policy {} fallback mode none disables rule {} fallback chain for model {}",
                        policy.policy_code, rule.rule_code, query.catalog_key
                    )),
                );
            }
            return PolicyScopeRouteSelection::SoftUnavailable(
                ProviderRouteSelectionError::provider_route_unavailable(format!(
                    "provider route is not available for configured account pool: policy {} rule {} has no callable priced candidate channel{} for model {}",
                    policy.policy_code,
                    rule.rule_code,
                    if used_rule_fallback_chain { " or fallback channel" } else { "" },
                    query.catalog_key
                )),
            );
        }
        PolicyScopeRouteSelection::SoftUnavailable(
            ProviderRouteSelectionError::provider_route_unavailable(format!(
                "provider route is not available for configured account pool: policy {} has no routing rule for model {}",
                policy.policy_code, query.catalog_key
            )),
        )
    }

    fn select_account_pool_from_policy_scope(
        &self,
        query: &SelectProviderAccountPoolRouteQuery,
        routes: &[ProviderAccountPoolRoute],
        policy_scope: SelectedPolicyScope,
    ) -> PolicyScopeAccountPoolSelection {
        let policy = match self
            .select_policy_for_capability(&policy_scope.policies, query.capability)
        {
            Some(policy) => policy,
            None => {
                return PolicyScopeAccountPoolSelection::HardError(
                    ProviderRouteSelectionError::provider_route_unavailable(format!(
                        "provider route is not available for configured account pool: {} policy scope has no routing policy for capability {:?}",
                        scope_label(policy_scope.scope),
                        query.capability
                    )),
                );
            }
        };
        let Some(profile_id) = policy.default_profile_id else {
            return PolicyScopeAccountPoolSelection::SoftUnavailable(
                ProviderRouteSelectionError::provider_route_unavailable(format!(
                    "provider route is not available for configured account pool: routing policy {} has no default profile",
                    policy.policy_code
                )),
            );
        };
        let mut rules = self.catalog.list_routing_rules(profile_id);
        rules.sort_by_key(|rule| (rule.priority, rule.id));
        for rule in rules
            .into_iter()
            .filter(|rule| self.rule_is_in_scope(rule, &query.context))
            .filter(|rule| rule.matches_route_key(&query.route_key))
        {
            let candidate_chain = candidate_chain(&rule, &policy);
            let used_rule_fallback_chain = candidate_chain.len() > rule.candidate_channels.len();
            match self.evaluate_candidate_account_pool_routes(routes, candidate_chain) {
                CandidateAccountPoolRouteEvaluation::Selected(route) => {
                    return PolicyScopeAccountPoolSelection::Selected(
                        SelectedProviderAccountPoolRoute {
                            route,
                            policy_id: Some(policy.id),
                            rule_id: Some(rule.id),
                        },
                    );
                }
                CandidateAccountPoolRouteEvaluation::NoCallableCandidate => {}
            }
            if !policy
                .fallback_mode_or_default()
                .allows_rule_fallback_chain()
                && !rule.fallback_chain.is_empty()
            {
                return PolicyScopeAccountPoolSelection::SoftUnavailable(
                    ProviderRouteSelectionError::provider_route_unavailable(format!(
                        "provider route is not available for configured account pool: policy {} fallback mode none disables rule {} fallback chain for route {}",
                        policy.policy_code, rule.rule_code, query.route_key
                    )),
                );
            }
            return PolicyScopeAccountPoolSelection::SoftUnavailable(
                ProviderRouteSelectionError::provider_route_unavailable(format!(
                    "provider route is not available for configured account pool: policy {} rule {} has no callable account pool candidate channel{} for route {}",
                    policy.policy_code,
                    rule.rule_code,
                    if used_rule_fallback_chain { " or fallback channel" } else { "" },
                    query.route_key
                )),
            );
        }
        PolicyScopeAccountPoolSelection::SoftUnavailable(
            ProviderRouteSelectionError::provider_route_unavailable(format!(
                "provider route is not available for configured account pool: policy {} has no routing rule for route {}",
                policy.policy_code, query.route_key
            )),
        )
    }

    fn select_policy_for_capability(
        &self,
        policies: &[RoutingPolicy],
        capability: RoutingCapability,
    ) -> Option<RoutingPolicy> {
        policies
            .iter()
            .filter(|policy| self.policy_matches_capability(policy, capability))
            .cloned()
            .min_by_key(|policy| (capability_match_rank(policy, capability), policy.id))
    }

    fn policy_matches_capability(
        &self,
        policy: &RoutingPolicy,
        capability: RoutingCapability,
    ) -> bool {
        policy
            .capability
            .map(|policy_capability| policy_capability == capability)
            .unwrap_or(true)
    }

    fn policy_is_in_scope(
        &self,
        policy: &RoutingPolicy,
        context: &AuthenticatedApiKeyContext,
    ) -> bool {
        match policy.policy_scope {
            RoutingPolicyScope::ApiKeyGroup => {
                same_tenant_org(policy, context) && policy.subject_id == Some(context.group_id)
            }
            RoutingPolicyScope::ApiKey => {
                same_tenant_org(policy, context) && policy.subject_id == Some(context.api_key_id)
            }
            RoutingPolicyScope::Organization => {
                same_tenant(policy, context)
                    && policy.organization_id == context.organization_id
                    && policy.subject_id.unwrap_or(context.organization_id)
                        == context.organization_id
            }
            RoutingPolicyScope::Tenant => {
                policy.tenant_id == context.tenant_id
                    && policy.subject_id.unwrap_or(context.tenant_id) == context.tenant_id
            }
            RoutingPolicyScope::Global => true,
        }
    }

    fn rule_is_in_scope(&self, rule: &RoutingRule, context: &AuthenticatedApiKeyContext) -> bool {
        (rule.tenant_id == 0 || rule.tenant_id == context.tenant_id)
            && (rule.organization_id == 0 || rule.organization_id == context.organization_id)
    }

    fn evaluate_candidate_routes(
        &self,
        query: &SelectProviderRouteQuery,
        routes: &[ModelProviderRoute],
        candidates: Vec<RouteCandidate>,
    ) -> CandidateRouteEvaluation {
        let mut pricing_error = None;
        for candidate in candidates {
            let Some(route) = routes
                .iter()
                .find(|route| route.channel_id == candidate.channel_id)
                .cloned()
            else {
                continue;
            };
            if !self.route_is_callable(&route) {
                continue;
            }
            match self.ensure_route_is_priced(query, &route) {
                Ok(()) => return CandidateRouteEvaluation::Selected(route),
                Err(error) => {
                    pricing_error.get_or_insert(error);
                }
            }
        }
        pricing_error
            .map(CandidateRouteEvaluation::PricingUnavailable)
            .unwrap_or(CandidateRouteEvaluation::NoCallableCandidate)
    }

    fn route_is_callable(&self, route: &ModelProviderRoute) -> bool {
        has_text(route.base_url.as_deref()) && has_text(route.secret_ref.as_deref())
    }

    fn evaluate_candidate_account_pool_routes(
        &self,
        routes: &[ProviderAccountPoolRoute],
        candidates: Vec<RouteCandidate>,
    ) -> CandidateAccountPoolRouteEvaluation {
        for candidate in candidates {
            let Some(route) = routes
                .iter()
                .find(|route| route.channel_id == candidate.channel_id)
                .cloned()
            else {
                continue;
            };
            if self.account_pool_route_is_callable(&route) {
                return CandidateAccountPoolRouteEvaluation::Selected(route);
            }
        }
        CandidateAccountPoolRouteEvaluation::NoCallableCandidate
    }

    fn account_pool_route_is_callable(&self, route: &ProviderAccountPoolRoute) -> bool {
        has_text(route.base_url.as_deref()) && has_text(route.secret_ref.as_deref())
    }

    fn ensure_route_is_priced(
        &self,
        query: &SelectProviderRouteQuery,
        route: &ModelProviderRoute,
    ) -> DomainResult<()> {
        PricingResolver::new(self.catalog)
            .resolve(ResolveModelPriceQuery {
                api_key_id: query.context.api_key_id,
                model: query.catalog_key.clone(),
                billing_meter: query.billing_meter.clone(),
                provider_code: Some(route.provider_code.clone()),
                channel_id: Some(route.channel_id),
            })
            .map(|_| ())
    }
}

fn candidate_chain(rule: &RoutingRule, policy: &RoutingPolicy) -> Vec<RouteCandidate> {
    let mut candidates = rule.candidate_channels.clone();
    candidates.sort_by_key(|candidate| (-candidate.weight, candidate.channel_id));
    if policy
        .fallback_mode_or_default()
        .allows_rule_fallback_chain()
    {
        candidates.extend(rule.fallback_chain.clone());
    }
    candidates
}

fn policy_rank(scope: RoutingPolicyScope) -> i32 {
    match scope {
        RoutingPolicyScope::ApiKeyGroup => 0,
        RoutingPolicyScope::ApiKey => 1,
        RoutingPolicyScope::Organization => 2,
        RoutingPolicyScope::Tenant => 3,
        RoutingPolicyScope::Global => 4,
    }
}

fn capability_match_rank(policy: &RoutingPolicy, capability: RoutingCapability) -> i32 {
    match policy.capability {
        Some(policy_capability) if policy_capability == capability => 0,
        None => 1,
        Some(_) => 2,
    }
}

fn scope_label(scope: RoutingPolicyScope) -> &'static str {
    match scope {
        RoutingPolicyScope::ApiKeyGroup => "api key group",
        RoutingPolicyScope::ApiKey => "api key",
        RoutingPolicyScope::Organization => "organization",
        RoutingPolicyScope::Tenant => "tenant",
        RoutingPolicyScope::Global => "global",
    }
}

fn same_tenant_org(policy: &RoutingPolicy, context: &AuthenticatedApiKeyContext) -> bool {
    same_tenant(policy, context) && policy.organization_id == context.organization_id
}

fn same_tenant(policy: &RoutingPolicy, context: &AuthenticatedApiKeyContext) -> bool {
    policy.tenant_id == context.tenant_id
}

fn has_text(value: Option<&str>) -> bool {
    value.map(str::trim).is_some_and(|value| !value.is_empty())
}
