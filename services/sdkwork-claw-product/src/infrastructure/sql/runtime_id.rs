use std::sync::OnceLock;

use sdkwork_id::SnowflakeIdGenerator;

use crate::domain::{DomainError, DomainResult};

const ADMIN_APP_NODE_ID: u16 = 21;
const ADMIN_SKILL_NODE_ID: u16 = 22;

static ADMIN_APP_ID_GENERATOR: OnceLock<SnowflakeIdGenerator> = OnceLock::new();
static ADMIN_SKILL_ID_GENERATOR: OnceLock<SnowflakeIdGenerator> = OnceLock::new();

pub(crate) fn next_admin_app_id(context: &str) -> DomainResult<i64> {
    next_runtime_id(admin_app_id_generator(), context)
}

pub(crate) fn next_admin_skill_id(context: &str) -> DomainResult<i64> {
    next_runtime_id(admin_skill_id_generator(), context)
}

fn admin_app_id_generator() -> &'static SnowflakeIdGenerator {
    ADMIN_APP_ID_GENERATOR.get_or_init(|| {
        SnowflakeIdGenerator::new(ADMIN_APP_NODE_ID)
            .expect("admin app snowflake node id must be valid")
    })
}

fn admin_skill_id_generator() -> &'static SnowflakeIdGenerator {
    ADMIN_SKILL_ID_GENERATOR.get_or_init(|| {
        SnowflakeIdGenerator::new(ADMIN_SKILL_NODE_ID)
            .expect("admin skill snowflake node id must be valid")
    })
}

fn next_runtime_id(generator: &SnowflakeIdGenerator, context: &str) -> DomainResult<i64> {
    generator
        .generate()
        .map_err(|error| DomainError::new(format!("failed to generate {context} id: {error:?}")))
}
