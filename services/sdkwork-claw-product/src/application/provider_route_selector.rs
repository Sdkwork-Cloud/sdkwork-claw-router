use crate::application::{AuthenticatedApiKeyContext, PricingResolver, ResolveModelPriceQuery};
use std::cmp::Reverse;
use std::collections::BTreeMap;
use std::fmt::{Display, Formatter};

use crate::domain::{
    provider_native_model_id, BillingMeter, DomainError, DomainResult, ModelProviderRoute,
    ProviderChannelGroupBinding, ProviderChannelRoute, RouteCandidate, RoutingCapability,
    RoutingPolicy, RoutingPolicyScope, RoutingRule,
};
use crate::ports::PricingCatalog;

#[derive(Debug, Clone, Default)]
struct ChannelGroupBindings {
    has_any_group_binding: bool,
    by_channel: BTreeMap<i64, Vec<ProviderChannelGroupBinding>>,
}

impl ChannelGroupBindings {
    fn unrestricted(&self) -> bool {
        !self.has_any_group_binding
    }

    fn contains_channel(&self, channel_id: i64) -> bool {
        self.by_channel.contains_key(&channel_id)
    }

    fn get(&self, channel_id: i64) -> Option<&[ProviderChannelGroupBinding]> {
        self.by_channel.get(&channel_id).map(Vec::as_slice)
    }

    fn matched_channel_count(&self) -> usize {
        self.by_channel.len()
    }
}

