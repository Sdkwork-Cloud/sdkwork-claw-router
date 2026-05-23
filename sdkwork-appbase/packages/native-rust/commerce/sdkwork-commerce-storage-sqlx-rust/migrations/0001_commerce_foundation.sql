CREATE TABLE IF NOT EXISTS commerce_idempotency_key (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  scope TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  response_json TEXT,
  status TEXT NOT NULL,
  locked_until TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, scope, idempotency_key)
);

CREATE TABLE IF NOT EXISTS commerce_account (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  currency_code TEXT,
  available_amount TEXT NOT NULL DEFAULT '0',
  frozen_amount TEXT NOT NULL DEFAULT '0',
  version INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, owner_user_id, asset_type, currency_code)
);

CREATE TABLE IF NOT EXISTS commerce_account_ledger_entry (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  account_id TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  direction TEXT NOT NULL,
  amount TEXT NOT NULL,
  balance_after TEXT NOT NULL,
  business_type TEXT NOT NULL,
  transaction_no TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  source_type TEXT,
  source_id TEXT,
  remark TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, transaction_no)
);

CREATE TABLE IF NOT EXISTS commerce_billing_prehold (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  prehold_no TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  amount TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  settled_at TEXT,
  released_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, prehold_no)
);

CREATE TABLE IF NOT EXISTS commerce_coupon_template (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  template_no TEXT NOT NULL,
  title TEXT NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value TEXT NOT NULL,
  minimum_amount TEXT NOT NULL DEFAULT '0',
  total_quantity INTEGER,
  claimed_quantity INTEGER NOT NULL DEFAULT 0,
  redeemed_quantity INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  starts_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, template_no)
);

CREATE TABLE IF NOT EXISTS commerce_coupon_issue_batch (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  coupon_template_id TEXT NOT NULL,
  batch_no TEXT NOT NULL,
  campaign_code TEXT,
  title TEXT NOT NULL,
  code_prefix TEXT NOT NULL,
  code_pattern TEXT NOT NULL,
  requested_quantity INTEGER NOT NULL,
  generated_quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  claimed_quantity INTEGER NOT NULL DEFAULT 0,
  redeemed_quantity INTEGER NOT NULL DEFAULT 0,
  disabled_quantity INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  generation_status TEXT NOT NULL,
  audience_filter TEXT,
  generated_at TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, batch_no)
);

CREATE TABLE IF NOT EXISTS commerce_coupon (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  template_id TEXT NOT NULL,
  issue_batch_id TEXT,
  owner_user_id TEXT,
  coupon_code TEXT NOT NULL,
  status TEXT NOT NULL,
  claimed_at TEXT,
  expires_at TEXT,
  redeemed_at TEXT,
  disabled_at TEXT,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, coupon_code)
);

CREATE TABLE IF NOT EXISTS commerce_coupon_redemption (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  coupon_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  discount_amount TEXT NOT NULL,
  status TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  redeemed_at TEXT NOT NULL,
  rolled_back_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, coupon_id, order_id)
);

CREATE TABLE IF NOT EXISTS commerce_product_category (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  category_no TEXT NOT NULL,
  parent_category_id TEXT,
  name TEXT NOT NULL,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, category_no)
);

CREATE TABLE IF NOT EXISTS commerce_product_attribute (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  attribute_no TEXT NOT NULL,
  name TEXT NOT NULL,
  value_type TEXT NOT NULL,
  status TEXT NOT NULL,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, attribute_no)
);

CREATE TABLE IF NOT EXISTS commerce_product_attribute_value (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  attribute_id TEXT NOT NULL,
  value_no TEXT NOT NULL,
  display_value TEXT NOT NULL,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, attribute_id, value_no)
);

CREATE TABLE IF NOT EXISTS commerce_product_spu (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  spu_no TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  product_type TEXT NOT NULL,
  category_id TEXT,
  sales_status TEXT NOT NULL,
  visible_surfaces TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, spu_no)
);

CREATE TABLE IF NOT EXISTS commerce_product_sku (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  spu_id TEXT NOT NULL,
  sku_no TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  price_amount TEXT NOT NULL,
  original_price_amount TEXT,
  currency_code TEXT NOT NULL,
  delivery_mode TEXT NOT NULL,
  inventory_tracking TEXT NOT NULL,
  sales_status TEXT NOT NULL,
  spec_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, sku_no)
);

