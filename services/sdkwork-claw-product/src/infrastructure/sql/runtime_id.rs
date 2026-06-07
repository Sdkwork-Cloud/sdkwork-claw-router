use std::sync::OnceLock;

use sdkwork_id::SnowflakeIdGenerator;

use crate::domain::{DomainError, DomainResult};

const ADMIN_APP_NODE_ID: u16 = 21;
const ADMIN_SKILL_NODE_ID: u16 = 22;
const DEFAULT_CLAW_RUNTIME_NODE_ID: u16 = 23;
const CLAW_RUNTIME_NODE_ID_ENV: &str = "SDKWORK_CLAW_SNOWFLAKE_NODE_ID";

static ADMIN_APP_ID_GENERATOR: OnceLock<SnowflakeIdGenerator> = OnceLock::new();
static ADMIN_SKILL_ID_GENERATOR: OnceLock<SnowflakeIdGenerator> = OnceLock::new();
static CLAW_RUNTIME_ID_GENERATOR: OnceLock<Result<SnowflakeIdGenerator, String>> =
    OnceLock::new();

pub(crate) fn next_admin_app_id(context: &str) -> DomainResult<i64> {
    next_runtime_id(admin_app_id_generator(), context)
}

pub(crate) fn next_admin_skill_id(context: &str) -> DomainResult<i64> {
    next_runtime_id(admin_skill_id_generator(), context)
}

pub(crate) fn next_claw_runtime_id(context: &str) -> DomainResult<i64> {
    let generator = claw_runtime_id_generator()?;
    next_runtime_id(generator, context)
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

fn claw_runtime_id_generator() -> DomainResult<&'static SnowflakeIdGenerator> {
    match CLAW_RUNTIME_ID_GENERATOR.get_or_init(build_claw_runtime_id_generator) {
        Ok(generator) => Ok(generator),
        Err(message) => Err(DomainError::new(message.clone())),
    }
}

fn build_claw_runtime_id_generator() -> Result<SnowflakeIdGenerator, String> {
    let node_id = match std::env::var(CLAW_RUNTIME_NODE_ID_ENV) {
        Ok(value) if !value.trim().is_empty() => value.trim().parse::<u16>().map_err(|_| {
            format!("{CLAW_RUNTIME_NODE_ID_ENV} must be an integer between 0 and 1023")
        })?,
        Ok(_) => {
            return Err(format!(
                "{CLAW_RUNTIME_NODE_ID_ENV} must be an integer between 0 and 1023"
            ));
        }
        Err(_) => DEFAULT_CLAW_RUNTIME_NODE_ID,
    };

    SnowflakeIdGenerator::new(node_id).map_err(|error| {
        format!("{CLAW_RUNTIME_NODE_ID_ENV} is invalid for Claw runtime IDs: {error:?}")
    })
}

fn next_runtime_id(generator: &SnowflakeIdGenerator, context: &str) -> DomainResult<i64> {
    generator
        .generate()
        .map_err(|error| DomainError::new(format!("failed to generate {context} id: {error:?}")))
}
