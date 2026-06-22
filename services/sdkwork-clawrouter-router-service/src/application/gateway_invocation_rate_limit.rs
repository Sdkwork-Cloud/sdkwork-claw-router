use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};

const ONE_SECOND: Duration = Duration::from_secs(1);
const ONE_DAY: Duration = Duration::from_secs(24 * 60 * 60);

#[derive(Debug, Clone)]
struct SlidingWindow {
    window_started_at: Instant,
    used: u32,
}

#[derive(Debug, Default)]
pub struct GatewayInvocationRateLimiter {
    per_second: Mutex<HashMap<String, SlidingWindow>>,
    per_day: Mutex<HashMap<String, SlidingWindow>>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GatewayRateLimitSpec {
    pub requests_per_second: Option<i64>,
    pub requests_per_day: Option<i64>,
    pub burst_limit: Option<i64>,
}

impl GatewayInvocationRateLimiter {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn check_and_record(
        &self,
        scope_key: &str,
        spec: &GatewayRateLimitSpec,
    ) -> Result<(), u64> {
        if let Some(limit) = spec.requests_per_second.filter(|value| *value > 0) {
            let effective_limit = spec
                .burst_limit
                .filter(|value| *value > 0)
                .map(|value| value.max(limit))
                .unwrap_or(limit);
            if let Err(retry_after) = self.check_window(
                &self.per_second,
                scope_key,
                ONE_SECOND,
                u32::try_from(effective_limit).unwrap_or(u32::MAX),
            ) {
                return Err(retry_after);
            }
        }

        if let Some(limit) = spec.requests_per_day.filter(|value| *value > 0) {
            if let Err(retry_after) = self.check_window(
                &self.per_day,
                scope_key,
                ONE_DAY,
                u32::try_from(limit).unwrap_or(u32::MAX),
            ) {
                return Err(retry_after);
            }
        }

        Ok(())
    }

    fn check_window(
        &self,
        buckets: &Mutex<HashMap<String, SlidingWindow>>,
        scope_key: &str,
        window: Duration,
        max_requests: u32,
    ) -> Result<(), u64> {
        let mut buckets = buckets.lock().map_err(|_| 60_u64)?;
        let now = Instant::now();
        buckets.retain(|_, bucket| now.duration_since(bucket.window_started_at) < window);
        let bucket = buckets
            .entry(scope_key.to_owned())
            .or_insert(SlidingWindow {
                window_started_at: now,
                used: 0,
            });
        if now.duration_since(bucket.window_started_at) >= window {
            bucket.window_started_at = now;
            bucket.used = 0;
        }
        let retry_after = window
            .saturating_sub(now.duration_since(bucket.window_started_at))
            .as_secs()
            .max(1);
        if bucket.used >= max_requests {
            return Err(retry_after);
        }
        bucket.used = bucket.used.saturating_add(1);
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn gateway_rate_limiter_blocks_after_rps_exceeded() {
        let limiter = GatewayInvocationRateLimiter::new();
        let spec = GatewayRateLimitSpec {
            requests_per_second: Some(2),
            requests_per_day: None,
            burst_limit: None,
        };
        assert!(limiter.check_and_record("api-key:1", &spec).is_ok());
        assert!(limiter.check_and_record("api-key:1", &spec).is_ok());
        assert!(limiter.check_and_record("api-key:1", &spec).is_err());
    }
}