CREATE TABLE IF NOT EXISTS commerce_product_sku_attribute_value (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  attribute_id TEXT NOT NULL,
  attribute_value_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, sku_id, attribute_id)
);

CREATE TABLE IF NOT EXISTS commerce_recharge_package (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  external_id INTEGER NOT NULL,
  package_no TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price_amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  bonus_points INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  valid_from TEXT,
  valid_to TEXT,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, external_id),
  UNIQUE (tenant_id, package_no)
);

CREATE TABLE IF NOT EXISTS commerce_inventory_stock (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  sku_id TEXT NOT NULL,
  warehouse_id TEXT,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  sold_quantity INTEGER NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, sku_id, warehouse_id)
);

CREATE TABLE IF NOT EXISTS commerce_inventory_reservation (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  reservation_no TEXT NOT NULL,
  order_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  warehouse_id TEXT,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  released_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, reservation_no)
);

CREATE TABLE IF NOT EXISTS commerce_inventory_movement (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  movement_no TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  warehouse_id TEXT,
  movement_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  business_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, movement_no)
);

CREATE TABLE IF NOT EXISTS commerce_cart (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, owner_user_id, status)
);

CREATE TABLE IF NOT EXISTS commerce_cart_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  cart_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  selected INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, cart_id, sku_id)
);

CREATE TABLE IF NOT EXISTS commerce_user_address (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  receiver_phone TEXT NOT NULL,
  country_code TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  detail_address TEXT NOT NULL,
  postal_code TEXT,
  is_default INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_order (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  order_no TEXT NOT NULL,
  status TEXT NOT NULL,
  subject TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  paid_at TEXT,
  cancelled_at TEXT,
  expired_at TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, order_no)
);

CREATE TABLE IF NOT EXISTS commerce_order_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  sku_id TEXT NOT NULL,
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_amount TEXT NOT NULL,
  total_amount TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_order_amount_breakdown (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  original_amount TEXT NOT NULL,
  discount_amount TEXT NOT NULL,
  payable_amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, order_id)
);

CREATE TABLE IF NOT EXISTS commerce_payment_intent (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  status TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_payment_attempt (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  payment_intent_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  out_trade_no TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  status TEXT NOT NULL,
  callback_payload TEXT,
  created_at TEXT NOT NULL,
  paid_at TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, provider, out_trade_no)
);

CREATE TABLE IF NOT EXISTS commerce_payment_webhook_event (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  nonce TEXT NOT NULL,
  signature TEXT,
  request_timestamp INTEGER,
  out_trade_no TEXT NOT NULL,
  transaction_id TEXT,
  payload_digest TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  processed_at TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, provider, event_id),
  UNIQUE (tenant_id, provider, nonce)
);

CREATE TABLE IF NOT EXISTS commerce_payment_method (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  method_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, method_key)
);

CREATE TABLE IF NOT EXISTS commerce_refund (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  payment_attempt_id TEXT NOT NULL,
  refund_no TEXT NOT NULL,
  amount TEXT NOT NULL,
  status TEXT NOT NULL,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, refund_no)
);

CREATE TABLE IF NOT EXISTS commerce_exchange_rule (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  rule_no TEXT NOT NULL,
  source_asset_type TEXT NOT NULL,
  target_asset_type TEXT NOT NULL,
  rate TEXT NOT NULL,
  status TEXT NOT NULL,
  remark TEXT,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, source_asset_type, target_asset_type)
);

CREATE TABLE IF NOT EXISTS commerce_membership_plan (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  plan_no TEXT NOT NULL,
  name TEXT NOT NULL,
  plan_code TEXT NOT NULL,
  rank INTEGER NOT NULL DEFAULT 0,
  duration_days INTEGER NOT NULL DEFAULT 0,
  benefits_json TEXT NOT NULL,
  visible_surfaces TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, plan_no)
);

CREATE TABLE IF NOT EXISTS commerce_membership_package_group (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  external_id INTEGER NOT NULL,
  group_no TEXT NOT NULL,
  plan_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  billing_cycle TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, external_id),
  UNIQUE (tenant_id, group_no)
);

CREATE TABLE IF NOT EXISTS commerce_membership_package (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  external_id INTEGER NOT NULL,
  package_no TEXT NOT NULL,
  package_group_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  sku_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  price_amount TEXT NOT NULL,
  original_price_amount TEXT,
  currency_code TEXT NOT NULL,
  point_amount INTEGER NOT NULL DEFAULT 0,
  duration_days INTEGER NOT NULL,
  recurrence_cycle TEXT NOT NULL,
  sort_weight INTEGER NOT NULL DEFAULT 0,
  recommended INTEGER NOT NULL DEFAULT 0,
  tags_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL,
  starts_at TEXT,
  ends_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, organization_id, external_id),
  UNIQUE (tenant_id, package_no)
);

