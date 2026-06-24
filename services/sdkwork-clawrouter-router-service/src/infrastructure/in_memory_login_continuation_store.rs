use std::collections::HashMap;
use std::sync::Mutex;

use crate::ports::{
    LoginContinuationRecord, LoginContinuationStore, StoreLoginContinuationCommand,
};

#[derive(Debug, Default)]
pub struct InMemoryLoginContinuationStore {
    records: Mutex<HashMap<String, LoginContinuationRecord>>,
}

impl InMemoryLoginContinuationStore {
    pub fn new() -> Self {
        Self::default()
    }
}

impl LoginContinuationStore for InMemoryLoginContinuationStore {
    fn store_login_continuation<'a>(
        &'a self,
        command: StoreLoginContinuationCommand,
    ) -> crate::ports::LoginContinuationFuture<'a, ()> {
        Box::pin(async move {
            let mut records = self.records.lock().map_err(|_| {
                crate::domain::DomainError::new("login continuation store lock poisoned")
            })?;
            records.insert(command.token, command.record);
            Ok(())
        })
    }

    fn take_login_continuation<'a>(
        &'a self,
        token: &'a str,
    ) -> crate::ports::LoginContinuationFuture<'a, Option<LoginContinuationRecord>> {
        Box::pin(async move {
            let mut records = self.records.lock().map_err(|_| {
                crate::domain::DomainError::new("login continuation store lock poisoned")
            })?;
            Ok(records.remove(token))
        })
    }
}
