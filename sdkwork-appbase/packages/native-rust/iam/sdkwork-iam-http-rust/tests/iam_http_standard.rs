use sdkwork_iam_http::{
    app_routes, backend_routes, required_dual_token_headers, HttpMethod, IamHttpRoute,
    APP_API_PREFIX, BACKEND_API_PREFIX,
};

#[test]
fn exposes_standard_app_and_backend_prefixes() {
    assert_eq!(APP_API_PREFIX, "/app/v3/api");
    assert_eq!(BACKEND_API_PREFIX, "/backend/v3/api");
}

#[test]
fn app_routes_own_auth_sessions_and_current_user() {
    let routes = app_routes();

    assert!(routes.contains(&IamHttpRoute::new(
        HttpMethod::Post,
        "/app/v3/api/auth/sessions",
        "auth",
        "sessions.create",
    )));
    assert!(routes.contains(&IamHttpRoute::new(
        HttpMethod::Post,
        "/app/v3/api/auth/registrations",
        "auth",
        "registrations.create",
    )));
    assert!(routes.contains(&IamHttpRoute::new(
        HttpMethod::Get,
        "/app/v3/api/auth/sessions/current",
        "auth",
        "sessions.current.retrieve",
    )));
    assert!(routes.contains(&IamHttpRoute::new(
        HttpMethod::Get,
        "/app/v3/api/iam/users/current",
        "iam",
        "users.current.retrieve",
    )));
}

#[test]
fn app_routes_expose_independent_organization_directory_reads() {
    let routes = app_routes();

    for route in [
        IamHttpRoute::new(
            HttpMethod::Get,
            "/app/v3/api/iam/organizations",
            "iam",
            "organizations.list",
        ),
        IamHttpRoute::new(
            HttpMethod::Get,
            "/app/v3/api/iam/organizations/tree",
            "iam",
            "organizations.tree.retrieve",
        ),
        IamHttpRoute::new(
            HttpMethod::Get,
            "/app/v3/api/iam/organization_memberships",
            "iam",
            "organizationMemberships.list",
        ),
        IamHttpRoute::new(
            HttpMethod::Get,
            "/app/v3/api/iam/departments",
            "iam",
            "departments.list",
        ),
        IamHttpRoute::new(
            HttpMethod::Get,
            "/app/v3/api/iam/departments/tree",
            "iam",
            "departments.tree.retrieve",
        ),
        IamHttpRoute::new(
            HttpMethod::Get,
            "/app/v3/api/iam/department_assignments",
            "iam",
            "departmentAssignments.list",
        ),
        IamHttpRoute::new(
            HttpMethod::Get,
            "/app/v3/api/iam/positions",
            "iam",
            "positions.list",
        ),
        IamHttpRoute::new(
            HttpMethod::Get,
            "/app/v3/api/iam/position_assignments",
            "iam",
            "positionAssignments.list",
        ),
        IamHttpRoute::new(
            HttpMethod::Get,
            "/app/v3/api/iam/role_bindings",
            "iam",
            "roleBindings.list",
        ),
    ] {
        assert!(
            routes.contains(&route),
            "missing app IAM directory route: {route:?}"
        );
    }
}

#[test]
fn app_route_manifest_matches_the_standard_operation_surface() {
    let routes = app_routes();
    assert!(
        routes
            .iter()
            .all(|route| !route.path.contains("/auth/qr_login_codes")),
        "retired QR login code routes must not remain in the canonical app IAM manifest",
    );
    assert!(routes.contains(&IamHttpRoute::new(
        HttpMethod::Post,
        "/app/v3/api/open_platform/qr_auth/sessions",
        "open_platform",
        "qrAuth.sessions.create",
    )));
    assert!(routes.contains(&IamHttpRoute::new(
        HttpMethod::Get,
        "/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}",
        "open_platform",
        "qrAuth.sessions.retrieve",
    )));
    assert!(routes.contains(&IamHttpRoute::new(
        HttpMethod::Post,
        "/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}/scans",
        "open_platform",
        "qrAuth.sessions.scans.create",
    )));
    assert!(routes.contains(&IamHttpRoute::new(
        HttpMethod::Post,
        "/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}/passwords",
        "open_platform",
        "qrAuth.sessions.passwords.create",
    )));

    let mut operation_ids: Vec<&str> = routes.iter().map(|route| route.operation_id).collect();
    operation_ids.sort();

    assert_eq!(
        operation_ids,
        vec![
            "departmentAssignments.list",
            "departments.list",
            "departments.tree.retrieve",
            "oauthAuthorizationUrls.retrieve",
            "oauthSessions.create",
            "organizationMemberships.list",
            "organizations.list",
            "organizations.tree.retrieve",
            "passwordResetRequests.create",
            "passwordResets.create",
            "positionAssignments.list",
            "positions.list",
            "qrAuth.sessions.create",
            "qrAuth.sessions.passwords.create",
            "qrAuth.sessions.retrieve",
            "qrAuth.sessions.scans.create",
            "registrations.create",
            "roleBindings.list",
            "sessions.create",
            "sessions.current.delete",
            "sessions.current.retrieve",
            "sessions.current.update",
            "sessions.refresh",
            "users.current.retrieve",
            "verificationCodes.create",
            "verificationCodes.verify",
        ]
    );
}