CREATE TABLE IF NOT EXISTS commerce_membership (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  membership_no TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  source_order_id TEXT NOT NULL,
  source_payment_intent_id TEXT NOT NULL,
  status TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  grace_until TEXT,
  request_no TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, membership_no),
  UNIQUE (tenant_id, source_order_id, source_payment_intent_id)
);

CREATE TABLE IF NOT EXISTS commerce_membership_entitlement (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  membership_id TEXT NOT NULL,
  entitlement_code TEXT NOT NULL,
  plan_id TEXT,
  name TEXT NOT NULL DEFAULT '',
  quota_amount TEXT NOT NULL DEFAULT '0',
  quota_period TEXT,
  reset_policy TEXT,
  granted_quantity INTEGER NOT NULL,
  used_quantity INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (tenant_id, membership_id, entitlement_code)
);

CREATE TABLE IF NOT EXISTS commerce_membership_entitlement_usage (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  membership_id TEXT NOT NULL,
  entitlement_id TEXT NOT NULL,
  owner_user_id TEXT,
  entitlement_code TEXT NOT NULL,
  usage_no TEXT NOT NULL,
  used_amount TEXT NOT NULL,
  balance_after TEXT,
  idempotency_key TEXT NOT NULL,
  source_type TEXT,
  source_id TEXT,
  occurred_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (tenant_id, usage_no)
);

