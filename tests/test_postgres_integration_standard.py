import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class PostgresIntegrationStandardTest(unittest.TestCase):
    def test_product_postgres_transaction_integration_tests_are_env_gated_and_isolated(self) -> None:
        test_path = (
            ROOT
            / "services"
            / "sdkwork-claw-product"
            / "tests"
            / "postgres_transaction_integration.rs"
        )
        self.assertTrue(test_path.exists())
        source = test_path.read_text(encoding="utf-8")

        self.assertIn("SDKWORK_CLAW_POSTGRES_TEST_DATABASE_URL", source)
        self.assertIn("CREATE SCHEMA", source)
        self.assertIn("SET search_path", source)
        self.assertIn("DROP SCHEMA IF EXISTS", source)
        self.assertIn("max_connections(4)", source)
        self.assertIn(
            "postgres_payment_callback_concurrent_first_account_creation_credits_one_account",
            source,
        )
        self.assertIn(
            "postgres_billing_redeem_concurrent_first_account_creation_credits_one_account",
            source,
        )
        self.assertIn(
            "postgres_playground_history_loads_visible_statuses_without_sensitive_fields",
            source,
        )
        self.assertIn(
            "postgres_playground_history_orders_newest_first_and_limits_to_100",
            source,
        )
        self.assertIn("PostgresPaymentCallbackStore", source)
        self.assertIn("PostgresBillingStore", source)
        self.assertIn("PostgresAppPlaygroundHistoryReadStore", source)
        self.assertIn("AppPlaygroundHistorySubject", source)
        self.assertIn("tokio::join!", source)
        self.assertIn("uk_plus_account_user_type", source)


if __name__ == "__main__":
    unittest.main()
