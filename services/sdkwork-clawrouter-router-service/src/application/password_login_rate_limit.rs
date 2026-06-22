use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};

const DEFAULT_MAX_ATTEMPTS: u32 = 10;
const DEFAULT_WINDOW: Duration = Duration::from_secs(15 * 60);

#[derive(Debug, Clone)]
struct AttemptWindow {
    count: u32,
    window_started_at: Instant,
}

#[derive(Debug, Default)]
pub struct PasswordLoginRateLimiter {
    attempts: Mutex<HashMap<String, AttemptWindow>>,
    max_attempts: u32,
    window: Duration,
}

impl PasswordLoginRateLimiter {
    pub fn new() -> Self {
        Self {
            attempts: Mutex::new(HashMap::new()),
            max_attempts: DEFAULT_MAX_ATTEMPTS,
            window: DEFAULT_WINDOW,
        }
    }

    pub fn check_and_record(&self, scope_key: &str) -> Result<(), String> {
        let mut attempts = self
            .attempts
            .lock()
            .map_err(|_| "password login rate limiter is unavailable".to_owned())?;
        let now = Instant::now();
        let entry = attempts
            .entry(scope_key.to_owned())
            .or_insert(AttemptWindow {
                count: 0,
                window_started_at: now,
            });
        if now.duration_since(entry.window_started_at) >= self.window {
            entry.count = 0;
            entry.window_started_at = now;
        }
        entry.count = entry.count.saturating_add(1);
        if entry.count > self.max_attempts {
            return Err(
                "Too many password login attempts. Please wait before trying again.".to_owned(),
            );
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn password_login_rate_limiter_blocks_after_max_attempts() {
        let limiter = PasswordLoginRateLimiter::new();
        for _ in 0..10 {
            assert!(limiter.check_and_record("ip:1.2.3.4|account:admin").is_ok());
        }
        assert!(limiter
            .check_and_record("ip:1.2.3.4|account:admin")
            .is_err());
    }
}
