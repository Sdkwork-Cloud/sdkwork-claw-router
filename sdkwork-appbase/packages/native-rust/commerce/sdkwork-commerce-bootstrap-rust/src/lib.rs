use sdkwork_commerce_http::{
    app_route_execution_metadata, app_routes, commerce_http_response_envelope,
    commerce_http_runtime_input_binding, CommerceHttpResponseEnvelope, CommerceHttpRoute,
    CommerceHttpRouteExecutionMetadata, CommerceRuntimeInputBinding,
};
use sdkwork_commerce_runtime::{
    commerce_runtime_capability_manifest, CommerceRuntimeCapabilityManifest,
};
use sdkwork_commerce_storage_sqlx::{
    commerce_migration_runner_execution_plan, commerce_migration_runner_execution_result,
    commerce_migration_runner_failed_execution_result, commerce_migration_runner_failure_recovery,
    commerce_migration_runner_final_state, commerce_migration_runner_lock_cleanup,
    commerce_migration_runner_lock_lifecycle, commerce_migration_runner_preflight,
    commerce_storage_capability_manifest, validate_commerce_migration_plan,
    validate_commerce_migration_runner_execution_plan,
    validate_commerce_migration_runner_failure_recovery,
    validate_commerce_migration_runner_final_state,
    validate_commerce_migration_runner_lock_cleanup,
    validate_commerce_migration_runner_lock_lifecycle,
    validate_commerce_migration_runner_sql_contract, CommerceStorageCapabilityManifest,
};
use sdkwork_commerce_tauri::{
    commerce_tauri_adapter_manifest, CommerceTauriAdapterManifest, CommerceTauriCommandBinding,
};

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceExperienceSeedManifest {
    pub name: &'static str,
    pub seed_version: &'static str,
    pub membership_plan_count: usize,
    pub membership_package_group_count: usize,
    pub membership_package_count: usize,
    pub recharge_package_count: usize,
    pub payment_method_count: usize,
    pub payload_json: String,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceMembershipPlanSeed {
    pub id: &'static str,
    pub plan_no: &'static str,
    pub name: &'static str,
    pub rank: i64,
    pub required_points: i64,
    pub validity_days: i64,
    pub badge: &'static str,
    pub description: &'static str,
    pub benefits: Vec<CommerceMembershipBenefitSeed>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceMembershipBenefitSeed {
    pub id: i64,
    pub benefit_key: &'static str,
    pub name: &'static str,
    pub description: &'static str,
    pub benefit_type: &'static str,
    pub usage_limit: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceMembershipPackageGroupSeed {
    pub id: &'static str,
    pub external_id: i64,
    pub package_group_no: &'static str,
    pub name: &'static str,
    pub description: &'static str,
    pub billing_cycle: &'static str,
    pub duration_days: i64,
    pub sort_weight: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceMembershipPackageSeed {
    pub id: &'static str,
    pub external_id: i64,
    pub package_no: &'static str,
    pub package_group_no: &'static str,
    pub plan_no: &'static str,
    pub sku_id: &'static str,
    pub sku_no: &'static str,
    pub name: &'static str,
    pub title: &'static str,
    pub description: &'static str,
    pub price_amount: &'static str,
    pub original_price_amount: Option<&'static str>,
    pub currency_code: &'static str,
    pub point_amount: i64,
    pub duration_days: i64,
    pub sort_weight: i64,
    pub recommended: bool,
    pub tags: Vec<&'static str>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceRechargePackageSeed {
    pub package_id: &'static str,
    pub sku_id: &'static str,
    pub package_no: &'static str,
    pub sku_no: &'static str,
    pub external_id: i64,
    pub name: &'static str,
    pub price_amount: &'static str,
    pub currency_code: &'static str,
    pub bonus_points: i64,
    pub sort_weight: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommercePaymentMethodSeed {
    pub id: &'static str,
    pub method_key: &'static str,
    pub display_name: &'static str,
    pub provider: &'static str,
    pub sort_weight: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceLocalPrivateBootstrapManifest {
    pub name: &'static str,
    pub bootstrap_version: &'static str,
    pub runtime: CommerceRuntimeCapabilityManifest,
    pub storage: CommerceStorageCapabilityManifest,
    pub http: CommerceBootstrapHttpManifest,
    pub tauri: CommerceTauriAdapterManifest,
    pub operation_input_type: &'static str,
    pub operation_output_type: &'static str,
    pub startup_stages: Vec<CommerceBootstrapStartupStage>,
    pub host_requirements: Vec<CommerceBootstrapHostRequirement>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceBootstrapHttpManifest {
    pub app_routes: Vec<CommerceHttpRoute>,
    pub execution_metadata: Vec<CommerceHttpRouteExecutionMetadata>,
    pub response_envelope: CommerceHttpResponseEnvelope,
    pub runtime_input_binding: CommerceRuntimeInputBinding,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceBootstrapStartupStage {
    pub name: &'static str,
    pub depends_on: Vec<&'static str>,
    pub required_contracts: Vec<&'static str>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceBootstrapHostRequirement {
    pub name: &'static str,
    pub stage: &'static str,
    pub required_contracts: Vec<&'static str>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceBootstrapHostRequirementsByStage {
    pub stage: &'static str,
    pub requirements: Vec<&'static str>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceLocalPrivateBootstrapPreflight {
    pub bootstrap_name: &'static str,
    pub bootstrap_version: &'static str,
    pub runtime_services: usize,
    pub runtime_operations: usize,
    pub storage_tables: usize,
    pub storage_repositories: usize,
    pub storage_migration_lock_table: &'static str,
    pub storage_migration_lock_owner_binding: &'static str,
    pub storage_lock_acquire_status: &'static str,
    pub storage_lock_renewal_status: &'static str,
    pub storage_lock_stolen_status: &'static str,
    pub storage_lock_blocked_status: &'static str,
    pub storage_lock_can_run_when_acquired: bool,
    pub storage_lock_can_run_when_stolen: bool,
    pub storage_lock_can_run_when_blocked: bool,
    pub storage_pending_migrations: usize,
    pub storage_next_migration: Option<&'static str>,
    pub storage_migration_execution_steps: usize,
    pub storage_first_migration_step: Option<&'static str>,
    pub storage_migration_final_applied_count: usize,
    pub storage_migration_final_pending_count: usize,
    pub storage_schema_is_current_after_migrations: bool,
    pub storage_migration_failure_resume_migration: Option<&'static str>,
    pub storage_migration_failure_pending_count: usize,
    pub storage_migration_failure_rollback_required: bool,
    pub storage_migration_failure_lock_release_required: bool,
    pub storage_migration_failure_lock_owner_required: bool,
    pub storage_migration_failure_release_operation: Option<&'static str>,
    pub http_app_routes: usize,
    pub tauri_commands: usize,
    pub operation_input_type: &'static str,
    pub operation_output_type: &'static str,
    pub startup_stages: Vec<CommerceBootstrapStartupStage>,
    pub host_requirements: Vec<CommerceBootstrapHostRequirement>,
    pub host_requirements_by_stage: Vec<CommerceBootstrapHostRequirementsByStage>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommerceBootstrapValidationError {
    pub code: &'static str,
    pub message: String,
}

impl CommerceLocalPrivateBootstrapManifest {
    pub fn preflight(
        &self,
    ) -> Result<CommerceLocalPrivateBootstrapPreflight, CommerceBootstrapValidationError> {
        self.validate()?;
        let migration_preflight =
            commerce_migration_runner_preflight(&self.storage.migration_runner, &[]).map_err(
                |error| {
                    self.error(format!(
                        "Storage migration runner preflight must be valid: {}",
                        error.message
                    ))
                },
            )?;
        let migration_execution_plan =
            commerce_migration_runner_execution_plan(&self.storage.migration_runner, &[]).map_err(
                |error| {
                    self.error(format!(
                        "Storage migration runner execution plan must be valid: {}",
                        error.message
                    ))
                },
            )?;
        validate_commerce_migration_runner_execution_plan(
            &self.storage.migration_runner,
            &[],
            &migration_execution_plan,
        )
        .map_err(|error| {
            self.error(format!(
                "Storage migration runner execution plan must be valid: {}",
                error.message
            ))
        })?;
        let migration_execution_result = commerce_migration_runner_execution_result(
            &migration_execution_plan,
            "bootstrap-preflight",
        );
        let migration_final_state = commerce_migration_runner_final_state(
            &self.storage.migration_runner,
            &[],
            &migration_execution_result,
        )
        .map_err(|error| {
            self.error(format!(
                "Storage migration runner final state must be valid: {}",
                error.message
            ))
        })?;
        validate_commerce_migration_runner_final_state(
            &self.storage.migration_runner,
            &[],
            &migration_execution_result,
            &migration_final_state,
        )
        .map_err(|error| {
            self.error(format!(
                "Storage migration runner final state must be valid: {}",
                error.message
            ))
        })?;
        let migration_failure_result = commerce_migration_runner_failed_execution_result(
            &migration_execution_plan,
            4,
            "bootstrap-preflight",
        )
        .map_err(|error| {
            self.error(format!(
                "Storage migration runner failure recovery must be valid: {}",
                error.message
            ))
        })?;
        let migration_failure_recovery = commerce_migration_runner_failure_recovery(
            &self.storage.migration_runner,
            &[],
            &migration_failure_result,
        )
        .map_err(|error| {
            self.error(format!(
                "Storage migration runner failure recovery must be valid: {}",
                error.message
            ))
        })?;
        validate_commerce_migration_runner_failure_recovery(
            &self.storage.migration_runner,
            &[],
            &migration_failure_result,
            &migration_failure_recovery,
        )
        .map_err(|error| {
            self.error(format!(
                "Storage migration runner failure recovery must be valid: {}",
                error.message
            ))
        })?;
        let migration_lock_lifecycle =
            commerce_migration_runner_lock_lifecycle(&self.storage.migration_runner);
        validate_commerce_migration_runner_lock_lifecycle(
            &self.storage.migration_runner,
            &migration_lock_lifecycle,
        )
        .map_err(|error| {
            self.error(format!(
                "Storage migration runner lock lifecycle must be valid: {}",
                error.message
            ))
        })?;
        let migration_lock_cleanup =
            commerce_migration_runner_lock_cleanup(&self.storage.migration_runner);
        validate_commerce_migration_runner_lock_cleanup(
            &self.storage.migration_runner,
            &migration_lock_cleanup,
        )
        .map_err(|error| {
            self.error(format!(
                "Storage migration runner lock cleanup must be valid: {}",
                error.message
            ))
        })?;

        Ok(CommerceLocalPrivateBootstrapPreflight {
            bootstrap_name: self.name,
            bootstrap_version: self.bootstrap_version,
            runtime_services: self.runtime.service_names.len(),
            runtime_operations: self.runtime.operation_contracts.len(),
            storage_tables: self.storage.tables.len(),
            storage_repositories: self.storage.repository_bindings.len(),
            storage_migration_lock_table: self.storage.migration_runner.lock_table,
            storage_migration_lock_owner_binding: "lock_owner",
            storage_lock_acquire_status: migration_lock_lifecycle.fresh_acquire_status,
            storage_lock_renewal_status: migration_lock_lifecycle.renewal_status,
            storage_lock_stolen_status: migration_lock_lifecycle.stolen_status,
            storage_lock_blocked_status: migration_lock_lifecycle.blocked_status,
            storage_lock_can_run_when_acquired: migration_lock_lifecycle
                .fresh_acquire_can_run_migrations,
            storage_lock_can_run_when_stolen: migration_lock_lifecycle.stolen_can_run_migrations,
            storage_lock_can_run_when_blocked: migration_lock_lifecycle.blocked_can_run_migrations,
            storage_pending_migrations: migration_preflight.pending_count,
            storage_next_migration: migration_preflight
                .next_migration
                .map(|migration| migration.name),
            storage_migration_execution_steps: migration_execution_plan.steps.len(),
            storage_first_migration_step: migration_execution_plan
                .steps
                .first()
                .map(|step| step.kind),
            storage_migration_final_applied_count: migration_final_state.applied_count_after,
            storage_migration_final_pending_count: migration_final_state.pending_count_after,
            storage_schema_is_current_after_migrations: migration_final_state.schema_is_current,
            storage_migration_failure_resume_migration: migration_failure_recovery
                .resume_migration
                .as_ref()
                .map(|migration| migration.name),
            storage_migration_failure_pending_count: migration_failure_recovery.pending_count_after,
            storage_migration_failure_rollback_required: migration_failure_recovery
                .rollback_required,
            storage_migration_failure_lock_release_required: migration_failure_recovery
                .lock_release_required,
            storage_migration_failure_lock_owner_required: migration_failure_recovery
                .lock_owner_required,
            storage_migration_failure_release_operation: migration_failure_recovery
                .release_lock_operation,
            http_app_routes: self.http.app_routes.len(),
            tauri_commands: self.tauri.commands.len(),
            operation_input_type: self.operation_input_type,
            operation_output_type: self.operation_output_type,
            startup_stages: self.startup_stages(),
            host_requirements: self.host_requirements.clone(),
            host_requirements_by_stage: self.host_requirements_by_stage(),
        })
    }

    pub fn startup_stages(&self) -> Vec<CommerceBootstrapStartupStage> {
        self.startup_stages.clone()
    }

    pub fn host_requirements_by_stage(&self) -> Vec<CommerceBootstrapHostRequirementsByStage> {
        self.startup_stages
            .iter()
            .map(|stage| CommerceBootstrapHostRequirementsByStage {
                stage: stage.name,
                requirements: self
                    .host_requirements
                    .iter()
                    .filter(|requirement| requirement.stage == stage.name)
                    .map(|requirement| requirement.name)
                    .collect(),
            })
            .collect()
    }

    pub fn standard_startup_stages() -> Vec<CommerceBootstrapStartupStage> {
        vec![
            CommerceBootstrapStartupStage {
                name: "validate-bootstrap-contracts",
                depends_on: Vec::new(),
                required_contracts: vec![
                    "CommerceLocalPrivateBootstrapManifest",
                    "CommerceRuntimeCapabilityManifest",
                    "CommerceStorageCapabilityManifest",
                    "CommerceBootstrapHttpManifest",
                    "CommerceTauriAdapterManifest",
                ],
            },
            CommerceBootstrapStartupStage {
                name: "initialize-commerce-storage",
                depends_on: vec!["validate-bootstrap-contracts"],
                required_contracts: vec![
                    "CommerceStorageCapabilityManifest",
                    "CommerceIdempotencyRepositorySqlContract",
                    "CommerceTransactionBoundarySqlContract",
                    "CommerceMigrationRunnerExecutionPlan",
                    "CommerceMigrationRunnerExecutionResult",
                    "CommerceMigrationRunnerFinalState",
                    "CommerceMigrationRunnerFailureRecovery",
                    "CommerceMigrationRunnerLockContract",
                    "CommerceMigrationRunnerLockLifecycle",
                    "CommerceMigrationRunnerLockCleanup",
                ],
            },
            CommerceBootstrapStartupStage {
                name: "initialize-commerce-runtime",
                depends_on: vec!["initialize-commerce-storage"],
                required_contracts: vec![
                    "CommerceRuntimeCapabilityManifest",
                    "CommerceRuntimeIdempotencyStore",
                    "CommerceRuntimeTransactionManager",
                ],
            },
            CommerceBootstrapStartupStage {
                name: "bind-commerce-http-routes",
                depends_on: vec!["initialize-commerce-runtime"],
                required_contracts: vec![
                    "CommerceBootstrapHttpManifest",
                    "CommerceRuntimeOperationInput",
                    "CommerceRuntimeOperationEnvelope",
                ],
            },
            CommerceBootstrapStartupStage {
                name: "bind-commerce-tauri-commands",
                depends_on: vec!["initialize-commerce-runtime"],
                required_contracts: vec![
                    "CommerceTauriAdapterManifest",
                    "CommerceRuntimeOperationInput",
                    "CommerceRuntimeOperationEnvelope",
                ],
            },
        ]
    }

    pub fn standard_host_requirements() -> Vec<CommerceBootstrapHostRequirement> {
        vec![
            CommerceBootstrapHostRequirement {
                name: "commerce.database.connection",
                stage: "initialize-commerce-storage",
                required_contracts: vec!["CommerceStorageCapabilityManifest", "database_url"],
            },
            CommerceBootstrapHostRequirement {
                name: "commerce.database.migration-runner",
                stage: "initialize-commerce-storage",
                required_contracts: vec![
                    "CommerceStorageCapabilityManifest",
                    "CommerceMigrationRunnerSqlContract",
                    "CommerceStorageMigrationPlan",
                    "CommerceMigrationRunnerExecutionPlan",
                    "CommerceMigrationRunnerExecutionResult",
                    "CommerceMigrationRunnerFinalState",
                    "CommerceMigrationRunnerFailureRecovery",
                    "CommerceMigrationRunnerLockContract",
                    "CommerceMigrationRunnerLockLifecycle",
                    "CommerceMigrationRunnerLockCleanup",
                ],
            },
            CommerceBootstrapHostRequirement {
                name: "commerce.runtime.idempotency-store",
                stage: "initialize-commerce-runtime",
                required_contracts: vec![
                    "CommerceRuntimeIdempotencyStore",
                    "CommerceIdempotencyRepositorySqlContract",
                ],
            },
            CommerceBootstrapHostRequirement {
                name: "commerce.runtime.transaction-manager",
                stage: "initialize-commerce-runtime",
                required_contracts: vec![
                    "CommerceRuntimeTransactionManager",
                    "CommerceTransactionBoundarySqlContract",
                ],
            },
            CommerceBootstrapHostRequirement {
                name: "commerce.runtime.service-registry",
                stage: "initialize-commerce-runtime",
                required_contracts: vec![
                    "CommerceRuntimeServiceRegistry",
                    "CommerceRuntimeCapabilityManifest",
                ],
            },
            CommerceBootstrapHostRequirement {
                name: "commerce.http.authenticated-context",
                stage: "bind-commerce-http-routes",
                required_contracts: vec!["CommerceRuntimeContext", "CommerceRuntimeOperationInput"],
            },
            CommerceBootstrapHostRequirement {
                name: "commerce.http.route-binding",
                stage: "bind-commerce-http-routes",
                required_contracts: vec![
                    "CommerceBootstrapHttpManifest",
                    "CommerceRuntimeOperationEnvelope",
                ],
            },
            CommerceBootstrapHostRequirement {
                name: "commerce.tauri.command-binding",
                stage: "bind-commerce-tauri-commands",
                required_contracts: vec![
                    "CommerceTauriAdapterManifest",
                    "CommerceRuntimeOperationInput",
                    "CommerceRuntimeOperationEnvelope",
                ],
            },
        ]
    }

    pub fn validate(&self) -> Result<(), CommerceBootstrapValidationError> {
        self.validate_runtime_type_contracts()?;
        self.validate_storage_contracts()?;
        self.validate_http_contracts()?;
        self.validate_tauri_contracts()?;
        self.validate_startup_stage_contracts()?;
        self.validate_host_requirement_contracts()?;

        Ok(())
    }

    fn validate_runtime_type_contracts(&self) -> Result<(), CommerceBootstrapValidationError> {
        self.ensure(
            self.runtime.operation_input_type == self.operation_input_type,
            "Runtime operation input type must match bootstrap operation input type",
        )?;
        self.ensure(
            self.runtime.operation_output_type == self.operation_output_type,
            "Runtime operation output type must match bootstrap operation output type",
        )?;

        Ok(())
    }

    fn validate_storage_contracts(&self) -> Result<(), CommerceBootstrapValidationError> {
        validate_commerce_migration_plan(&self.storage.migration_plan).map_err(|error| {
            self.error(format!(
                "Storage migration plan must be valid: {}",
                error.message
            ))
        })?;
        validate_commerce_migration_runner_sql_contract(&self.storage.migration_runner).map_err(
            |error| {
                self.error(format!(
                    "Storage migration runner contract must be valid: {}",
                    error.message
                ))
            },
        )?;
        self.ensure(
            self.storage.migration_runner.plan == self.storage.migration_plan,
            "Storage migration runner plan must match storage migration plan",
        )?;
        self.ensure(
            self.storage.migration_runner.applied_migration_sequence == self.storage.migrations,
            "Storage migration runner sequence must match storage migrations",
        )?;
        self.ensure(
            self.storage.migration_runner.transaction_boundary_manager
                == self.storage.transaction_boundary.manager_name,
            "Storage migration runner transaction boundary must match storage transaction manager",
        )?;
        self.ensure(
            self.storage.idempotency_repository.repository_name == "idempotency.repository",
            "Storage idempotency repository must expose idempotency.repository",
        )?;
        self.ensure(
            self.storage
                .transaction_boundary
                .covered_repositories
                .contains(&"idempotency.repository"),
            "Storage transaction boundary must cover idempotency.repository",
        )?;

        Ok(())
    }

    fn validate_http_contracts(&self) -> Result<(), CommerceBootstrapValidationError> {
        self.ensure(
            self.http.app_routes.len() == self.http.execution_metadata.len(),
            "HTTP app routes must have matching execution metadata",
        )?;
        self.ensure(
            self.http.response_envelope.name == self.operation_output_type,
            "HTTP response envelope must match bootstrap operation output type",
        )?;
        self.ensure(
            self.http.response_envelope.applies_to_app_routes,
            "HTTP response envelope must apply to app routes",
        )?;
        self.ensure(
            self.http.runtime_input_binding.input_type == self.operation_input_type,
            "HTTP runtime input binding must match bootstrap operation input type",
        )?;
        self.ensure(
            self.http.runtime_input_binding.applies_to_app_routes,
            "HTTP runtime input binding must apply to app routes",
        )?;

        for route in &self.http.app_routes {
            self.ensure(
                route.response_envelope_name == self.operation_output_type,
                "HTTP route response envelope name must match bootstrap operation output type",
            )?;
            self.ensure(
                route.runtime_input_binding_name == self.operation_input_type,
                "HTTP route runtime input binding name must match bootstrap operation input type",
            )?;
            self.ensure(
                self.runtime_operation_contract(route.operation_id)
                    .is_some(),
                format!(
                    "HTTP app route operation is not in runtime contracts: {}",
                    route.operation_id
                ),
            )?;
            self.ensure(
                self.http
                    .execution_metadata
                    .iter()
                    .any(|metadata| metadata.operation_id == route.operation_id),
                format!(
                    "HTTP app route is missing execution metadata: {}",
                    route.operation_id
                ),
            )?;
        }

        for metadata in &self.http.execution_metadata {
            let contract = self
                .runtime_operation_contract(metadata.operation_id)
                .ok_or_else(|| {
                    self.error(format!(
                        "HTTP execution metadata operation is not in runtime contracts: {}",
                        metadata.operation_id
                    ))
                })?;

            self.ensure(
                metadata.service_name == contract.service_name,
                format!(
                    "HTTP execution metadata service mismatch for operation: {}",
                    metadata.operation_id
                ),
            )?;
            self.ensure(
                metadata.execution_policy == contract.execution_policy,
                format!(
                    "HTTP execution metadata policy mismatch for operation: {}",
                    metadata.operation_id
                ),
            )?;
            self.ensure(
                metadata.capability_name == contract.capability_name,
                format!(
                    "HTTP execution metadata capability mismatch for operation: {}",
                    metadata.operation_id
                ),
            )?;
            self.ensure(
                metadata.requires_idempotency == contract.requires_idempotency(),
                format!(
                    "HTTP execution metadata idempotency mismatch for operation: {}",
                    metadata.operation_id
                ),
            )?;
            self.ensure(
                metadata.requires_transaction == contract.requires_transaction(),
                format!(
                    "HTTP execution metadata transaction mismatch for operation: {}",
                    metadata.operation_id
                ),
            )?;
        }

        Ok(())
    }

    fn validate_tauri_contracts(&self) -> Result<(), CommerceBootstrapValidationError> {
        self.ensure(
            self.tauri.command_bindings.len() == self.tauri.commands.len(),
            "Tauri commands must have matching command bindings",
        )?;
        self.ensure(
            self.tauri.response_envelope.name == self.operation_output_type,
            "Tauri response envelope must match bootstrap operation output type",
        )?;
        self.ensure(
            self.tauri.response_envelope.applies_to_tauri_commands,
            "Tauri response envelope must apply to commands",
        )?;
        self.ensure(
            self.tauri.runtime_input_binding.input_type == self.operation_input_type,
            "Tauri runtime input binding must match bootstrap operation input type",
        )?;
        self.ensure(
            self.tauri.runtime_input_binding.applies_to_tauri_commands,
            "Tauri runtime input binding must apply to commands",
        )?;

        for binding in &self.tauri.command_bindings {
            self.validate_tauri_command_binding(binding)?;
        }

        for command in &self.tauri.commands {
            self.ensure(
                self.tauri
                    .command_bindings
                    .iter()
                    .any(|binding| binding.command == *command),
                format!("Tauri command is missing a binding: {command}"),
            )?;
        }

        Ok(())
    }

    fn validate_tauri_command_binding(
        &self,
        binding: &CommerceTauriCommandBinding,
    ) -> Result<(), CommerceBootstrapValidationError> {
        self.ensure(
            self.tauri.commands.contains(&binding.command),
            format!(
                "Tauri command binding references an unknown command: {}",
                binding.command
            ),
        )?;
        self.ensure(
            binding.response_envelope_name == self.operation_output_type,
            "Tauri command binding response envelope must match bootstrap operation output type",
        )?;
        self.ensure(
            binding.runtime_input_binding_name == self.operation_input_type,
            "Tauri command binding runtime input binding must match bootstrap operation input type",
        )?;

        let contract = self
            .runtime_operation_contract(binding.operation_id)
            .ok_or_else(|| {
                self.error(format!(
                    "Tauri command binding operation is not in runtime contracts: {}",
                    binding.operation_id
                ))
            })?;

        self.ensure(
            binding.service_name == contract.service_name,
            format!(
                "Tauri command binding service mismatch for operation: {}",
                binding.operation_id
            ),
        )?;
        self.ensure(
            binding.execution_policy == contract.execution_policy,
            format!(
                "Tauri command binding policy mismatch for operation: {}",
                binding.operation_id
            ),
        )?;
        self.ensure(
            binding.capability_name == contract.capability_name,
            format!(
                "Tauri command binding capability mismatch for operation: {}",
                binding.operation_id
            ),
        )?;
        self.ensure(
            binding.requires_idempotency == contract.requires_idempotency(),
            format!(
                "Tauri command binding idempotency mismatch for operation: {}",
                binding.operation_id
            ),
        )?;
        self.ensure(
            binding.requires_transaction == contract.requires_transaction(),
            format!(
                "Tauri command binding transaction mismatch for operation: {}",
                binding.operation_id
            ),
        )?;

        Ok(())
    }

    fn validate_startup_stage_contracts(&self) -> Result<(), CommerceBootstrapValidationError> {
        let standard_stages = Self::standard_startup_stages();
        for (index, stage) in self.startup_stages.iter().enumerate() {
            self.ensure(
                !stage.name.trim().is_empty(),
                "Bootstrap startup stage name is required",
            )?;
            self.ensure(
                !stage.required_contracts.is_empty(),
                format!(
                    "Bootstrap startup stage must declare required contracts: {}",
                    stage.name
                ),
            )?;
            self.ensure(
                self.startup_stages
                    .iter()
                    .filter(|candidate| candidate.name == stage.name)
                    .count()
                    == 1,
                format!(
                    "Bootstrap startup stages must have unique names: {}",
                    stage.name
                ),
            )?;

            for dependency in &stage.depends_on {
                let dependency_index = self
                    .startup_stages
                    .iter()
                    .position(|candidate| candidate.name == *dependency)
                    .ok_or_else(|| {
                        self.error(format!(
                            "Bootstrap startup stage dependency is not declared: {} -> {}",
                            stage.name, dependency
                        ))
                    })?;
                self.ensure(
                    dependency_index < index,
                    format!(
                        "Bootstrap startup stage dependency must be declared before dependent stage: {} -> {}",
                        stage.name, dependency
                    ),
                )?;
            }

            if let Some(standard_stage) = standard_stages
                .iter()
                .find(|standard_stage| standard_stage.name == stage.name)
            {
                for contract in &standard_stage.required_contracts {
                    self.ensure(
                        stage.required_contracts.contains(contract),
                        format!(
                            "Bootstrap startup stage must include standard contract: {} -> {}",
                            stage.name, contract
                        ),
                    )?;
                }
            }
        }

        Ok(())
    }

    fn validate_host_requirement_contracts(&self) -> Result<(), CommerceBootstrapValidationError> {
        let standard_requirements = Self::standard_host_requirements();
        for requirement in &self.host_requirements {
            self.ensure(
                !requirement.name.trim().is_empty(),
                "Bootstrap host requirement name is required",
            )?;
            self.ensure(
                self.host_requirements
                    .iter()
                    .filter(|candidate| candidate.name == requirement.name)
                    .count()
                    == 1,
                format!(
                    "Bootstrap host requirements must have unique names: {}",
                    requirement.name
                ),
            )?;
            self.ensure(
                !requirement.required_contracts.is_empty(),
                format!(
                    "Bootstrap host requirement must declare required contracts: {}",
                    requirement.name
                ),
            )?;
            self.ensure(
                self.startup_stages
                    .iter()
                    .any(|stage| stage.name == requirement.stage),
                format!(
                    "Bootstrap host requirement stage is not declared: {} -> {}",
                    requirement.name, requirement.stage
                ),
            )?;

            if let Some(standard_requirement) = standard_requirements
                .iter()
                .find(|standard_requirement| standard_requirement.name == requirement.name)
            {
                for contract in &standard_requirement.required_contracts {
                    self.ensure(
                        requirement.required_contracts.contains(contract),
                        format!(
                            "Bootstrap host requirement must include standard contract: {} -> {}",
                            requirement.name, contract
                        ),
                    )?;
                }
            }
        }

        for standard_requirement in standard_requirements {
            self.ensure(
                self.host_requirements
                    .iter()
                    .any(|requirement| requirement.name == standard_requirement.name),
                format!(
                    "Bootstrap host requirements must include standard requirement: {}",
                    standard_requirement.name
                ),
            )?;
        }

        for stage in self
            .startup_stages
            .iter()
            .filter(|stage| stage.name != "validate-bootstrap-contracts")
        {
            self.ensure(
                self.host_requirements
                    .iter()
                    .any(|requirement| requirement.stage == stage.name),
                format!(
                    "Bootstrap startup stage must have host requirement coverage: {}",
                    stage.name
                ),
            )?;
        }

        Ok(())
    }

    fn runtime_operation_contract(
        &self,
        operation_id: &str,
    ) -> Option<&sdkwork_commerce_core::CommerceOperationContract> {
        self.runtime
            .operation_contracts
            .iter()
            .find(|contract| contract.operation_id == operation_id)
    }

    fn ensure(
        &self,
        condition: bool,
        message: impl Into<String>,
    ) -> Result<(), CommerceBootstrapValidationError> {
        condition.then_some(()).ok_or_else(|| self.error(message))
    }

    fn error(&self, message: impl Into<String>) -> CommerceBootstrapValidationError {
        CommerceBootstrapValidationError {
            code: "bootstrap-contract-mismatch",
            message: message.into(),
        }
    }
}

pub fn commerce_local_private_bootstrap_manifest() -> CommerceLocalPrivateBootstrapManifest {
    CommerceLocalPrivateBootstrapManifest {
        name: "sdkwork-commerce-local-private-bootstrap",
        bootstrap_version: "commerce.bootstrap.v1",
        runtime: commerce_runtime_capability_manifest(),
        storage: commerce_storage_capability_manifest(),
        http: CommerceBootstrapHttpManifest {
            app_routes: app_routes(),
            execution_metadata: app_route_execution_metadata(),
            response_envelope: commerce_http_response_envelope(),
            runtime_input_binding: commerce_http_runtime_input_binding(),
        },
        tauri: commerce_tauri_adapter_manifest(),
        operation_input_type: "CommerceRuntimeOperationInput",
        operation_output_type: "CommerceRuntimeOperationEnvelope",
        startup_stages: CommerceLocalPrivateBootstrapManifest::standard_startup_stages(),
        host_requirements: CommerceLocalPrivateBootstrapManifest::standard_host_requirements(),
    }
}

pub fn run_commerce_local_private_bootstrap_preflight(
) -> Result<CommerceLocalPrivateBootstrapPreflight, CommerceBootstrapValidationError> {
    commerce_local_private_bootstrap_manifest().preflight()
}

pub fn commerce_experience_seed_manifest() -> CommerceExperienceSeedManifest {
    let membership_plans = commerce_membership_plan_seeds();
    let membership_package_groups = commerce_membership_package_group_seeds();
    let membership_packages = commerce_membership_package_seeds();
    let recharge_packages = commerce_recharge_package_seeds();
    let payment_methods = commerce_payment_method_seeds();

    CommerceExperienceSeedManifest {
        name: "sdkwork-commerce-experience-seed",
        seed_version: "commerce.experience.seed.v1",
        membership_plan_count: membership_plans.len(),
        membership_package_group_count: membership_package_groups.len(),
        membership_package_count: membership_packages.len(),
        recharge_package_count: recharge_packages.len(),
        payment_method_count: payment_methods.len(),
        payload_json: commerce_experience_seed_payload(
            &membership_plans,
            &membership_package_groups,
            &membership_packages,
            &recharge_packages,
            &payment_methods,
        ),
    }
}

pub fn commerce_membership_plan_seeds() -> Vec<CommerceMembershipPlanSeed> {
    vec![
        CommerceMembershipPlanSeed {
            id: "seed-membership-plan-free",
            plan_no: "free",
            name: "Free",
            rank: 0,
            required_points: 0,
            validity_days: 1,
            badge: "Free",
            description: "Entry access for product discovery, public model routing, and a small trial quota.",
            benefits: free_membership_benefits(),
        },
        CommerceMembershipPlanSeed {
            id: "seed-membership-plan-basic",
            plan_no: "basic",
            name: "Basic member",
            rank: 1,
            required_points: 1_000,
            validity_days: 30,
            badge: "Basic",
            description: "Daily individual usage with standard model access, stable routing, API keys, and longer history.",
            benefits: basic_membership_benefits(),
        },
        CommerceMembershipPlanSeed {
            id: "seed-membership-plan-pro",
            plan_no: "pro",
            name: "Advanced member",
            rank: 2,
            required_points: 5_000,
            validity_days: 30,
            badge: "Pro",
            description: "High-frequency creation and development workflows with advanced models, larger context, and higher concurrency.",
            benefits: pro_membership_benefits(),
        },
        CommerceMembershipPlanSeed {
            id: "seed-membership-plan-premium",
            plan_no: "premium",
            name: "Premium member",
            rank: 3,
            required_points: 20_000,
            validity_days: 30,
            badge: "Premium",
            description: "Team and critical business usage with frontier model access, highest priority, and dedicated support.",
            benefits: premium_membership_benefits(),
        },
    ]
}

pub fn commerce_membership_package_group_seeds() -> Vec<CommerceMembershipPackageGroupSeed> {
    vec![
        CommerceMembershipPackageGroupSeed {
            id: "seed-membership-package-group-month",
            external_id: 1,
            package_group_no: "membership-month",
            name: "Monthly purchase",
            description: "Monthly membership packages for recurring individual and team usage.",
            billing_cycle: "month",
            duration_days: 30,
            sort_weight: 10,
        },
        CommerceMembershipPackageGroupSeed {
            id: "seed-membership-package-group-year",
            external_id: 2,
            package_group_no: "membership-year",
            name: "Yearly purchase",
            description: "Yearly membership packages with annual value and long-term quotas.",
            billing_cycle: "year",
            duration_days: 365,
            sort_weight: 20,
        },
        CommerceMembershipPackageGroupSeed {
            id: "seed-membership-package-group-day",
            external_id: 3,
            package_group_no: "membership-day",
            name: "Single-day purchase",
            description:
                "Single-day membership packages for short trials and temporary high-intensity work.",
            billing_cycle: "day",
            duration_days: 1,
            sort_weight: 30,
        },
        CommerceMembershipPackageGroupSeed {
            id: "seed-membership-package-group-week",
            external_id: 4,
            package_group_no: "membership-week",
            name: "Weekly purchase",
            description:
                "Weekly membership packages for project sprints and short-term team validation.",
            billing_cycle: "week",
            duration_days: 7,
            sort_weight: 40,
        },
    ]
}

pub fn commerce_membership_package_seeds() -> Vec<CommerceMembershipPackageSeed> {
    vec![
        membership_package(301, "membership-month", "free", "Monthly Free", "Monthly purchase - Free", "Monthly free quota for low-frequency product experience.", "0.00", None, 1_000, 30, 301, false, &["monthly", "free", "trial"]),
        membership_package(302, "membership-month", "basic", "Monthly Basic", "Monthly purchase - Basic member", "Monthly basic membership for everyday model calls and API access.", "29.90", Some("49.90"), 12_000, 30, 302, false, &["monthly", "basic", "individual"]),
        membership_package(303, "membership-month", "pro", "Monthly Advanced", "Monthly purchase - Advanced member", "Monthly advanced membership for high-frequency creation, development, and operations workflows.", "69.90", Some("129.00"), 45_000, 30, 303, true, &["monthly", "advanced", "recommended"]),
        membership_package(304, "membership-month", "premium", "Monthly Premium", "Monthly purchase - Premium member", "Monthly premium membership for team usage and critical business workloads.", "199.00", Some("299.00"), 160_000, 30, 304, false, &["monthly", "premium", "team"]),
        membership_package(401, "membership-year", "free", "Yearly Free", "Yearly purchase - Free", "Yearly free quota for long-term product discovery.", "0.00", None, 12_000, 365, 401, false, &["yearly", "free", "trial"]),
        membership_package(402, "membership-year", "basic", "Yearly Basic", "Yearly purchase - Basic member", "Yearly basic membership for stable individual usage with annual value.", "299.00", Some("358.80"), 180_000, 365, 402, false, &["yearly", "basic", "annual"]),
        membership_package(403, "membership-year", "pro", "Yearly Advanced", "Yearly purchase - Advanced member", "Yearly advanced membership for sustained creation, development, and automation workflows.", "699.00", Some("838.80"), 720_000, 365, 403, false, &["yearly", "advanced", "annual"]),
        membership_package(404, "membership-year", "premium", "Yearly Premium", "Yearly purchase - Premium member", "Yearly premium membership for long-term teams, dedicated support, and highest priority.", "1999.00", Some("2388.00"), 2_400_000, 365, 404, true, &["yearly", "premium", "best-value"]),
        membership_package(101, "membership-day", "free", "Single-day Free", "Single-day purchase - Free", "Single-day free experience for first-time model routing and basic chat.", "0.00", None, 100, 1, 101, false, &["single-day", "free", "trial"]),
        membership_package(102, "membership-day", "basic", "Single-day Basic", "Single-day purchase - Basic member", "Single-day basic membership for short standard model and API trials.", "1.90", Some("3.90"), 500, 1, 102, false, &["single-day", "basic", "api"]),
        membership_package(103, "membership-day", "pro", "Single-day Advanced", "Single-day purchase - Advanced member", "Single-day advanced membership for temporary high-intensity creation and long-context tasks.", "4.90", Some("9.90"), 1_500, 1, 103, false, &["single-day", "advanced", "long-context"]),
        membership_package(104, "membership-day", "premium", "Single-day Premium", "Single-day purchase - Premium member", "Single-day premium membership for trying frontier models and highest priority.", "9.90", Some("19.90"), 4_000, 1, 104, false, &["single-day", "premium", "priority"]),
        membership_package(201, "membership-week", "free", "Weekly Free", "Weekly purchase - Free", "Weekly free experience for low-frequency exploration.", "0.00", None, 300, 7, 201, false, &["weekly", "free", "trial"]),
        membership_package(202, "membership-week", "basic", "Weekly Basic", "Weekly purchase - Basic member", "Weekly basic membership for one week of stable standard model usage.", "9.90", Some("19.90"), 3_000, 7, 202, false, &["weekly", "basic", "standard-models"]),
        membership_package(203, "membership-week", "pro", "Weekly Advanced", "Weekly purchase - Advanced member", "Weekly advanced membership for project sprints, batch creation, and development validation.", "19.90", Some("39.90"), 9_000, 7, 203, false, &["weekly", "advanced", "batch-work"]),
        membership_package(204, "membership-week", "premium", "Weekly Premium", "Weekly purchase - Premium member", "Weekly premium membership for short-term team collaboration and key business validation.", "49.90", Some("99.90"), 24_000, 7, 204, false, &["weekly", "premium", "team"]),
    ]
}

pub fn commerce_recharge_package_seeds() -> Vec<CommerceRechargePackageSeed> {
    vec![
        recharge_package(
            "seed-recharge-package-990",
            "seed-recharge-sku-990",
            "points-990",
            "points-recharge-990",
            990,
            "9.90 points package",
            "9.90",
            50,
            10,
        ),
        recharge_package(
            "seed-recharge-package-1990",
            "seed-recharge-sku-1990",
            "points-1990",
            "points-recharge-1990",
            1990,
            "19.90 points package",
            "19.90",
            150,
            20,
        ),
        recharge_package(
            "seed-recharge-package-4990",
            "seed-recharge-sku-4990",
            "points-4990",
            "points-recharge-4990",
            4990,
            "49.90 points package",
            "49.90",
            600,
            30,
        ),
        recharge_package(
            "seed-recharge-package-9990",
            "seed-recharge-sku-9990",
            "points-9990",
            "points-recharge-9990",
            9990,
            "99.90 points package",
            "99.90",
            1_500,
            40,
        ),
    ]
}

pub fn commerce_payment_method_seeds() -> Vec<CommercePaymentMethodSeed> {
    vec![
        CommercePaymentMethodSeed {
            id: "seed-payment-wechat",
            method_key: "wechat",
            display_name: "WeChat Pay",
            provider: "wechatpay",
            sort_weight: 10,
        },
        CommercePaymentMethodSeed {
            id: "seed-payment-alipay",
            method_key: "alipay",
            display_name: "Alipay",
            provider: "alipay",
            sort_weight: 20,
        },
        CommercePaymentMethodSeed {
            id: "seed-payment-stripe",
            method_key: "stripe",
            display_name: "Bank card",
            provider: "stripe",
            sort_weight: 30,
        },
    ]
}

fn membership_package(
    external_id: i64,
    package_group_no: &'static str,
    plan_no: &'static str,
    name: &'static str,
    title: &'static str,
    description: &'static str,
    price_amount: &'static str,
    original_price_amount: Option<&'static str>,
    point_amount: i64,
    duration_days: i64,
    sort_weight: i64,
    recommended: bool,
    tags: &[&'static str],
) -> CommerceMembershipPackageSeed {
    let group_code = package_group_no.trim_start_matches("membership-");
    CommerceMembershipPackageSeed {
        id: match external_id {
            101 => "101",
            102 => "102",
            103 => "103",
            104 => "104",
            201 => "201",
            202 => "202",
            203 => "203",
            204 => "204",
            301 => "301",
            302 => "302",
            303 => "303",
            304 => "304",
            401 => "401",
            402 => "402",
            403 => "403",
            404 => "404",
            _ => "0",
        },
        external_id,
        package_no: match external_id {
            101 => "membership-day-free",
            102 => "membership-day-basic",
            103 => "membership-day-pro",
            104 => "membership-day-premium",
            201 => "membership-week-free",
            202 => "membership-week-basic",
            203 => "membership-week-pro",
            204 => "membership-week-premium",
            301 => "membership-month-free",
            302 => "membership-month-basic",
            303 => "membership-month-pro",
            304 => "membership-month-premium",
            401 => "membership-year-free",
            402 => "membership-year-basic",
            403 => "membership-year-pro",
            404 => "membership-year-premium",
            _ => "membership-unknown",
        },
        package_group_no,
        plan_no,
        sku_id: match external_id {
            101 => "101",
            102 => "102",
            103 => "103",
            104 => "104",
            201 => "201",
            202 => "202",
            203 => "203",
            204 => "204",
            301 => "301",
            302 => "302",
            303 => "303",
            304 => "304",
            401 => "401",
            402 => "402",
            403 => "403",
            404 => "404",
            _ => "0",
        },
        sku_no: match (group_code, plan_no) {
            ("day", "free") => "membership-day-free",
            ("day", "basic") => "membership-day-basic",
            ("day", "pro") => "membership-day-pro",
            ("day", "premium") => "membership-day-premium",
            ("week", "free") => "membership-week-free",
            ("week", "basic") => "membership-week-basic",
            ("week", "pro") => "membership-week-pro",
            ("week", "premium") => "membership-week-premium",
            ("month", "free") => "membership-month-free",
            ("month", "basic") => "membership-month-basic",
            ("month", "pro") => "membership-month-pro",
            ("month", "premium") => "membership-month-premium",
            ("year", "free") => "membership-year-free",
            ("year", "basic") => "membership-year-basic",
            ("year", "pro") => "membership-year-pro",
            ("year", "premium") => "membership-year-premium",
            _ => "membership-unknown",
        },
        name,
        title,
        description,
        price_amount,
        original_price_amount,
        currency_code: "CNY",
        point_amount,
        duration_days,
        sort_weight,
        recommended,
        tags: tags.to_vec(),
    }
}

fn recharge_package(
    package_id: &'static str,
    sku_id: &'static str,
    package_no: &'static str,
    sku_no: &'static str,
    external_id: i64,
    name: &'static str,
    price_amount: &'static str,
    bonus_points: i64,
    sort_weight: i64,
) -> CommerceRechargePackageSeed {
    CommerceRechargePackageSeed {
        package_id,
        sku_id,
        package_no,
        sku_no,
        external_id,
        name,
        price_amount,
        currency_code: "CNY",
        bonus_points,
        sort_weight,
    }
}

fn free_membership_benefits() -> Vec<CommerceMembershipBenefitSeed> {
    vec![
        benefit(
            1,
            "basic_models",
            "Basic model access",
            "Use the basic model catalog and public routes.",
            "model_access",
            0,
        ),
        benefit(
            2,
            "trial_points",
            "Trial points",
            "Small point quota for first-time product evaluation.",
            "quota",
            1_000,
        ),
        benefit(
            3,
            "low_priority",
            "Normal queue",
            "Requests enter the shared normal queue.",
            "priority",
            1,
        ),
        benefit(
            4,
            "concurrent_requests",
            "Concurrent requests",
            "Up to 1 concurrent request.",
            "limit",
            1,
        ),
        benefit(
            5,
            "context_window",
            "Context window",
            "Up to 4K context window.",
            "limit",
            4_000,
        ),
        benefit(
            6,
            "history_retention",
            "History retention",
            "Conversation and call history retained for 7 days.",
            "retention",
            7,
        ),
    ]
}

fn basic_membership_benefits() -> Vec<CommerceMembershipBenefitSeed> {
    vec![
        benefit(
            1,
            "standard_models",
            "Standard model access",
            "Unlock standard models, common multimodal capabilities, and stable routing.",
            "model_access",
            1,
        ),
        benefit(
            2,
            "monthly_points",
            "Member points quota",
            "Monthly points for chat, tool execution, and generation tasks.",
            "quota",
            12_000,
        ),
        benefit(
            3,
            "normal_priority",
            "Standard priority",
            "Requests use a standard priority queue for daily work.",
            "priority",
            2,
        ),
        benefit(
            4,
            "concurrent_requests",
            "Concurrent requests",
            "Up to 3 concurrent requests.",
            "limit",
            3,
        ),
        benefit(
            5,
            "context_window",
            "Context window",
            "Up to 16K context window.",
            "limit",
            16_000,
        ),
        benefit(
            6,
            "history_retention",
            "History retention",
            "Conversation and call history retained for 30 days.",
            "retention",
            30,
        ),
        benefit(
            7,
            "api_key_access",
            "API keys",
            "Create API keys for gateway access.",
            "api",
            1,
        ),
    ]
}

fn pro_membership_benefits() -> Vec<CommerceMembershipBenefitSeed> {
    vec![
        benefit(
            1,
            "advanced_models",
            "Advanced model access",
            "Unlock advanced reasoning, coding, and multimodal models.",
            "model_access",
            2,
        ),
        benefit(
            2,
            "monthly_points",
            "Member points quota",
            "Higher monthly points for high-frequency workflows.",
            "quota",
            45_000,
        ),
        benefit(
            3,
            "high_priority",
            "High priority",
            "Requests are placed ahead in peak periods.",
            "priority",
            3,
        ),
        benefit(
            4,
            "concurrent_requests",
            "Concurrent requests",
            "Up to 8 concurrent requests.",
            "limit",
            8,
        ),
        benefit(
            5,
            "context_window",
            "Context window",
            "Up to 64K context window.",
            "limit",
            64_000,
        ),
        benefit(
            6,
            "history_retention",
            "History retention",
            "Conversation and call history retained for 180 days.",
            "retention",
            180,
        ),
        benefit(
            7,
            "batch_tools",
            "Batch and tool capabilities",
            "Batch tasks, tool calls, and advanced routing strategies.",
            "tools",
            1,
        ),
    ]
}

fn premium_membership_benefits() -> Vec<CommerceMembershipBenefitSeed> {
    vec![
        benefit(
            1,
            "frontier_models",
            "Frontier model access",
            "Priority access to frontier models, long context, and high-quality generation.",
            "model_access",
            3,
        ),
        benefit(
            2,
            "monthly_points",
            "Member points quota",
            "Highest point quota for teams and critical workloads.",
            "quota",
            160_000,
        ),
        benefit(
            3,
            "top_priority",
            "Top priority",
            "Requests enter the highest priority queue in peak periods.",
            "priority",
            4,
        ),
        benefit(
            4,
            "concurrent_requests",
            "Concurrent requests",
            "Up to 20 concurrent requests.",
            "limit",
            20,
        ),
        benefit(
            5,
            "context_window",
            "Context window",
            "Up to 128K context window.",
            "limit",
            128_000,
        ),
        benefit(
            6,
            "history_retention",
            "History retention",
            "Conversation and call history retained for 365 days.",
            "retention",
            365,
        ),
        benefit(
            7,
            "dedicated_support",
            "Dedicated support",
            "Dedicated support, early capability trials, and usage guidance.",
            "support",
            1,
        ),
    ]
}

fn benefit(
    id: i64,
    benefit_key: &'static str,
    name: &'static str,
    description: &'static str,
    benefit_type: &'static str,
    usage_limit: i64,
) -> CommerceMembershipBenefitSeed {
    CommerceMembershipBenefitSeed {
        id,
        benefit_key,
        name,
        description,
        benefit_type,
        usage_limit,
    }
}

fn commerce_experience_seed_payload(
    plans: &[CommerceMembershipPlanSeed],
    groups: &[CommerceMembershipPackageGroupSeed],
    packages: &[CommerceMembershipPackageSeed],
    recharge_packages: &[CommerceRechargePackageSeed],
    payment_methods: &[CommercePaymentMethodSeed],
) -> String {
    format!(
        r#"{{"version":"commerce.experience.seed.v1","membershipPlans":{},"membershipPackageGroups":{},"membershipPackages":{},"rechargePackages":{},"paymentMethods":{}}}"#,
        string_array_json(plans.iter().map(|plan| plan.plan_no)),
        string_array_json(groups.iter().map(|group| group.package_group_no)),
        string_array_json(packages.iter().map(|package| package.package_no)),
        string_array_json(recharge_packages.iter().map(|package| package.package_no)),
        string_array_json(payment_methods.iter().map(|method| method.method_key)),
    )
}

fn string_array_json<'a>(values: impl Iterator<Item = &'a str>) -> String {
    let items = values
        .map(|value| format!("\"{}\"", json_escape(value)))
        .collect::<Vec<_>>()
        .join(",");
    format!("[{items}]")
}

fn json_escape(value: &str) -> String {
    value.replace('\\', "\\\\").replace('"', "\\\"")
}
