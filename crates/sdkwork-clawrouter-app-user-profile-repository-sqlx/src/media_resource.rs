use serde_json::{json, Value};

pub(crate) fn media_resource_from_snapshot(snapshot: &str, kind: &str) -> Value {
    let trimmed = snapshot.trim();
    if sdkwork_utils_rust::is_blank(Some(trimmed)) {
        return empty_media_resource(kind);
    }
    match serde_json::from_str::<Value>(trimmed) {
        Ok(Value::Object(object)) => {
            let value = Value::Object(object);
            let has_kind = value
                .get("kind")
                .and_then(Value::as_str)
                .map(str::trim)
                .is_some_and(|item| !sdkwork_utils_rust::is_blank(Some(item)));
            let has_source = value
                .get("source")
                .and_then(Value::as_str)
                .map(str::trim)
                .is_some_and(|item| !sdkwork_utils_rust::is_blank(Some(item)));
            if has_kind && has_source {
                value
            } else {
                empty_media_resource(kind)
            }
        }
        _ => empty_media_resource(kind),
    }
}

fn empty_media_resource(kind: &str) -> Value {
    json!({
        "kind": kind,
        "source": "external_url"
    })
}