CREATE TABLE IF NOT EXISTS commerce_invoice_title (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  title_type TEXT NOT NULL,
  name TEXT NOT NULL,
  tax_no TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_invoice (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  organization_id TEXT,
  owner_user_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  payment_id TEXT NOT NULL,
  title_id TEXT NOT NULL,
  status TEXT NOT NULL,
  invoice_no TEXT,
  invoice_code TEXT,
  document_url TEXT,
  created_at TEXT NOT NULL,
  issued_at TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS commerce_invoice_item (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  order_item_id TEXT,
  title TEXT NOT NULL,
  amount TEXT NOT NULL,
  tax_amount TEXT NOT NULL DEFAULT '0',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_commerce_idempotency_key_tenant_key
  ON commerce_idempotency_key (tenant_id, scope, idempotency_key);

CREATE INDEX IF NOT EXISTS idx_commerce_account_owner_asset
  ON commerce_account (tenant_id, owner_user_id, asset_type, currency_code);

CREATE INDEX IF NOT EXISTS idx_commerce_account_ledger_account_created_at
  ON commerce_account_ledger_entry (tenant_id, account_id, created_at);

CREATE INDEX IF NOT EXISTS idx_commerce_account_ledger_request_no
  ON commerce_account_ledger_entry (tenant_id, request_no);

CREATE INDEX IF NOT EXISTS idx_commerce_account_ledger_idempotency_key
  ON commerce_account_ledger_entry (tenant_id, idempotency_key);

CREATE INDEX IF NOT EXISTS idx_commerce_billing_prehold_request_no
  ON commerce_billing_prehold (tenant_id, request_no);

CREATE INDEX IF NOT EXISTS idx_commerce_billing_prehold_status_expires_at
  ON commerce_billing_prehold (tenant_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_commerce_coupon_owner_status_expires_at
  ON commerce_coupon (tenant_id, owner_user_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_commerce_coupon_template_status
  ON commerce_coupon_template (tenant_id, status, starts_at, expires_at);

CREATE INDEX IF NOT EXISTS idx_commerce_coupon_issue_batch_status
  ON commerce_coupon_issue_batch (tenant_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_commerce_coupon_redemption_order
  ON commerce_coupon_redemption (tenant_id, order_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_category_parent_status
  ON commerce_product_category (tenant_id, organization_id, parent_category_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_attribute_status
  ON commerce_product_attribute (tenant_id, organization_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_spu_category_status
  ON commerce_product_spu (tenant_id, organization_id, category_id, sales_status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_spu_type_status
  ON commerce_product_spu (tenant_id, organization_id, product_type, sales_status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_sku_spu_status
  ON commerce_product_sku (tenant_id, spu_id, sales_status);

CREATE INDEX IF NOT EXISTS idx_commerce_product_sku_price_status
  ON commerce_product_sku (tenant_id, organization_id, price_amount, currency_code, sales_status);

CREATE INDEX IF NOT EXISTS idx_commerce_recharge_package_amount_status
  ON commerce_recharge_package (tenant_id, organization_id, price_amount, currency_code, status);

CREATE INDEX IF NOT EXISTS idx_commerce_inventory_stock_sku_warehouse
  ON commerce_inventory_stock (tenant_id, sku_id, warehouse_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_inventory_reservation_order_status
  ON commerce_inventory_reservation (tenant_id, order_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_inventory_reservation_expires_at
  ON commerce_inventory_reservation (tenant_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_commerce_inventory_movement_source
  ON commerce_inventory_movement (tenant_id, source_id, business_type);

CREATE INDEX IF NOT EXISTS idx_commerce_cart_owner_status
  ON commerce_cart (tenant_id, owner_user_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_cart_item_cart_sku
  ON commerce_cart_item (tenant_id, cart_id, sku_id);

CREATE INDEX IF NOT EXISTS idx_commerce_user_address_owner_default
  ON commerce_user_address (tenant_id, owner_user_id, is_default, status);

CREATE INDEX IF NOT EXISTS idx_commerce_order_owner_status_created_at
  ON commerce_order (tenant_id, owner_user_id, status, created_at);

CREATE INDEX IF NOT EXISTS idx_commerce_order_no
  ON commerce_order (tenant_id, order_no);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_intent_order
  ON commerce_payment_intent (tenant_id, order_id);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_attempt_provider_trade_no
  ON commerce_payment_attempt (tenant_id, provider, out_trade_no);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_webhook_event_provider_event
  ON commerce_payment_webhook_event (tenant_id, provider, event_id);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_webhook_event_provider_nonce
  ON commerce_payment_webhook_event (tenant_id, provider, nonce);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_webhook_event_status_processed_at
  ON commerce_payment_webhook_event (tenant_id, status, processed_at);

CREATE INDEX IF NOT EXISTS idx_commerce_payment_method_status
  ON commerce_payment_method (tenant_id, organization_id, status, sort_weight);

CREATE INDEX IF NOT EXISTS idx_commerce_refund_payment
  ON commerce_refund (tenant_id, payment_attempt_id);

CREATE INDEX IF NOT EXISTS idx_commerce_exchange_rule_pair_status
  ON commerce_exchange_rule (tenant_id, organization_id, source_asset_type, target_asset_type, status);

CREATE INDEX IF NOT EXISTS idx_commerce_membership_plan_status
  ON commerce_membership_plan (tenant_id, organization_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_membership_package_group_status
  ON commerce_membership_package_group (tenant_id, organization_id, status, sort_weight);

CREATE INDEX IF NOT EXISTS idx_commerce_membership_package_group_cycle
  ON commerce_membership_package_group (tenant_id, organization_id, billing_cycle, status);

CREATE INDEX IF NOT EXISTS idx_commerce_membership_package_status
  ON commerce_membership_package (tenant_id, organization_id, status, sort_weight);

CREATE INDEX IF NOT EXISTS idx_commerce_membership_package_group_plan
  ON commerce_membership_package (tenant_id, package_group_id, plan_id, status);

CREATE INDEX IF NOT EXISTS idx_commerce_membership_package_external_id
  ON commerce_membership_package (tenant_id, organization_id, external_id);

CREATE INDEX IF NOT EXISTS idx_commerce_membership_package_recommended
  ON commerce_membership_package (tenant_id, organization_id, recommended, status, sort_weight);

CREATE INDEX IF NOT EXISTS idx_commerce_membership_owner_status
  ON commerce_membership (tenant_id, owner_user_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_commerce_membership_order_payment
  ON commerce_membership (tenant_id, source_order_id, source_payment_intent_id);

CREATE INDEX IF NOT EXISTS idx_commerce_membership_entitlement_membership
  ON commerce_membership_entitlement (tenant_id, membership_id, entitlement_code);

CREATE INDEX IF NOT EXISTS idx_commerce_membership_entitlement_usage_usage_no
  ON commerce_membership_entitlement_usage (tenant_id, usage_no);

CREATE INDEX IF NOT EXISTS idx_commerce_invoice_order_payment
  ON commerce_invoice (tenant_id, order_id, payment_id);

CREATE INDEX IF NOT EXISTS idx_commerce_invoice_owner_status
  ON commerce_invoice (tenant_id, owner_user_id, status);
