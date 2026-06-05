use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};

const DEFAULT_EPOCH_MILLIS: u64 = 1_704_067_200_000;
const TIMESTAMP_BITS: u8 = 41;
const NODE_BITS: u8 = 10;
const SEQUENCE_BITS: u8 = 12;
const MAX_NODE_ID: u16 = (1 << NODE_BITS) - 1;
const MAX_SEQUENCE: u16 = (1 << SEQUENCE_BITS) - 1;
const NODE_SHIFT: u8 = SEQUENCE_BITS;
const TIMESTAMP_SHIFT: u8 = NODE_BITS + SEQUENCE_BITS;
const MAX_TIMESTAMP_DELTA: u64 = (1_u64 << TIMESTAMP_BITS) - 1;

#[derive(Debug, Clone, Eq, PartialEq)]
pub enum SnowflakeIdError {
    InvalidNodeId {
        node_id: u16,
        max_node_id: u16,
    },
    ClockBeforeEpoch {
        now_millis: u64,
        epoch_millis: u64,
    },
    ClockMovedBackwards {
        last_millis: u64,
        now_millis: u64,
    },
    TimestampOverflow {
        delta_millis: u64,
        max_delta_millis: u64,
    },
    SequenceExhausted {
        millis: u64,
    },
    SystemTime(String),
    StatePoisoned,
}

#[derive(Debug, Clone)]
pub struct SnowflakeIdGenerator {
    node_id: u16,
    epoch_millis: u64,
    state: Arc<Mutex<SnowflakeState>>,
}

#[derive(Debug, Clone, Copy)]
struct SnowflakeState {
    last_millis: u64,
    sequence: u16,
}

impl SnowflakeIdGenerator {
    pub fn new(node_id: u16) -> Result<Self, SnowflakeIdError> {
        Self::with_epoch(node_id, DEFAULT_EPOCH_MILLIS)
    }

    pub fn with_epoch(node_id: u16, epoch_millis: u64) -> Result<Self, SnowflakeIdError> {
        if node_id > MAX_NODE_ID {
            return Err(SnowflakeIdError::InvalidNodeId {
                node_id,
                max_node_id: MAX_NODE_ID,
            });
        }

        Ok(Self {
            node_id,
            epoch_millis,
            state: Arc::new(Mutex::new(SnowflakeState {
                last_millis: 0,
                sequence: 0,
            })),
        })
    }

    pub fn generate(&self) -> Result<i64, SnowflakeIdError> {
        self.generate_at(current_time_millis()?)
    }

    pub fn generate_at(&self, now_millis: u64) -> Result<i64, SnowflakeIdError> {
        let mut state = self
            .state
            .lock()
            .map_err(|_| SnowflakeIdError::StatePoisoned)?;
        self.next_id_at(now_millis, &mut state)
    }

    pub fn node_id(&self) -> u16 {
        self.node_id
    }

    pub fn epoch_millis(&self) -> u64 {
        self.epoch_millis
    }

    fn next_id_at(
        &self,
        now_millis: u64,
        state: &mut SnowflakeState,
    ) -> Result<i64, SnowflakeIdError> {
        if now_millis < self.epoch_millis {
            return Err(SnowflakeIdError::ClockBeforeEpoch {
                now_millis,
                epoch_millis: self.epoch_millis,
            });
        }
        if state.last_millis > now_millis {
            return Err(SnowflakeIdError::ClockMovedBackwards {
                last_millis: state.last_millis,
                now_millis,
            });
        }

        if state.last_millis == now_millis {
            if state.sequence == MAX_SEQUENCE {
                return Err(SnowflakeIdError::SequenceExhausted { millis: now_millis });
            }
            state.sequence += 1;
        } else {
            state.last_millis = now_millis;
            state.sequence = 0;
        }

        let delta_millis = now_millis - self.epoch_millis;
        if delta_millis > MAX_TIMESTAMP_DELTA {
            return Err(SnowflakeIdError::TimestampOverflow {
                delta_millis,
                max_delta_millis: MAX_TIMESTAMP_DELTA,
            });
        }

        let value = (delta_millis << TIMESTAMP_SHIFT)
            | (u64::from(self.node_id) << NODE_SHIFT)
            | u64::from(state.sequence);
        Ok(value as i64)
    }
}

pub fn default_snowflake_epoch_millis() -> u64 {
    DEFAULT_EPOCH_MILLIS
}

pub fn max_snowflake_node_id() -> u16 {
    MAX_NODE_ID
}

pub fn current_time_millis() -> Result<u64, SnowflakeIdError> {
    let duration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| SnowflakeIdError::SystemTime(error.to_string()))?;
    Ok(duration.as_millis() as u64)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn snowflake_ids_are_positive_and_monotonic_for_one_generator() {
        let generator = SnowflakeIdGenerator::with_epoch(7, 1_700_000_000_000).unwrap();

        let first = generator.generate_at(1_700_000_000_001).unwrap();
        let second = generator.generate_at(1_700_000_000_001).unwrap();
        let third = generator.generate_at(1_700_000_000_002).unwrap();

        assert!(first > 0);
        assert!(first < second);
        assert!(second < third);
    }

    #[test]
    fn snowflake_ids_encode_node_and_sequence_without_colliding_in_same_millis() {
        let generator = SnowflakeIdGenerator::with_epoch(42, 1_700_000_000_000).unwrap();
        let ids = (0..16)
            .map(|_| generator.generate_at(1_700_000_000_123).unwrap())
            .collect::<Vec<_>>();

        for window in ids.windows(2) {
            assert!(window[0] < window[1]);
        }
        assert_eq!(
            16,
            ids.iter().collect::<std::collections::BTreeSet<_>>().len()
        );
    }

    #[test]
    fn snowflake_generator_rejects_invalid_node_id_and_clock_rollback() {
        assert!(matches!(
            SnowflakeIdGenerator::new(max_snowflake_node_id() + 1),
            Err(SnowflakeIdError::InvalidNodeId { .. })
        ));

        let generator = SnowflakeIdGenerator::with_epoch(1, 1_700_000_000_000).unwrap();
        generator.generate_at(1_700_000_000_010).unwrap();
        assert!(matches!(
            generator.generate_at(1_700_000_000_009),
            Err(SnowflakeIdError::ClockMovedBackwards { .. })
        ));
    }
}
