pub fn product_name() -> &'static str {
    "sdkwork-claw-router"
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn product_name_is_stable() {
        assert_eq!("sdkwork-claw-router", product_name());
    }
}