pub struct ProviderRouteSelector<'a, C: PricingCatalog> {
    catalog: &'a C,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SelectProviderRouteQuery {
    pub context: AuthenticatedApiKeyContext,
    pub catalog_key: String,
    pub requested_model: String,
    pub api_code: String,
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
pub struct SelectedProviderRoutePlan {
    pub routes: Vec<SelectedProviderRoute>,
    pub policy_id: Option<i64>,
    pub rule_id: Option<i64>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SelectProviderChannelRouteQuery {
    pub context: AuthenticatedApiKeyContext,
    pub route_key: String,
    pub api_code: String,
    pub capability: RoutingCapability,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SelectedProviderChannelRoute {
    pub route: ProviderChannelRoute,
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
    Planned(SelectedProviderRoutePlan),
    SoftUnavailable(ProviderRouteSelectionError),
    HardError(ProviderRouteSelectionError),
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum PolicyScopeChannelRouteSelection {
    Selected(SelectedProviderChannelRoute),
    SoftUnavailable(ProviderRouteSelectionError),
    HardError(ProviderRouteSelectionError),
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum CandidateRouteEvaluation {
    Planned(Vec<ModelProviderRoute>),
    PricingUnavailable(DomainError),
    NoCallableCandidate,
}

#[derive(Debug, Clone, PartialEq, Eq)]
enum CandidateChannelRouteEvaluation {
    Selected(ProviderChannelRoute),
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
        Ok(self.select_plan(query)?.first_route())
    }

    pub fn select_plan(
        &self,
        query: SelectProviderRouteQuery,
    ) -> Result<SelectedProviderRoutePlan, ProviderRouteSelectionError> {
        let channel_routes = self.catalog.list_provider_channel_routes();
        let channel_routes_loaded = channel_routes.len();
        let model_scope_keys = [query.catalog_key.as_str(), query.requested_model.as_str()];
        let api_scope_keys = [query.api_code.as_str()];
        let group_bindings = channel_group_bindings(
            &channel_routes,
            query.context.group_id,
            &model_scope_keys,
            &api_scope_keys,
            query.capability,
        );
        let model_routes = self.catalog.list_provider_routes(&query.catalog_key);
        let model_routes_loaded = model_routes.len();
        let routes = self.group_scoped_model_routes(model_routes, &channel_routes, &group_bindings);
        let channel_routes = self.group_scoped_channel_routes(channel_routes, &group_bindings);
        if routes.is_empty() && channel_routes.is_empty() {
            log_unavailable_model_route_diagnostics(
                &query,
                model_routes_loaded,
                channel_routes_loaded,
                &group_bindings,
                routes.len(),
                channel_routes.len(),
            );
            return Err(ProviderRouteSelectionError::provider_route_unavailable(
                unavailable_model_route_message(&query, model_routes_loaded, channel_routes_loaded),
            ));
        }

        let policy_scopes = self.select_policy_scopes(&query.context);
        let mut last_unavailable = None;
        for policy_scope in policy_scopes {
            match self.select_plan_from_policy_scope(
                &query,
                &routes,
                &channel_routes,
                policy_scope,
                &group_bindings,
            ) {
                PolicyScopeRouteSelection::Planned(selection) => return Ok(selection),
                PolicyScopeRouteSelection::SoftUnavailable(error) => {
                    last_unavailable = Some(error);
                }
                PolicyScopeRouteSelection::HardError(error) => return Err(error),
            }
        }
        if let Some(selection) = self.select_group_bound_channel_route_plan(
            &query,
            &routes,
            &channel_routes,
            &group_bindings,
        )? {
            return Ok(selection);
        }
        if let Some(error) = last_unavailable {
            return Err(error);
        }

        Err(ProviderRouteSelectionError::provider_route_unavailable(
            format!(
                "provider route is not available for configured channel route: routing policy scope is required for model {}",
                query.catalog_key
            ),
        ))
    }

    pub fn select_channel_route(
        &self,
        query: SelectProviderChannelRouteQuery,
    ) -> Result<SelectedProviderChannelRoute, ProviderRouteSelectionError> {
        let channel_routes = self.catalog.list_provider_channel_routes();
        let api_scope_keys = [query.api_code.as_str()];
        let group_bindings = channel_group_bindings(
            &channel_routes,
            query.context.group_id,
            &[],
            &api_scope_keys,
            query.capability,
        );
        let routes = self.group_scoped_channel_routes(channel_routes, &group_bindings);
        if routes.is_empty() {
            return Err(ProviderRouteSelectionError::provider_route_unavailable(
                "provider route is not available for configured channel route: no channel routes are configured",
            ));
        }

        let policy_scopes = self.select_policy_scopes(&query.context);
        let mut last_unavailable = None;
        for policy_scope in policy_scopes {
            match self.select_channel_route_from_policy_scope(
                &query,
                &routes,
                policy_scope,
                &group_bindings,
            ) {
                PolicyScopeChannelRouteSelection::Selected(selection) => return Ok(selection),
                PolicyScopeChannelRouteSelection::SoftUnavailable(error) => {
                    last_unavailable = Some(error);
                }
                PolicyScopeChannelRouteSelection::HardError(error) => return Err(error),
            }
        }
        if let Some(selection) = self.select_group_bound_channel_route(&routes, &group_bindings) {
            return Ok(selection);
        }
        if let Some(error) = last_unavailable {
            return Err(error);
        }

        Err(ProviderRouteSelectionError::provider_route_unavailable(
            format!(
                "provider route is not available for configured channel route: routing policy scope is required for route {}",
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

    fn select_plan_from_policy_scope(
        &self,
        query: &SelectProviderRouteQuery,
        routes: &[ModelProviderRoute],
        channel_routes: &[ProviderChannelRoute],
        policy_scope: SelectedPolicyScope,
        group_bindings: &ChannelGroupBindings,
    ) -> PolicyScopeRouteSelection {
        let policy = match self
            .select_policy_for_capability(&policy_scope.policies, query.capability)
        {
            Some(policy) => policy,
            None => {
                let error = ProviderRouteSelectionError::provider_route_unavailable(format!(
                        "provider route is not available for configured channel route: {} policy scope has no routing policy for capability {:?}",
                        scope_label(policy_scope.scope),
                        query.capability
                    ));
                if group_bindings.unrestricted() {
                    return PolicyScopeRouteSelection::HardError(error);
                }
                return PolicyScopeRouteSelection::SoftUnavailable(error);
            }
        };
        let Some(profile_id) = policy.default_profile_id else {
            return PolicyScopeRouteSelection::SoftUnavailable(
                ProviderRouteSelectionError::provider_route_unavailable(format!(
                    "provider route is not available for configured channel route: routing policy {} has no default profile",
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
            let candidate_chain = scoped_candidate_chain(&rule, &policy, group_bindings);
            let used_rule_fallback_chain =
                candidate_chain_uses_rule_fallback(&rule, &candidate_chain);
            match self.evaluate_candidate_route_plan(query, routes, channel_routes, candidate_chain)
            {
                CandidateRouteEvaluation::Planned(routes) => {
                    return PolicyScopeRouteSelection::Planned(SelectedProviderRoutePlan {
                        routes: routes
                            .into_iter()
                            .map(|route| SelectedProviderRoute {
                                route,
                                policy_id: Some(policy.id),
                                rule_id: Some(rule.id),
                            })
                            .collect(),
                        policy_id: Some(policy.id),
                        rule_id: Some(rule.id),
                    });
                }
                CandidateRouteEvaluation::PricingUnavailable(error) => {
                    return PolicyScopeRouteSelection::HardError(
                        ProviderRouteSelectionError::pricing_unavailable(format!(
                            "pricing is not available for configured channel route: policy {} rule {} candidate price is unavailable for model {}: {}",
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
                        "provider route is not available for configured channel route: policy {} fallback mode none disables rule {} fallback chain for model {}",
                        policy.policy_code, rule.rule_code, query.catalog_key
                    )),
                );
            }
            return PolicyScopeRouteSelection::SoftUnavailable(
                ProviderRouteSelectionError::provider_route_unavailable(format!(
                    "provider route is not available for configured channel route: policy {} rule {} has no callable priced candidate channel{} for model {}",
                    policy.policy_code,
                    rule.rule_code,
                    if used_rule_fallback_chain { " or fallback channel" } else { "" },
                    query.catalog_key
                )),
            );
        }
        PolicyScopeRouteSelection::SoftUnavailable(
            ProviderRouteSelectionError::provider_route_unavailable(format!(
                "provider route is not available for configured channel route: policy {} has no routing rule for model {}",
                policy.policy_code, query.catalog_key
            )),
        )
    }

    fn select_channel_route_from_policy_scope(
        &self,
        query: &SelectProviderChannelRouteQuery,
        routes: &[ProviderChannelRoute],
        policy_scope: SelectedPolicyScope,
        group_bindings: &ChannelGroupBindings,
    ) -> PolicyScopeChannelRouteSelection {
        let policy = match self
            .select_policy_for_capability(&policy_scope.policies, query.capability)
        {
            Some(policy) => policy,
            None => {
                let error = ProviderRouteSelectionError::provider_route_unavailable(format!(
                        "provider route is not available for configured channel route: {} policy scope has no routing policy for capability {:?}",
                        scope_label(policy_scope.scope),
                        query.capability
                    ));
                if group_bindings.unrestricted() {
                    return PolicyScopeChannelRouteSelection::HardError(error);
                }
                return PolicyScopeChannelRouteSelection::SoftUnavailable(error);
            }
        };
        let Some(profile_id) = policy.default_profile_id else {
            return PolicyScopeChannelRouteSelection::SoftUnavailable(
                ProviderRouteSelectionError::provider_route_unavailable(format!(
                    "provider route is not available for configured channel route: routing policy {} has no default profile",
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
            let candidate_chain = scoped_candidate_chain(&rule, &policy, group_bindings);
            let used_rule_fallback_chain =
                candidate_chain_uses_rule_fallback(&rule, &candidate_chain);
            match self.evaluate_candidate_channel_routes(routes, candidate_chain) {
                CandidateChannelRouteEvaluation::Selected(route) => {
                    return PolicyScopeChannelRouteSelection::Selected(
                        SelectedProviderChannelRoute {
                            route,
                            policy_id: Some(policy.id),
                            rule_id: Some(rule.id),
                        },
                    );
                }
                CandidateChannelRouteEvaluation::NoCallableCandidate => {}
            }
            if !policy
                .fallback_mode_or_default()
                .allows_rule_fallback_chain()
                && !rule.fallback_chain.is_empty()
            {
                return PolicyScopeChannelRouteSelection::SoftUnavailable(
                    ProviderRouteSelectionError::provider_route_unavailable(format!(
                        "provider route is not available for configured channel route: policy {} fallback mode none disables rule {} fallback chain for route {}",
                        policy.policy_code, rule.rule_code, query.route_key
                    )),
                );
            }
            return PolicyScopeChannelRouteSelection::SoftUnavailable(
                ProviderRouteSelectionError::provider_route_unavailable(format!(
                    "provider route is not available for configured channel route: policy {} rule {} has no callable channel route candidate{} for route {}",
                    policy.policy_code,
                    rule.rule_code,
                    if used_rule_fallback_chain { " or fallback channel" } else { "" },
                    query.route_key
                )),
            );
        }
        PolicyScopeChannelRouteSelection::SoftUnavailable(
            ProviderRouteSelectionError::provider_route_unavailable(format!(
                "provider route is not available for configured channel route: policy {} has no routing rule for route {}",
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
            RoutingPolicyScope::ChannelGroup => {
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

    fn evaluate_candidate_route_plan(
        &self,
        query: &SelectProviderRouteQuery,
        routes: &[ModelProviderRoute],
        channel_routes: &[ProviderChannelRoute],
        candidates: Vec<RouteCandidate>,
    ) -> CandidateRouteEvaluation {
        let mut pricing_error = None;
        let mut selected_routes = Vec::new();
        for candidate in candidates {
            let Some(route) = self.resolve_candidate_model_route(
                query,
                routes,
                channel_routes,
                candidate.channel_id,
            ) else {
                continue;
            };
            if !self.route_is_callable(&route) {
                continue;
            }
            match self.ensure_route_is_priced(query, &route) {
                Ok(()) => selected_routes.push(route),
                Err(error) => {
                    pricing_error.get_or_insert(error);
                }
            }
        }
        if selected_routes.is_empty() {
            pricing_error
                .map(CandidateRouteEvaluation::PricingUnavailable)
                .unwrap_or(CandidateRouteEvaluation::NoCallableCandidate)
        } else {
            CandidateRouteEvaluation::Planned(selected_routes)
        }
    }

    fn select_group_bound_channel_route_plan(
        &self,
        query: &SelectProviderRouteQuery,
        routes: &[ModelProviderRoute],
        channel_routes: &[ProviderChannelRoute],
        group_bindings: &ChannelGroupBindings,
    ) -> Result<Option<SelectedProviderRoutePlan>, ProviderRouteSelectionError> {
        if group_bindings.unrestricted() {
            return Ok(None);
        }

        let candidates = group_bound_channel_route_candidates(channel_routes, group_bindings);
        if candidates.is_empty() {
            return Ok(None);
        }

        match self.evaluate_candidate_route_plan(query, routes, channel_routes, candidates) {
            CandidateRouteEvaluation::Planned(routes) => Ok(Some(SelectedProviderRoutePlan {
                routes: routes
                    .into_iter()
                    .map(|route| SelectedProviderRoute {
                        route,
                        policy_id: None,
                        rule_id: None,
                    })
                    .collect(),
                policy_id: None,
                rule_id: None,
            })),
            CandidateRouteEvaluation::PricingUnavailable(error) => {
                Err(ProviderRouteSelectionError::pricing_unavailable(format!(
                    "pricing is not available for group-bound channel route for model {}: {}",
                    query.catalog_key, error
                )))
            }
            CandidateRouteEvaluation::NoCallableCandidate => Ok(None),
        }
    }

    fn resolve_candidate_model_route(
        &self,
        query: &SelectProviderRouteQuery,
        routes: &[ModelProviderRoute],
        channel_routes: &[ProviderChannelRoute],
        channel_id: i64,
    ) -> Option<ModelProviderRoute> {
        if let Some(route) = routes
            .iter()
            .find(|route| {
                route.channel_id == channel_id
                    && model_route_matches_request_api(route, &query.api_code)
            })
            .cloned()
        {
            return Some(route);
        }

        channel_routes
            .iter()
            .find(|route| route.channel_id == channel_id)
            .filter(|route| self.channel_route_is_callable(route))
            .map(|route| synthetic_model_route_from_channel_route(query, route))
    }

    fn route_is_callable(&self, route: &ModelProviderRoute) -> bool {
        has_text(route.base_url.as_deref()) && has_text(route.secret_ref.as_deref())
    }

    fn evaluate_candidate_channel_routes(
        &self,
        routes: &[ProviderChannelRoute],
        candidates: Vec<RouteCandidate>,
    ) -> CandidateChannelRouteEvaluation {
        for candidate in candidates {
            let Some(route) = routes
                .iter()
                .find(|route| route.channel_id == candidate.channel_id)
                .cloned()
            else {
                continue;
            };
            if self.channel_route_is_callable(&route) {
                return CandidateChannelRouteEvaluation::Selected(route);
            }
        }
        CandidateChannelRouteEvaluation::NoCallableCandidate
    }

    fn select_group_bound_channel_route(
        &self,
        routes: &[ProviderChannelRoute],
        group_bindings: &ChannelGroupBindings,
    ) -> Option<SelectedProviderChannelRoute> {
        if group_bindings.unrestricted() {
            return None;
        }

        let candidates = group_bound_channel_route_candidates(routes, group_bindings);
        match self.evaluate_candidate_channel_routes(routes, candidates) {
            CandidateChannelRouteEvaluation::Selected(route) => {
                Some(SelectedProviderChannelRoute {
                    route,
                    policy_id: None,
                    rule_id: None,
                })
            }
            CandidateChannelRouteEvaluation::NoCallableCandidate => None,
        }
    }

    fn group_scoped_channel_routes(
        &self,
        routes: Vec<ProviderChannelRoute>,
        group_bindings: &ChannelGroupBindings,
    ) -> Vec<ProviderChannelRoute> {
        if group_bindings.unrestricted() {
            return routes;
        }

        routes
            .into_iter()
            .filter(|route| group_bindings.contains_channel(route.channel_id))
            .collect()
    }

    fn group_scoped_model_routes(
        &self,
        routes: Vec<ModelProviderRoute>,
        channel_routes: &[ProviderChannelRoute],
        group_bindings: &ChannelGroupBindings,
    ) -> Vec<ModelProviderRoute> {
        if group_bindings.unrestricted() {
            return routes;
        }

        routes
            .into_iter()
            .filter(|route| {
                channel_routes.iter().any(|channel_route| {
                    channel_route.channel_id == route.channel_id
                        && channel_route.provider_code == route.provider_code
                        && group_bindings.contains_channel(channel_route.channel_id)
                        && self.channel_route_is_callable(channel_route)
                })
            })
            .collect()
    }

    fn channel_route_is_callable(&self, route: &ProviderChannelRoute) -> bool {
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
                model: route.catalog_key.clone(),
                billing_meter: query.billing_meter.clone(),
                provider_code: Some(route.provider_code.clone()),
                channel_id: Some(route.channel_id),
            })
            .map(|_| ())
    }
}

impl SelectedProviderRoutePlan {
    pub fn first_route(&self) -> SelectedProviderRoute {
        self.routes
            .first()
            .cloned()
            .expect("selected provider route plan must contain at least one route")
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

fn scoped_candidate_chain(
    rule: &RoutingRule,
    policy: &RoutingPolicy,
    group_bindings: &ChannelGroupBindings,
) -> Vec<RouteCandidate> {
    if group_bindings.unrestricted() {
        return candidate_chain(rule, policy);
    }

    let mut candidates = group_bound_candidates(rule.candidate_channels.clone(), group_bindings);
    if policy
        .fallback_mode_or_default()
        .allows_rule_fallback_chain()
    {
        candidates.extend(group_bound_candidates(
            rule.fallback_chain.clone(),
            group_bindings,
        ));
    }
    candidates
}

fn group_bound_candidates(
    mut candidates: Vec<RouteCandidate>,
    group_bindings: &ChannelGroupBindings,
) -> Vec<RouteCandidate> {
    candidates.retain(|candidate| group_bindings.contains_channel(candidate.channel_id));
    candidates.sort_by_key(|candidate| {
        let binding = group_bindings
            .get(candidate.channel_id)
            .and_then(best_group_binding)
            .expect("group-bound candidate must have a binding");
        (
            binding.priority,
            Reverse(binding.weight),
            Reverse(candidate.weight),
            candidate.channel_id,
        )
    });
    candidates
}

fn group_bound_channel_route_candidates(
    routes: &[ProviderChannelRoute],
    group_bindings: &ChannelGroupBindings,
) -> Vec<RouteCandidate> {
    let mut candidates = routes
        .iter()
        .filter_map(|route| {
            let binding = group_bindings
                .get(route.channel_id)
                .and_then(best_group_binding)?;
            Some((
                binding.priority,
                Reverse(binding.weight),
                route.channel_id,
                RouteCandidate::new(route.channel_id, i64::from(binding.weight)),
            ))
        })
        .collect::<Vec<_>>();
    candidates.sort_by_key(|(priority, weight, channel_id, _candidate)| {
        (*priority, *weight, *channel_id)
    });
    candidates
        .into_iter()
        .map(|(_priority, _weight, _channel_id, candidate)| candidate)
        .collect()
}

fn candidate_chain_uses_rule_fallback(rule: &RoutingRule, candidates: &[RouteCandidate]) -> bool {
    candidates.iter().any(|candidate| {
        !rule
            .candidate_channels
            .iter()
            .any(|primary| primary.channel_id == candidate.channel_id)
    })
}

fn policy_rank(scope: RoutingPolicyScope) -> i32 {
    match scope {
        RoutingPolicyScope::ChannelGroup => 0,
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
        RoutingPolicyScope::ChannelGroup => "channel group",
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

fn unavailable_model_route_message(
    query: &SelectProviderRouteQuery,
    model_routes_loaded: usize,
    channel_routes_loaded: usize,
) -> String {
    if model_routes_loaded == 0 && channel_routes_loaded == 0 {
        return format!(
            "provider route snapshot is empty for model: {}",
            query.catalog_key
        );
    }
    format!(
        "provider route is not available for model: {}",
        query.catalog_key
    )
}

fn log_unavailable_model_route_diagnostics(
    query: &SelectProviderRouteQuery,
    model_routes_loaded: usize,
    channel_routes_loaded: usize,
    group_bindings: &ChannelGroupBindings,
    scoped_model_routes: usize,
    scoped_channel_routes: usize,
) {
    tracing::warn!(
        requested_model = %query.requested_model,
        catalog_key = %query.catalog_key,
        api_key_id = query.context.api_key_id,
        tenant_id = query.context.tenant_id,
        organization_id = query.context.organization_id,
        user_id = query.context.user_id,
        channel_group_id = query.context.group_id,
        channel_group_code = %query.context.group_code,
        capability = ?query.capability,
        model_routes_loaded,
        channel_routes_loaded,
        any_group_bindings = group_bindings.has_any_group_binding,
        matching_group_bound_channels = group_bindings.matched_channel_count(),
        scoped_model_routes,
        scoped_channel_routes,
        "provider route selection found no available model or channel route"
    );
}

fn channel_group_bindings(
    routes: &[ProviderChannelRoute],
    group_id: i64,
    model_scope_keys: &[&str],
    api_scope_keys: &[&str],
    capability: RoutingCapability,
) -> ChannelGroupBindings {
    let mut bindings = ChannelGroupBindings::default();
    for route in routes {
        bindings.has_any_group_binding |= !route.group_bindings.is_empty();
        let route_bindings = route
            .group_bindings
            .iter()
            .filter(|binding| {
                if binding.group_id != group_id {
                    return false;
                }
                binding_matches_request_scope(binding, model_scope_keys, api_scope_keys)
                    && binding_matches_api_scope(binding, api_scope_keys)
                    && binding_matches_capability(binding, capability)
            })
            .cloned()
            .collect::<Vec<_>>();
        if !route_bindings.is_empty() {
            bindings.by_channel.insert(route.channel_id, route_bindings);
        }
    }
    bindings
}

fn binding_matches_request_scope(
    binding: &ProviderChannelGroupBinding,
    model_scope_keys: &[&str],
    api_scope_keys: &[&str],
) -> bool {
    if binding.model_scope.is_empty() {
        return true;
    }
    if !model_scope_keys.is_empty() {
        return binding_matches_model_scope(binding, model_scope_keys);
    }

    if api_scope_keys.is_empty() {
        return false;
    }

    !binding.api_scope.is_empty() && binding_matches_api_scope(binding, api_scope_keys)
}

fn best_group_binding(
    bindings: &[ProviderChannelGroupBinding],
) -> Option<&ProviderChannelGroupBinding> {
    bindings
        .iter()
        .min_by_key(|binding| (binding.priority, Reverse(binding.weight)))
}

fn binding_matches_model_scope(
    binding: &ProviderChannelGroupBinding,
    model_scope_keys: &[&str],
) -> bool {
    if binding.model_scope.is_empty() {
        return true;
    }
    if model_scope_keys.is_empty() {
        return false;
    }
    binding.model_scope.iter().any(|scope| {
        model_scope_keys
            .iter()
            .any(|key| model_scope_value_matches_key(scope, key))
    })
}

fn model_scope_value_matches_key(scope: &str, key: &str) -> bool {
    let scope = normalize_model_scope_value(scope);
    let key = normalize_model_scope_value(key);
    if scope.is_empty() || key.is_empty() {
        return false;
    }
    if scope == "*" || scope == "all" {
        return true;
    }
    if scope == key {
        return true;
    }
    if let Some(prefix) = scope.strip_suffix("/*") {
        return !prefix.is_empty()
            && (key == prefix
                || key
                    .strip_prefix(prefix)
                    .is_some_and(|tail| tail.starts_with('/')));
    }

    let scope_parts = scope
        .split('/')
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>();
    let Some((vendor, native_model_parts)) = model_scope_key_parts(&key) else {
        return false;
    };
    let native_model = native_model_parts.join("/");
    match scope_parts.as_slice() {
        [scope_value] => {
            *scope_value == vendor
                || *scope_value == native_model.as_str()
                || native_model_parts
                    .last()
                    .is_some_and(|model| *scope_value == *model)
        }
        [scope_vendor, scope_model @ ..] => {
            (*scope_vendor == vendor && scope_model == native_model_parts) || scope == native_model
        }
        [] => false,
    }
}

fn model_scope_key_parts(value: &str) -> Option<(&str, Vec<&str>)> {
    let parts = value
        .split('/')
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>();
    match parts.as_slice() {
        [_vendor, region, _model @ ..] if known_region_segment(region) => None,
        [vendor, model @ ..] if !model.is_empty() => Some((*vendor, model.to_vec())),
        _ => None,
    }
}

fn known_region_segment(value: &str) -> bool {
    matches!(
        value.trim().to_ascii_lowercase().as_str(),
        "global"
            | "cn"
            | "us"
            | "eu"
            | "ap"
            | "apac"
            | "jp"
            | "sg"
            | "hk"
            | "aws"
            | "azure"
            | "gcp"
            | "local"
    )
}

fn normalize_model_scope_value(value: &str) -> String {
    value.trim().trim_matches('/').to_ascii_lowercase()
}

fn binding_matches_api_scope(
    binding: &ProviderChannelGroupBinding,
    api_scope_keys: &[&str],
) -> bool {
    if binding.api_scope.is_empty() {
        return true;
    }
    if api_scope_keys.is_empty() {
        return false;
    }
    binding.api_scope.iter().any(|scope| {
        api_scope_keys
            .iter()
            .any(|key| api_scope_value_matches_key(scope, key))
    })
}

fn api_scope_value_matches_key(scope: &str, key: &str) -> bool {
    let scope = normalize_api_scope_value(scope);
    let key = normalize_api_scope_value(key);
    if scope.is_empty() || key.is_empty() {
        return false;
    }
    scope == "*" || scope == "all" || scope == key
}

fn normalize_api_scope_value(value: &str) -> String {
    let normalized = value
        .trim()
        .trim_matches('/')
        .to_ascii_lowercase()
        .replace(['/', ':', '-'], ".");
    normalized
        .strip_prefix("api.")
        .unwrap_or(&normalized)
        .trim_matches('.')
        .to_owned()
}

fn binding_matches_capability(
    binding: &ProviderChannelGroupBinding,
    capability: RoutingCapability,
) -> bool {
    if binding.capabilities.is_empty() {
        return true;
    }
    let expected = capability_binding_codes(capability);
    binding.capabilities.iter().any(|value| {
        expected
            .iter()
            .any(|expected| value.trim().eq_ignore_ascii_case(expected))
    })
}

fn capability_binding_codes(capability: RoutingCapability) -> &'static [&'static str] {
    match capability {
        RoutingCapability::Chat => &["llm", "chat", "text"],
        RoutingCapability::Image => &["image"],
        RoutingCapability::Audio => &["audio", "sfx", "speech"],
        RoutingCapability::Music => &["music"],
        RoutingCapability::Video => &["video"],
        RoutingCapability::Embedding => &["llm", "embedding", "embeddings"],
        RoutingCapability::Rerank => &["llm", "rerank", "ranking"],
        RoutingCapability::Network => &["network", "http"],
    }
}

fn synthetic_model_route_from_channel_route(
    query: &SelectProviderRouteQuery,
    route: &ProviderChannelRoute,
) -> ModelProviderRoute {
    let provider_model = provider_native_model_from_query(query);
    let mut model_route = ModelProviderRoute::new_for_catalog_key(
        &query.catalog_key,
        &query.requested_model,
        &route.provider_code,
        route.channel_id,
        &provider_model,
    )
    .with_region_code(&route.region_code)
    .with_api_code(&query.api_code)
    .with_provider_endpoint(route.base_url.clone(), route.secret_ref.clone())
    .with_auth_profile(route.auth_profile.clone());
    model_route.timeout_ms = route.timeout_ms;
    model_route.retry_policy = route.retry_policy.clone();
    model_route
}

fn model_route_matches_request_api(route: &ModelProviderRoute, requested_api_code: &str) -> bool {
    route
        .api_code
        .as_deref()
        .map(|api_code| api_scope_value_matches_key(api_code, requested_api_code))
        .unwrap_or(true)
}

fn provider_native_model_from_query(query: &SelectProviderRouteQuery) -> String {
    if let Some(native_model) = native_model_from_base_catalog_key(&query.catalog_key) {
        return native_model;
    }
    provider_native_model_id(&query.catalog_key)
}

fn native_model_from_base_catalog_key(value: &str) -> Option<String> {
    let parts = value
        .trim()
        .trim_matches('/')
        .split('/')
        .filter(|part| !part.is_empty())
        .collect::<Vec<_>>();
    match parts.as_slice() {
        [_vendor, region, _model @ ..] if known_region_segment(region) => None,
        [_vendor, model @ ..] if !model.is_empty() => Some(model.join("/")),
        _ => None,
    }
}
