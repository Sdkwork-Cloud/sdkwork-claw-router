//! Shared SQL string normalization via sdkwork-utils-rust.

pub(crate) use sdkwork_utils_rust::is_blank;

/// Returns `None` when the input is blank after trim; otherwise returns the trimmed owned string.
pub(crate) fn optional_trimmed(value: &str) -> Option<String> {
    if is_blank(Some(value)) {
        None
    } else {
        Some(value.trim().to_owned())
    }
}

/// Returns `None` when the optional input is blank after trim; otherwise returns the trimmed owned string.
pub(crate) fn optional_trimmed_opt(value: Option<&str>) -> Option<String> {
    value.and_then(|text| optional_trimmed(text))
}

/// True when the string is non-blank after trim.
pub(crate) fn has_text(value: &str) -> bool {
    !is_blank(Some(value))
}