#[test]
fn backend_routes_do_not_expose_login_or_session_creation() {
    let routes = backend_routes();

    assert!(routes
        .iter()
        .all(|route| !route.path.contains("/auth/sessions")));
    assert!(routes
        .iter()
        .all(|route| !route.path.contains("/auth/login")));
    assert!(routes.contains(&IamHttpRoute::new(
        HttpMethod::Get,
        "/backend/v3/api/iam/users",
        "iam",
        "users.list",
    )));
    assert!(routes.contains(&IamHttpRoute::new(
        HttpMethod::Get,
        "/backend/v3/api/iam/api_keys",
        "iam",
        "apiKeys.list",
    )));
}

#[test]
fn backend_route_manifest_matches_the_standard_management_operation_surface() {
    let mut operation_ids: Vec<&str> = backend_routes()
        .iter()
        .map(|route| route.operation_id)
        .collect();
    operation_ids.sort();

    assert_eq!(
        operation_ids,
        vec![
            "apiKeys.list",
            "apiKeys.revoke",
            "auditEvents.list",
            "departmentAssignments.create",
            "departmentAssignments.update",
            "departments.create",
            "departments.delete",
            "departments.retrieve",
            "departments.update",
            "organizationMemberships.create",
            "organizationMemberships.update",
            "organizations.create",
            "organizations.delete",
            "organizations.retrieve",
            "organizations.update",
            "permissions.create",
            "permissions.delete",
            "permissions.list",
            "permissions.retrieve",
            "permissions.update",
            "policies.create",
            "policies.delete",
            "policies.list",
            "policies.retrieve",
            "policies.update",
            "positionAssignments.create",
            "positionAssignments.update",
            "positions.create",
            "positions.delete",
            "positions.update",
            "roleBindings.create",
            "roleBindings.delete",
            "roles.create",
            "roles.delete",
            "roles.list",
            "roles.permissions.create",
            "roles.permissions.delete",
            "roles.permissions.list",
            "roles.retrieve",
            "roles.update",
            "securityEvents.list",
            "tenants.create",
            "tenants.delete",
            "tenants.list",
            "tenants.members.create",
            "tenants.members.delete",
            "tenants.members.list",
            "tenants.members.update",
            "tenants.retrieve",
            "tenants.update",
            "users.create",
            "users.delete",
            "users.list",
            "users.retrieve",
            "users.update",
        ]
    );
    assert!(!operation_ids.contains(&"users.current.retrieve"));
    assert!(!operation_ids.contains(&"users.roles.create"));
    assert!(!operation_ids.contains(&"users.roles.delete"));
    assert!(!operation_ids.contains(&"users.roles.list"));
    assert!(
        backend_routes()
            .iter()
            .all(|route| !route.path.contains("/users/{userId}/roles")),
        "direct user-role backend routes must be retired; use /iam/role_bindings"
    );
}

#[test]
fn route_paths_use_lower_snake_case_and_operation_ids_use_dotted_lower_camel_case() {
    for route in app_routes().into_iter().chain(backend_routes()) {
        assert!(!route.path.contains("__"));
        assert!(!route.path.contains("userCenter"));
        assert!(!route.path.contains("{organization_id}"));
        assert!(!route.operation_id.contains('_'));
        assert!(!route.operation_id.starts_with("auth."));
        assert!(!route.operation_id.starts_with("iam."));
        assert!(route.operation_id.contains('.'));
    }
}

#[test]
fn dual_token_headers_match_java_saas_security_contract() {
    assert_eq!(
        required_dual_token_headers(),
        ["Authorization", "Access-Token"]
    );
}
