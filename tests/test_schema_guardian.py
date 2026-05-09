import tempfile
import textwrap
import unittest
from pathlib import Path

from tools.schema_guardian import SchemaGuardian


class SchemaGuardianTest(unittest.TestCase):
    def write_registry(self, root: Path, content: str) -> Path:
        registry = root / "docs" / "schema-registry" / "sdkwork-claw-router.tables.yaml"
        registry.parent.mkdir(parents=True, exist_ok=True)
        registry.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return registry

    def write_java_entity(self, root: Path, relative_path: str) -> None:
        path = root / "spring-ai-plus-business-entity" / "src" / "main" / "java" / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("package test;\npublic class Entity {}\n", encoding="utf-8")

    def write_rust_test_schema(self, root: Path, content: str) -> Path:
        path = root / "services" / "sdkwork-claw-admin-api" / "tests" / "database_config_router.rs"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return path

    def test_rejects_forbidden_synonym_table(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: [commerce_order]
                tables:
                  - table: commerce_order
                    domain: commerce
                    compliance_level: L3
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("forbidden synonym table present: commerce_order", result.messages)

    def test_requires_java_first_contract_tables_to_be_registered_as_l0_legacy(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_java_entity(
                root,
                "com/sdkwork/spring/ai/plus/entity/trade/PlusOrder.java",
            )
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                legacy_java_contracts:
                  finance_and_trade:
                    order:
                      tables: [plus_order]
                      entities:
                        plus_order: com.sdkwork.spring.ai.plus.entity.trade.PlusOrder
                tables:
                  - table: plus_order
                    domain: legacy
                    compliance_level: L2
                    write_owner: other-service
                    generated_by_this_project: true
                    compatibility_rule: forked_structure
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("plus_order compliance_level must be L0", result.messages)
            self.assertIn("plus_order write_owner must be spring-ai-plus-business-entity", result.messages)
            self.assertIn("plus_order generated_by_this_project must be false", result.messages)
            self.assertIn("plus_order compatibility_rule must be keep_physical_structure_identical", result.messages)

    def test_checks_java_entity_files_for_contracts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                legacy_java_contracts:
                  finance_and_trade:
                    payment:
                      tables: [plus_payment]
                      entities:
                        plus_payment: com.sdkwork.spring.ai.plus.entity.trade.PlusPayment
                tables:
                  - table: plus_payment
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "missing Java entity for plus_payment: com/sdkwork/spring/ai/plus/entity/trade/PlusPayment.java",
                result.messages,
            )

    def test_requires_plus_user_coupon_code_unique_index_contract(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_user_coupon
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "plus_user_coupon must declare unique index uk_plus_user_coupon_code on coupon_code",
                result.messages,
            )

    def test_rejects_string_unique_flag_for_required_legacy_index(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_user_coupon
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    indexes:
                      - { name: uk_plus_user_coupon_code, unique: "true", columns: [coupon_code] }
                      - { name: uk_plus_user_coupon_acquire_request_no, unique: true, columns: [user_id, acquire_request_no] }
                      - { name: idx_plus_user_coupon_coupon_id, columns: [coupon_id] }
                      - { name: idx_plus_user_coupon_user_status, columns: [user_id, status] }
                      - { name: idx_plus_user_coupon_expire_at, columns: [expire_at] }
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "plus_user_coupon must declare unique index uk_plus_user_coupon_code on coupon_code",
                result.messages,
            )

    def test_requires_production_legacy_indexes_in_rust_test_schema(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_order
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    indexes:
                      - { name: uk_plus_order_order_sn, unique: true, columns: [order_sn] }
                      - { name: uk_plus_order_out_trade_no, unique: true, columns: [out_trade_no] }
                      - { name: idx_plus_order_user_id, columns: [user_id] }
                      - { name: idx_plus_order_status, columns: [status] }
                      - { name: idx_plus_order_status_payment_expire, columns: [status, payment_expire_time] }
                      - { name: idx_plus_order_task_code, columns: [task_code] }
                      - { name: idx_plus_order_worker_user_id, columns: [worker_user_id] }
                      - { name: idx_plus_order_tenant_org_status, columns: [tenant_id, organization_id, status] }
                """,
            )
            test_schema = self.write_rust_test_schema(
                root,
                """
                const STATEMENTS: &[&str] = &[
                    r#"CREATE TABLE plus_order (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        order_sn TEXT,
                        out_trade_no TEXT,
                        user_id INTEGER,
                        status INTEGER,
                        payment_expire_time TEXT,
                        task_code TEXT,
                        worker_user_id INTEGER,
                        tenant_id INTEGER,
                        organization_id INTEGER
                    )"#,
                    "CREATE UNIQUE INDEX uk_plus_order_order_sn ON plus_order (order_sn)",
                    "CREATE INDEX idx_plus_order_user_id ON plus_order (user_id)",
                    "CREATE INDEX idx_plus_order_status ON plus_order (status)",
                    "CREATE INDEX idx_plus_order_status_payment_expire ON plus_order (status, payment_expire_time)",
                    "CREATE INDEX idx_plus_order_task_code ON plus_order (task_code)",
                    "CREATE INDEX idx_plus_order_worker_user_id ON plus_order (worker_user_id)",
                    "CREATE INDEX idx_plus_order_tenant_org_status ON plus_order (tenant_id, organization_id, status)",
                ];
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry, test_schema_path=test_schema).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "database_config_router.rs test schema must create unique index "
                "uk_plus_order_out_trade_no on plus_order(out_trade_no)",
                result.messages,
            )

    def test_rejects_required_legacy_index_declared_under_wrong_table(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_order_item
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    indexes:
                      - { name: uk_plus_payment_out_trade_no, unique: true, columns: [out_trade_no] }
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "index uk_plus_payment_out_trade_no belongs to plus_payment, not plus_order_item",
                result.messages,
            )

    def test_requires_legacy_uuid_unique_constraint_in_registry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_order
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    indexes:
                      - { name: uk_plus_order_order_sn, unique: true, columns: [order_sn] }
                      - { name: uk_plus_order_out_trade_no, unique: true, columns: [out_trade_no] }
                      - { name: idx_plus_order_user_id, columns: [user_id] }
                      - { name: idx_plus_order_status, columns: [status] }
                      - { name: idx_plus_order_status_payment_expire, columns: [status, payment_expire_time] }
                      - { name: idx_plus_order_task_code, columns: [task_code] }
                      - { name: idx_plus_order_worker_user_id, columns: [worker_user_id] }
                      - { name: idx_plus_order_tenant_org_status, columns: [tenant_id, organization_id, status] }
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("plus_order must declare unique constraint on uuid", result.messages)

    def test_requires_legacy_uuid_unique_constraint_in_rust_test_schema(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_order
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    not_null_columns: [subject, order_type, owner_id, user_id, order_sn, out_trade_no, total_amount, paid_amount, status, category_id]
                    foreign_keys:
                      - { name: fk_plus_order_user, columns: [user_id], references_table: plus_user, references_columns: [id] }
                      - { name: fk_plus_order_worker_user, columns: [worker_user_id], references_table: plus_user, references_columns: [id] }
                      - { name: fk_plus_order_dispatcher_user, columns: [dispatcher_user_id], references_table: plus_user, references_columns: [id] }
                    indexes:
                      - { name: uk_plus_order_order_sn, unique: true, columns: [order_sn] }
                      - { name: uk_plus_order_out_trade_no, unique: true, columns: [out_trade_no] }
                      - { name: idx_plus_order_user_id, columns: [user_id] }
                      - { name: idx_plus_order_status, columns: [status] }
                      - { name: idx_plus_order_status_payment_expire, columns: [status, payment_expire_time] }
                      - { name: idx_plus_order_task_code, columns: [task_code] }
                      - { name: idx_plus_order_worker_user_id, columns: [worker_user_id] }
                      - { name: idx_plus_order_tenant_org_status, columns: [tenant_id, organization_id, status] }
                """,
            )
            test_schema = self.write_rust_test_schema(
                root,
                """
                const STATEMENTS: &[&str] = &[
                    r#"CREATE TABLE plus_order (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        uuid TEXT NOT NULL,
                        order_sn TEXT,
                        out_trade_no TEXT,
                        user_id INTEGER,
                        status INTEGER,
                        payment_expire_time TEXT,
                        task_code TEXT,
                        worker_user_id INTEGER,
                        tenant_id INTEGER,
                        organization_id INTEGER
                    )"#,
                    "CREATE UNIQUE INDEX uk_plus_order_order_sn ON plus_order (order_sn)",
                    "CREATE UNIQUE INDEX uk_plus_order_out_trade_no ON plus_order (out_trade_no)",
                    "CREATE INDEX idx_plus_order_user_id ON plus_order (user_id)",
                    "CREATE INDEX idx_plus_order_status ON plus_order (status)",
                    "CREATE INDEX idx_plus_order_status_payment_expire ON plus_order (status, payment_expire_time)",
                    "CREATE INDEX idx_plus_order_task_code ON plus_order (task_code)",
                    "CREATE INDEX idx_plus_order_worker_user_id ON plus_order (worker_user_id)",
                    "CREATE INDEX idx_plus_order_tenant_org_status ON plus_order (tenant_id, organization_id, status)",
                ];
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry, test_schema_path=test_schema).run()

            self.assertFalse(result.ok)
            self.assertIn("database_config_router.rs test schema must make plus_order.uuid unique", result.messages)

    def test_requires_plus_vip_recharge_method_production_indexes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_vip_recharge_method
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "plus_vip_recharge_method must declare unique index "
                "uk_plus_vip_recharge_method_key on method_key",
                result.messages,
            )

    def test_requires_critical_legacy_not_null_columns_in_registry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_payment
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    indexes:
                      - { name: uk_plus_payment_out_trade_no, unique: true, columns: [out_trade_no] }
                      - { name: idx_plus_payment_status_expire, columns: [status, expire_time] }
                      - { name: idx_plus_payment_order_status, columns: [order_id, status] }
                      - { name: idx_plus_payment_provider_status, columns: [provider, status] }
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("plus_payment must declare not_null_columns including purpose", result.messages)

    def test_requires_critical_legacy_not_null_columns_in_rust_test_schema(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_payment
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    not_null_columns: [purpose, out_trade_no, channel, provider, status, amount]
                    indexes:
                      - { name: uk_plus_payment_out_trade_no, unique: true, columns: [out_trade_no] }
                      - { name: idx_plus_payment_status_expire, columns: [status, expire_time] }
                      - { name: idx_plus_payment_order_status, columns: [order_id, status] }
                      - { name: idx_plus_payment_provider_status, columns: [provider, status] }
                """,
            )
            test_schema = self.write_rust_test_schema(
                root,
                """
                const STATEMENTS: &[&str] = &[
                    r#"CREATE TABLE plus_payment (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        uuid TEXT NOT NULL UNIQUE,
                        purpose TEXT,
                        order_id INTEGER NOT NULL,
                        out_trade_no TEXT,
                        channel INTEGER,
                        provider INTEGER,
                        status INTEGER NOT NULL,
                        amount TEXT NOT NULL
                    )"#,
                    "CREATE UNIQUE INDEX uk_plus_payment_out_trade_no ON plus_payment (out_trade_no)",
                    "CREATE INDEX idx_plus_payment_status_expire ON plus_payment (status, expire_time)",
                    "CREATE INDEX idx_plus_payment_order_status ON plus_payment (order_id, status)",
                    "CREATE INDEX idx_plus_payment_provider_status ON plus_payment (provider, status)",
                ];
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry, test_schema_path=test_schema).run()

            self.assertFalse(result.ok)
            self.assertIn("database_config_router.rs test schema must make plus_payment.purpose NOT NULL", result.messages)

    def test_requires_critical_legacy_foreign_keys_in_registry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_payment
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    not_null_columns: [purpose, order_id, out_trade_no, channel, provider, status, amount]
                    indexes:
                      - { name: uk_plus_payment_out_trade_no, unique: true, columns: [out_trade_no] }
                      - { name: idx_plus_payment_status_expire, columns: [status, expire_time] }
                      - { name: idx_plus_payment_order_status, columns: [order_id, status] }
                      - { name: idx_plus_payment_provider_status, columns: [provider, status] }
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "plus_payment must declare foreign key "
                "fk_plus_payment_order on order_id references plus_order(id)",
                result.messages,
            )

    def test_requires_critical_legacy_foreign_keys_in_rust_test_schema(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_payment
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    not_null_columns: [purpose, order_id, out_trade_no, channel, provider, status, amount]
                    foreign_keys:
                      - { name: fk_plus_payment_order, columns: [order_id], references_table: plus_order, references_columns: [id] }
                    indexes:
                      - { name: uk_plus_payment_out_trade_no, unique: true, columns: [out_trade_no] }
                      - { name: idx_plus_payment_status_expire, columns: [status, expire_time] }
                      - { name: idx_plus_payment_order_status, columns: [order_id, status] }
                      - { name: idx_plus_payment_provider_status, columns: [provider, status] }
                """,
            )
            test_schema = self.write_rust_test_schema(
                root,
                """
                const STATEMENTS: &[&str] = &[
                    r#"CREATE TABLE plus_payment (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        uuid TEXT NOT NULL UNIQUE,
                        purpose TEXT NOT NULL,
                        order_id INTEGER NOT NULL,
                        out_trade_no TEXT NOT NULL,
                        channel INTEGER NOT NULL,
                        provider INTEGER NOT NULL,
                        status INTEGER NOT NULL,
                        amount TEXT NOT NULL,
                        expire_time TEXT
                    )"#,
                    "CREATE UNIQUE INDEX uk_plus_payment_out_trade_no ON plus_payment (out_trade_no)",
                    "CREATE INDEX idx_plus_payment_status_expire ON plus_payment (status, expire_time)",
                    "CREATE INDEX idx_plus_payment_order_status ON plus_payment (order_id, status)",
                    "CREATE INDEX idx_plus_payment_provider_status ON plus_payment (provider, status)",
                ];
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry, test_schema_path=test_schema).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "database_config_router.rs test schema must create foreign key "
                "fk_plus_payment_order on plus_payment(order_id) references plus_order(id)",
                result.messages,
            )

    def test_requires_sqlite_foreign_key_enforcement_for_legacy_test_schema(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_payment
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    not_null_columns: [purpose, order_id, out_trade_no, channel, provider, status, amount]
                    foreign_keys:
                      - { name: fk_plus_payment_order, columns: [order_id], references_table: plus_order, references_columns: [id] }
                    indexes:
                      - { name: uk_plus_payment_out_trade_no, unique: true, columns: [out_trade_no] }
                      - { name: idx_plus_payment_status_expire, columns: [status, expire_time] }
                      - { name: idx_plus_payment_order_status, columns: [order_id, status] }
                      - { name: idx_plus_payment_provider_status, columns: [provider, status] }
                """,
            )
            test_schema = self.write_rust_test_schema(
                root,
                """
                async fn create_sqlite_pool() {
                    let options = SqliteConnectOptions::from_str("sqlite::memory:").unwrap();
                }

                const STATEMENTS: &[&str] = &[
                    r#"CREATE TABLE plus_payment (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        uuid TEXT NOT NULL UNIQUE,
                        purpose TEXT NOT NULL,
                        order_id INTEGER NOT NULL,
                        out_trade_no TEXT NOT NULL,
                        channel INTEGER NOT NULL,
                        provider INTEGER NOT NULL,
                        status INTEGER NOT NULL,
                        amount TEXT NOT NULL,
                        expire_time TEXT,
                        CONSTRAINT fk_plus_payment_order FOREIGN KEY (order_id) REFERENCES plus_order (id)
                    )"#,
                    "CREATE UNIQUE INDEX uk_plus_payment_out_trade_no ON plus_payment (out_trade_no)",
                    "CREATE INDEX idx_plus_payment_status_expire ON plus_payment (status, expire_time)",
                    "CREATE INDEX idx_plus_payment_order_status ON plus_payment (order_id, status)",
                    "CREATE INDEX idx_plus_payment_provider_status ON plus_payment (provider, status)",
                ];
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry, test_schema_path=test_schema).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "database_config_router.rs SQLite test connections must enable foreign key enforcement",
                result.messages,
            )

    def test_requires_ledger_owner_foreign_keys_in_registry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_invoice
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                  - table: plus_vip_point_change
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    indexes:
                      - { name: idx_plus_vip_point_change_user, columns: [user_id] }
                      - { name: idx_plus_vip_point_change_type, columns: [change_type] }
                      - { name: idx_plus_vip_point_change_source, columns: [source_type] }
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "plus_invoice must declare foreign key "
                "fk_plus_invoice_user on user_id references plus_user(id)",
                result.messages,
            )
            self.assertIn(
                "plus_vip_point_change must declare foreign key "
                "fk_plus_vip_point_change_user on user_id references plus_user(id)",
                result.messages,
            )

    def test_requires_ledger_owner_foreign_keys_in_rust_test_schema(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_invoice
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    foreign_keys:
                      - { name: fk_plus_invoice_user, columns: [user_id], references_table: plus_user, references_columns: [id] }
                  - table: plus_vip_point_change
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    foreign_keys:
                      - { name: fk_plus_vip_point_change_user, columns: [user_id], references_table: plus_user, references_columns: [id] }
                    indexes:
                      - { name: idx_plus_vip_point_change_user, columns: [user_id] }
                      - { name: idx_plus_vip_point_change_type, columns: [change_type] }
                      - { name: idx_plus_vip_point_change_source, columns: [source_type] }
                """,
            )
            test_schema = self.write_rust_test_schema(
                root,
                """
                async fn create_sqlite_pool() {
                    let options = SqliteConnectOptions::from_str("sqlite::memory:")
                        .unwrap()
                        .foreign_keys(true);
                }

                const STATEMENTS: &[&str] = &[
                    r#"CREATE TABLE plus_invoice (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        uuid TEXT NOT NULL UNIQUE,
                        user_id INTEGER NOT NULL
                    )"#,
                    r#"CREATE TABLE plus_vip_point_change (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        uuid TEXT NOT NULL UNIQUE,
                        user_id INTEGER NOT NULL,
                        change_type INTEGER NOT NULL,
                        source_type TEXT
                    )"#,
                    "CREATE INDEX idx_plus_vip_point_change_user ON plus_vip_point_change (user_id)",
                    "CREATE INDEX idx_plus_vip_point_change_type ON plus_vip_point_change (change_type)",
                    "CREATE INDEX idx_plus_vip_point_change_source ON plus_vip_point_change (source_type)",
                ];
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry, test_schema_path=test_schema).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "database_config_router.rs test schema must create foreign key "
                "fk_plus_invoice_user on plus_invoice(user_id) references plus_user(id)",
                result.messages,
            )
            self.assertIn(
                "database_config_router.rs test schema must create foreign key "
                "fk_plus_vip_point_change_user on plus_vip_point_change(user_id) references plus_user(id)",
                result.messages,
            )

    def test_requires_trade_graph_foreign_keys_in_registry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_product
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_sku
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_order_item
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_invoice_item
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_invoice_record
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_shopping_cart
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_shopping_cart_item
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "plus_sku must declare foreign key "
                "fk_plus_sku_product on product_id references plus_product(id)",
                result.messages,
            )
            self.assertIn(
                "plus_order_item must declare foreign key "
                "fk_plus_order_item_order on order_id references plus_order(id)",
                result.messages,
            )
            self.assertIn(
                "plus_invoice_item must declare foreign key "
                "fk_plus_invoice_item_invoice on invoice_id references plus_invoice(id)",
                result.messages,
            )
            self.assertIn(
                "plus_shopping_cart_item must declare foreign key "
                "fk_plus_shopping_cart_item_sku on sku_id references plus_sku(id)",
                result.messages,
            )

    def test_requires_vip_graph_foreign_keys_in_registry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_vip_level_benefit
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_vip_pack
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_vip_recharge
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    foreign_keys:
                      - { name: fk_plus_vip_recharge_user, columns: [user_id], references_table: plus_user, references_columns: [id] }
                      - { name: fk_plus_vip_recharge_method, columns: [recharge_method_id], references_table: plus_vip_recharge_method, references_columns: [id] }
                    indexes:
                      - { name: idx_plus_vip_recharge_user, columns: [user_id] }
                      - { name: idx_plus_vip_recharge_level, columns: [vip_level_id] }
                      - { name: idx_plus_vip_recharge_status, columns: [status] }
                      - { name: idx_plus_vip_recharge_time, columns: [recharge_time] }
                      - { name: idx_plus_vip_recharge_transaction, columns: [transaction_no] }
                  - table: plus_vip_user
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_vip_benefit_usage
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "plus_vip_level_benefit must declare foreign key "
                "fk_plus_vip_level_benefit_level on vip_level_id references plus_vip_level(id)",
                result.messages,
            )
            self.assertIn(
                "plus_vip_pack must declare foreign key "
                "fk_plus_vip_pack_recharge_pack on recharge_pack_id references plus_vip_recharge_pack(id)",
                result.messages,
            )
            self.assertIn(
                "plus_vip_recharge must declare foreign key "
                "fk_plus_vip_recharge_pack on recharge_pack_id references plus_vip_recharge_pack(id)",
                result.messages,
            )
            self.assertIn(
                "plus_vip_user must declare foreign key "
                "fk_plus_vip_user_level on vip_level_id references plus_vip_level(id)",
                result.messages,
            )

    def test_requires_trade_graph_production_indexes_in_registry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_product
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_sku
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_order_item
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_order_dispatch_rule
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_invoice
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                  - table: plus_invoice_item
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_invoice_record
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_shopping_cart
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_shopping_cart_item
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_order_worker_dispatch_profile
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "plus_product must declare unique index uk_plus_product_code on code",
                result.messages,
            )
            self.assertIn(
                "plus_sku must declare unique index uk_plus_sku_sku_code on sku_code",
                result.messages,
            )
            self.assertIn(
                "plus_shopping_cart_item must declare unique index "
                "uk_plus_shopping_cart_item_cart_sku on cart_id, sku_id",
                result.messages,
            )
            self.assertIn(
                "plus_invoice must declare index idx_invoice_created on created_at",
                result.messages,
            )
            self.assertIn(
                "plus_order_dispatch_rule must declare unique index "
                "uk_order_dispatch_rule_task_code on task_code",
                result.messages,
            )
            self.assertIn(
                "plus_order_worker_dispatch_profile must declare unique index "
                "uk_order_worker_dispatch_profile_user_id on user_id",
                result.messages,
            )

    def test_requires_vip_graph_production_indexes_in_registry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_vip_level
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_vip_benefit
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_vip_level_benefit
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_vip_pack_group
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_vip_recharge_pack
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                  - table: plus_vip_pack
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_vip_user
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: plus_vip_benefit_usage
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "plus_vip_level must declare unique index uk_plus_vip_level_name on name",
                result.messages,
            )
            self.assertIn(
                "plus_vip_benefit must declare unique index uk_plus_vip_benefit_key on benefit_key",
                result.messages,
            )
            self.assertIn(
                "plus_vip_level_benefit must declare unique index "
                "uk_plus_vip_level_benefit_pair on vip_level_id, benefit_id",
                result.messages,
            )
            self.assertIn(
                "plus_vip_pack_group must declare unique index "
                "uk_plus_vip_pack_group_scope_key on scope_type, scope_id, group_key",
                result.messages,
            )
            self.assertIn(
                "plus_vip_pack must declare unique index "
                "uk_plus_vip_pack_group_level_cycle on group_id, vip_level_id, billing_cycle",
                result.messages,
            )
            self.assertIn(
                "plus_vip_user must declare unique index uk_plus_vip_user_user_id on user_id",
                result.messages,
            )
            self.assertIn(
                "plus_vip_benefit_usage must declare index idx_plus_vip_benefit_usage_time on usage_time",
                result.messages,
            )

    def test_requires_postgres_specific_legacy_index_methods_in_registry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_product
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    indexes:
                      - { name: uk_plus_product_code, unique: true, columns: [code] }
                      - { name: idx_plus_product_user_id, columns: [user_id] }
                      - { name: idx_plus_product_category_id, columns: [category_id] }
                      - { name: idx_plus_product_status, columns: [status] }
                      - { name: idx_plus_product_tenant_org_status, columns: [tenant_id, organization_id, status] }
                      - { name: idx_plus_product_category_status, columns: [category_id, status, created_at] }
                      - { name: gin_plus_product_tags, columns: [tags] }
                      - { name: gin_plus_product_resources, columns: [resources], method: btree }
                  - table: plus_shop
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    indexes:
                      - { name: idx_plus_shop_user_id, columns: [user_id] }
                      - { name: idx_plus_shop_status, columns: [status] }
                      - { name: idx_plus_shop_tenant_org_status, columns: [tenant_id, organization_id, status] }
                      - { name: gist_plus_shop_location, columns: [location] }
                      - { name: gin_plus_shop_tags, columns: [tags], method: btree }
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "plus_product must declare index gin_plus_product_tags using gin on tags",
                result.messages,
            )
            self.assertIn(
                "plus_product must declare index gin_plus_product_resources using gin on resources",
                result.messages,
            )
            self.assertIn(
                "plus_shop must declare index gist_plus_shop_location using gist on location",
                result.messages,
            )
            self.assertIn(
                "plus_shop must declare index gin_plus_shop_tags using gin on tags",
                result.messages,
            )

    def test_rejects_skills_hub_studio_skill_tables(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: studio_skill_listing
                    domain: studio
                    frontend_routes: [/skills-hub]
                  - table: plus_agent_skill
                    domain: legacy
                    frontend_routes: [/skills-hub]
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("obsolete SkillsHub table remains: studio_skill_listing", result.messages)
            self.assertIn("/skills-hub still uses obsolete SkillsHub table: studio_skill_listing", result.messages)

    def test_accepts_valid_minimal_registry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for entity in [
                "com/sdkwork/spring/ai/plus/entity/trade/PlusOrder.java",
                "com/sdkwork/spring/ai/plus/entity/trade/PlusPayment.java",
            ]:
                self.write_java_entity(root, entity)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: [commerce_order, commerce_payment]
                legacy_java_contracts:
                  finance_and_trade:
                    order:
                      tables: [plus_order]
                      entities:
                        plus_order: com.sdkwork.spring.ai.plus.entity.trade.PlusOrder
                    payment:
                      tables: [plus_payment]
                      entities:
                        plus_payment: com.sdkwork.spring.ai.plus.entity.trade.PlusPayment
                tables:
                  - table: plus_order
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    not_null_columns: [subject, order_type, owner_id, user_id, order_sn, out_trade_no, total_amount, paid_amount, status, category_id]
                    foreign_keys:
                      - { name: fk_plus_order_user, columns: [user_id], references_table: plus_user, references_columns: [id] }
                      - { name: fk_plus_order_worker_user, columns: [worker_user_id], references_table: plus_user, references_columns: [id] }
                      - { name: fk_plus_order_dispatcher_user, columns: [dispatcher_user_id], references_table: plus_user, references_columns: [id] }
                    indexes:
                      - { name: uk_plus_order_order_sn, unique: true, columns: [order_sn] }
                      - { name: uk_plus_order_out_trade_no, unique: true, columns: [out_trade_no] }
                      - { name: idx_plus_order_user_id, columns: [user_id] }
                      - { name: idx_plus_order_status, columns: [status] }
                      - { name: idx_plus_order_status_payment_expire, columns: [status, payment_expire_time] }
                      - { name: idx_plus_order_task_code, columns: [task_code] }
                      - { name: idx_plus_order_worker_user_id, columns: [worker_user_id] }
                      - { name: idx_plus_order_tenant_org_status, columns: [tenant_id, organization_id, status] }
                  - table: plus_payment
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                    unique_constraints:
                      - { columns: [uuid] }
                    not_null_columns: [purpose, order_id, out_trade_no, channel, provider, status, amount]
                    foreign_keys:
                      - { name: fk_plus_payment_order, columns: [order_id], references_table: plus_order, references_columns: [id] }
                    indexes:
                      - { name: uk_plus_payment_out_trade_no, unique: true, columns: [out_trade_no] }
                      - { name: idx_plus_payment_status_expire, columns: [status, expire_time] }
                      - { name: idx_plus_payment_order_status, columns: [order_id, status] }
                      - { name: idx_plus_payment_provider_status, columns: [provider, status] }
                  - table: plus_agent_skill
                    domain: legacy
                    frontend_routes: [/skills-hub, /skills-hub/:id]
                    api_surfaces: [app, backend]
                  - table: plus_category
                    domain: legacy
                    frontend_routes: [/skills-hub, /skills-hub/:id]
                    api_surfaces: [app, backend]
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertTrue(result.ok, result.messages)

    def test_requires_domain_name_type_bindings_and_persistence_tables(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                domain_names:
                  model_vendor:
                    canonical_name: ModelVendor
                    persistence:
                      table: ai_model_vendor
                    type_bindings:
                      java: com.sdkwork.claw.router.domain.enums.ModelVendor
                      typescript: ModelVendor
                      openapi: ModelVendor
                    builtin_values:
                      - { code: openai }
                tables: []
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("model_vendor persistence table must be registered: ai_model_vendor", result.messages)
            self.assertIn("model_vendor type_bindings.rust is required", result.messages)
            self.assertIn("model_vendor builtin_values must include unknown", result.messages)

    def test_requires_pricing_plan_and_api_key_group_bindings(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: ai_pricing_group
                    domain: ai
                    columns: {}
                  - table: iam_gateway_api_key
                    domain: iam
                    columns: {}
                  - table: iam_gateway_api_key_group
                    domain: iam
                    columns: {}
                  - table: ai_pricing_plan_binding
                    domain: ai
                    columns: {}
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("forbidden pricing table present: ai_pricing_group", result.messages)
            self.assertIn("iam_gateway_api_key must include column group_id", result.messages)
            self.assertIn("iam_gateway_api_key_group must include column pricing_plan_id", result.messages)
            self.assertIn("ai_pricing_plan_binding must include column subject_type", result.messages)

    def test_requires_multi_modal_billing_and_pricing_columns(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                domain_names:
                  billing_mode:
                    canonical_name: BillingMode
                    builtin_values:
                      - { code: token }
                  billing_meter:
                    canonical_name: BillingMeter
                    persistence:
                      table: ai_billing_meter
                    type_bindings:
                      java: com.sdkwork.claw.router.domain.enums.BillingMeter
                      rust: sdkwork_claw_router::domain::BillingMeter
                      typescript: BillingMeter
                      openapi: BillingMeter
                    builtin_values:
                      - { code: llm_input_token }
                tables:
                  - table: ai_billing_meter
                    domain: ai
                    columns: {}
                  - table: ai_model_pricing
                    domain: ai
                    columns:
                      model: string(128)
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("billing_mode builtin_values must include per_result", result.messages)
            self.assertIn("billing_meter builtin_values must include api_result", result.messages)
            self.assertIn("billing_meter builtin_values must include unknown", result.messages)
            self.assertIn("ai_model_pricing must include column price_side", result.messages)
            self.assertIn("ai_model_pricing must include column reference_multiplier", result.messages)

    def test_requires_frontend_routes_to_match_api_surfaces(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: ops_gateway_instance
                    domain: ops
                    write_owner: ops-service
                    frontend_routes: [/admin/monitor, /console/gateway]
                    api_surfaces: [backend]
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("/console/gateway on ops_gateway_instance requires app api_surface", result.messages)

    def test_rejects_forbidden_new_table_prefixes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  naming_guardrails:
                    forbidden_new_prefixes: [router]
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: router_usage_event
                    domain: ai
                    write_owner: ai-service
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("forbidden new table prefix present: router_usage_event", result.messages)

    def test_requires_java_api_prefixes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  api_prefixes:
                    app: /app/api
                    backend: /backend/api
                    openai_compatible: /openai
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables: []
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("api_prefixes.app must be /app/v3/api", result.messages)
            self.assertIn("api_prefixes.backend must be /backend/v3/api", result.messages)
            self.assertIn("api_prefixes.openai_compatible must be /v1", result.messages)

    def test_requires_projection_tables_to_declare_registered_sources(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: ai_usage_fact
                    domain: ai
                  - table: ops_metric_snapshot
                    domain: ops
                    profile: projection
                    source_tables: [ai_usage_fact, missing_fact]
                  - table: ops_referral_stat_snapshot
                    domain: ops
                    common_columns: projection
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn("ops_metric_snapshot source_tables references unregistered table missing_fact", result.messages)
            self.assertIn("ops_referral_stat_snapshot projection table must declare source_tables or source_refs", result.messages)

    def test_requires_projection_over_legacy_tables_to_declare_non_replacement_policy(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            registry = self.write_registry(
                root,
                """
                schema_registry:
                  legacy_compatibility_guardrails:
                    forbidden_synonym_tables: []
                tables:
                  - table: plus_order
                    domain: legacy
                    compliance_level: L0
                    write_owner: spring-ai-plus-business-entity
                    generated_by_this_project: false
                    compatibility_rule: keep_physical_structure_identical
                  - table: commerce_order_stat_snapshot
                    domain: commerce
                    profile: projection
                    source_tables: [plus_order]
                """,
            )

            result = SchemaGuardian(root=root, registry_path=registry).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "commerce_order_stat_snapshot projection over legacy table plus_order must declare projection_policy.does_not_replace",
                result.messages,
            )


if __name__ == "__main__":
    unittest.main()
