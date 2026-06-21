mod common;
use common::InternalTrustedSubjectHeaders;
use sdkwork_claw_product_test_support::{repair_sqlite_pool, schema_sqlite_pool};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use std::sync::{Mutex, OnceLock};

use axum::body::Body;
use axum::http::{Request, StatusCode};
use sdkwork_claw_product::api::{
    app_forum_router_with_store, app_forum_router_with_store_and_community_links,
    configured_forum_community_links, parse_forum_community_links_config,
};
use sdkwork_claw_product::application::EntityUuidGenerator;
use sdkwork_claw_product::domain::DomainResult;
use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteForumStore;
use sdkwork_claw_product::ports::{
    CreateForumCommentCommand, CreateForumFeedCommand, ForumCommentCommandStore,
    ForumFeedCommandStore, ForumSubject,
};
use serde_json::Value;
use sqlx::sqlite::SqlitePool;
use tower::ServiceExt;

#[tokio::test]
async fn app_forum_public_read_routes_return_live_forum_data_without_auth() {
    let (router, feed_id, comment_id, expected_stats) =
        router_with_seeded_public_forum_fixture().await;

    for uri in [
        "/app/v3/api/content/feeds/overview".to_owned(),
        "/app/v3/api/content/feeds?content_type=feeds&page=1&page_size=10".to_owned(),
        format!("/app/v3/api/content/feeds/{feed_id}"),
        format!("/app/v3/api/content/comments?content_type=feeds&content_id={feed_id}"),
        format!("/app/v3/api/content/comments/{comment_id}/replies"),
        format!("/app/v3/api/content/comments/{comment_id}"),
        format!("/app/v3/api/content/comments/statistics?content_type=feeds&content_id={feed_id}"),
    ] {
        let response = router
            .clone()
            .oneshot(Request::builder().uri(uri).body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_ne!(
            StatusCode::UNAUTHORIZED,
            response.status(),
            "forum public read route must not require a trusted request subject"
        );
        assert_eq!(StatusCode::OK, response.status());
    }

    let overview_response = router
        .clone()
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/content/feeds/overview")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    let overview_payload = response_json(overview_response).await;
    assert_eq!("2000", overview_payload["code"]);
    assert_live_overview_stats(&overview_payload, expected_stats);
    assert!(
        overview_payload["data"]["communityLinks"]
            .as_array()
            .unwrap()
            .is_empty(),
        "community links must be empty unless real deployment links are configured"
    );
    assert_eq!(
        "Live forum data",
        overview_payload["data"]["source"]["sourceLabel"]
    );
    assert_eq!(
        "Derived from PlusFeeds, PlusComments, vote, and favorite tables.",
        overview_payload["data"]["source"]["sourceDescription"]
    );
    assert_eq!(
        [
            "content_forum_post",
            "content_comment",
            "content_reaction",
            "content_favorite"
        ],
        overview_payload["data"]["source"]["sourceTables"]
            .as_array()
            .unwrap()
            .iter()
            .map(|value| value.as_str().unwrap())
            .collect::<Vec<_>>()
            .as_slice(),
    );
}

#[tokio::test]
async fn app_forum_state_changing_routes_require_subject() {
    let (router, feed_id, _comment_id, _expected_stats) = router_with_public_forum_fixture().await;

    let anonymous_share_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/app/v3/api/content/feeds/{feed_id}/shares"))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::UNAUTHORIZED, anonymous_share_response.status());

    let signed_share_response = router
        .oneshot(
            signed_request_builder()
                .method("POST")
                .uri(format!("/app/v3/api/content/feeds/{feed_id}/shares"))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, signed_share_response.status());
}

#[tokio::test]
async fn app_forum_public_content_creation_uses_public_community_subject_without_auth() {
    let (router, _feed_id, _comment_id, _expected_stats) = router_with_public_forum_fixture().await;

    let create_feed_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/content/feeds")
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"title":"Public launch discussion","content":"Community posts must not fail with a trusted subject error.","categoryId":1000,"images":[{"kind":"image","source":"external_url","url":"https://cdn.example.test/forum/public-launch.png","publicUrl":"https://cdn.example.test/forum/public-launch.png"}],"tags":["community"]}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_ne!(
        StatusCode::UNAUTHORIZED,
        create_feed_response.status(),
        "forum public publishing must not return trusted subject authorization errors",
    );
    assert_eq!(StatusCode::OK, create_feed_response.status());
    let create_feed_payload = response_json(create_feed_response).await;
    assert_eq!("2000", create_feed_payload["code"]);
    assert_eq!(
        "Public launch discussion",
        create_feed_payload["data"]["title"]
    );
    assert!(create_feed_payload["data"].get("coverImage").is_none());
    assert_eq!("image", create_feed_payload["data"]["cover"]["kind"]);
    assert_eq!(
        "external_url",
        create_feed_payload["data"]["cover"]["source"]
    );
    assert_eq!(
        "https://cdn.example.test/forum/public-launch.png",
        create_feed_payload["data"]["cover"]["publicUrl"]
    );
    assert_eq!(0, create_feed_payload["data"]["author"]["id"]);
    assert_eq!(
        "Community Member",
        create_feed_payload["data"]["author"]["name"]
    );
    let created_feed_id = create_feed_payload["data"]["id"].as_i64().unwrap();

    let create_comment_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/app/v3/api/content/comments")
                .header("content-type", "application/json")
                .body(Body::from(format!(
                    r#"{{"contentType":"feeds","contentId":{created_feed_id},"content":"Public replies must use the same community subject."}}"#
                )))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_ne!(
        StatusCode::UNAUTHORIZED,
        create_comment_response.status(),
        "forum public commenting must not return trusted subject authorization errors",
    );
    assert_eq!(StatusCode::OK, create_comment_response.status());
    let create_comment_payload = response_json(create_comment_response).await;
    assert_eq!("2000", create_comment_payload["code"]);
    assert_eq!(0, create_comment_payload["data"]["author"]["id"]);
    assert_eq!(
        "Community Member",
        create_comment_payload["data"]["author"]["name"]
    );
    let created_comment_id = create_comment_payload["data"]["commentId"]
        .as_str()
        .unwrap()
        .parse::<i64>()
        .unwrap();

    let reply_comment_response = router
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/app/v3/api/content/comments/{created_comment_id}/reply"))
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"content":"Public nested replies must publish without trusted subject headers."}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_ne!(
        StatusCode::UNAUTHORIZED,
        reply_comment_response.status(),
        "forum public replies must not return trusted subject authorization errors",
    );
    assert_eq!(StatusCode::OK, reply_comment_response.status());
    let reply_comment_payload = response_json(reply_comment_response).await;
    assert_eq!("2000", reply_comment_payload["code"]);
    assert_eq!(
        Some(created_comment_id),
        reply_comment_payload["data"]["parentId"].as_i64(),
    );
    assert_eq!(0, reply_comment_payload["data"]["author"]["id"]);

    let list_response = router
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/content/feeds?content_type=feeds&q=launch")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = response_json(list_response).await;
    let items = list_payload["data"].as_array().unwrap();
    assert!(
        items
            .iter()
            .any(|item| item["id"].as_i64() == Some(created_feed_id)),
        "publicly created community feeds must be visible through public forum reads",
    );
}

#[tokio::test]
async fn app_forum_overview_route_reports_live_stats_and_public_community_links() {
    let (router, _feed_id, _comment_id, expected_stats) =
        router_with_seeded_public_forum_fixture().await;

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/content/feeds/overview")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    assert_eq!("2000", payload["code"]);
    assert_live_overview_stats(&payload, expected_stats);
    assert!(payload["data"]["communityLinks"]
        .as_array()
        .unwrap()
        .is_empty());
    assert_eq!("Live forum data", payload["data"]["source"]["sourceLabel"]);
    assert_eq!(
        "Derived from PlusFeeds, PlusComments, vote, and favorite tables.",
        payload["data"]["source"]["sourceDescription"]
    );
}

#[test]
fn app_forum_community_link_config_keeps_only_public_deployment_links() {
    let links = parse_forum_community_links_config(
        r#"
        [
          {
            "id": " wechat ",
            "label": " SDKWork   Community ",
            "url": "https://community.example.com/wechat",
            "qrCode": {
              "kind": "image",
              "source": "external_url",
              "publicUrl": "https://cdn.example.com/qrs/wechat.png"
            },
            "tone": "green"
          },
          {
            "id": "local",
            "label": "Local Admin",
            "url": "http://127.0.0.1:3900/forum",
            "tone": "red"
          },
          {
            "id": "script",
            "label": "Script",
            "url": "javascript:alert(1)",
            "tone": "pink"
          },
          {
            "id": "space",
            "label": "Space",
            "url": "https://community.example.com/bad path",
            "tone": "blue"
          },
          {
            "id": "userinfo-local",
            "label": "Userinfo Local",
            "url": "https://community.example.com@127.0.0.1/forum",
            "tone": "green"
          },
          {
            "id": "userinfo-public",
            "label": "Userinfo Public",
            "url": "https://operator@community.example.com/forum",
            "tone": "green"
          },
          {
            "id": "ipv6",
            "label": "IPv6",
            "url": "https://[2001:db8::1]/forum",
            "tone": "green"
          },
          {
            "id": "internal",
            "label": "Internal",
            "url": "https://forum.service.internal/community",
            "tone": "green"
          },
          {
            "id": "bad-port",
            "label": "Bad Port",
            "url": "https://community.example.com:/forum",
            "tone": "green"
          },
          {
            "id": "fallback",
            "label": "Fallback Tone",
            "url": "https://community.example.com/fallback",
            "tone": "purple"
          },
          {
            "id": "badqr",
            "label": "Bad QR",
            "url": "https://community.example.com/badqr",
            "qrCode": {
              "kind": "image",
              "source": "external_url",
              "publicUrl": "http://localhost/q.png"
            },
            "tone": "teal"
          }
        ]
        "#,
    );

    assert_eq!(3, links.len());
    assert_eq!("wechat", links[0].id);
    assert_eq!("SDKWork Community", links[0].label);
    assert_eq!("https://community.example.com/wechat", links[0].url);
    assert_eq!(
        Some("https://cdn.example.com/qrs/wechat.png"),
        links[0]
            .qr_code
            .as_ref()
            .and_then(|value| value.get("publicUrl"))
            .and_then(serde_json::Value::as_str)
    );
    assert_eq!("green", links[0].tone);
    assert_eq!("fallback", links[1].id);
    assert_eq!("blue", links[1].tone);
    assert_eq!("badqr", links[2].id);
    assert!(links[2].qr_code.is_none());
}

#[test]
fn app_forum_community_link_config_reads_runtime_toml_file() {
    let _guard = env_guard().lock().unwrap();
    let config_path = unique_config_path("forum-community-links");
    let links_path = config_path.with_file_name("forum-links.json");
    std::fs::create_dir_all(config_path.parent().unwrap()).unwrap();
    std::fs::write(
        &links_path,
        r#"[{"id":"forum","label":"Forum Community","url":"https://community.example.com/forum","tone":"teal"}]"#,
    )
    .unwrap();
    std::fs::write(
        &config_path,
        format!(
            "[forum]\ncommunity_links_json_file = \"{}\"\n",
            links_path.display().to_string().replace('\\', "/")
        ),
    )
    .unwrap();
    let saved_config_file = std::env::var("SDKWORK_CLAW_CONFIG_FILE").ok();
    let saved_links = std::env::var("SDKWORK_CLAW_FORUM_COMMUNITY_LINKS").ok();
    std::env::set_var("SDKWORK_CLAW_CONFIG_FILE", &config_path);
    std::env::remove_var("SDKWORK_CLAW_FORUM_COMMUNITY_LINKS");

    let links = configured_forum_community_links();

    restore_env_var("SDKWORK_CLAW_CONFIG_FILE", saved_config_file);
    restore_env_var("SDKWORK_CLAW_FORUM_COMMUNITY_LINKS", saved_links);
    let _ = std::fs::remove_file(&links_path);
    let _ = std::fs::remove_file(&config_path);
    assert_eq!(1, links.len());
    assert_eq!("forum", links[0].id);
    assert_eq!("Forum Community", links[0].label);
    assert_eq!("https://community.example.com/forum", links[0].url);
    assert_eq!("teal", links[0].tone);
}

#[tokio::test]
async fn app_forum_overview_route_uses_startup_community_link_config() {
    let links = parse_forum_community_links_config(
        r#"
        [
          {
            "id": "forum",
            "label": "Forum Community",
            "url": "https://community.example.com/forum",
            "qrCode": {
              "kind": "image",
              "source": "external_url",
              "publicUrl": "https://cdn.example.com/qrs/forum.png"
            },
            "tone": "teal"
          }
        ]
        "#,
    );
    let (router, _feed_id, _comment_id, _expected_stats) =
        router_with_public_forum_fixture_and_links(links).await;

    let response = router
        .clone()
        .oneshot(
            Request::builder()
                .uri("/app/v3/api/content/feeds/overview")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, response.status());
    let payload = response_json(response).await;
    let community_links = payload["data"]["communityLinks"].as_array().unwrap();
    assert_eq!(1, community_links.len());
    assert_eq!("forum", community_links[0]["id"]);
    assert_eq!("Forum Community", community_links[0]["label"]);
    assert_eq!(
        "https://community.example.com/forum",
        community_links[0]["url"]
    );
    assert_eq!(
        "https://cdn.example.com/qrs/forum.png",
        community_links[0]["qrCode"]["publicUrl"]
    );
    assert!(
        community_links[0].get("qrCodeUrl").is_none(),
        "forum community links must not expose the legacy qrCodeUrl alias"
    );
    assert_eq!("teal", community_links[0]["tone"]);
}

#[tokio::test]
async fn app_forum_api_matches_standard_collect_reply_delete_contract() {
    let (router, feed_id, comment_id) = router_with_forum_fixture().await;

    let collect_response = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/content/feeds/{feed_id}/collections?folder_id=77"
                ))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, collect_response.status());
    let collect_payload = response_json(collect_response).await;
    assert_eq!("2000", collect_payload["code"]);
    assert_eq!(true, collect_payload["data"]["isCollected"]);
    assert!(
        collect_payload["data"].get("favoriteCount").is_none(),
        "generated app feed responses expose isCollected but not persistence-only favoriteCount"
    );

    let reply_response = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("POST")
                .uri(format!("/app/v3/api/content/comments/{comment_id}/reply"))
                .header("content-type", "application/json")
                .body(Body::from(
                    r#"{"content":"Thanks","deviceInfo":"rust-api-test"}"#,
                ))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, reply_response.status());
    let reply_payload = response_json(reply_response).await;
    assert_eq!("2000", reply_payload["code"]);
    assert_eq!("Thanks", reply_payload["data"]["content"]);
    assert_eq!("FEEDS", reply_payload["data"]["contentType"]);
    assert_eq!(feed_id, reply_payload["data"]["contentId"]);
    assert_eq!(comment_id, reply_payload["data"]["parentId"]);

    let delete_response = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("DELETE")
                .uri(format!("/app/v3/api/content/comments/{comment_id}"))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, delete_response.status());
    let delete_payload = response_json(delete_response).await;
    assert_eq!("2000", delete_payload["code"]);
    assert!(
        delete_payload.get("data").is_none() || delete_payload["data"].is_null(),
        "standard comment delete returns an empty result payload, not a boolean wrapper"
    );

    let categories_response = router
        .oneshot(
            signed_request_builder()
                .uri("/app/v3/api/content/feeds/categories")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert!(
        matches!(
            categories_response.status(),
            StatusCode::NOT_FOUND | StatusCode::METHOD_NOT_ALLOWED
        ),
        "standard content feed API does not expose a successful GET /feeds/categories endpoint"
    );
}

#[tokio::test]
async fn app_forum_feed_routes_accept_standard_path_and_query_names() {
    let (router, feed_id, _comment_id) = router_with_forum_fixture().await;

    let list_response = router
        .clone()
        .oneshot(
            signed_request_builder()
                .uri("/app/v3/api/content/feeds?type=hot&content_type=feeds&q=contract&author_id=30&page=1&page_size=10")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_response.status());
    let list_payload = response_json(list_response).await;
    assert_eq!("2000", list_payload["code"]);
    assert!(
        list_payload["data"].is_array(),
        "standard content feed list endpoints return a feed item array result"
    );
    assert_eq!(feed_id, list_payload["data"][0]["id"]);
    assert!(
        list_payload["data"][0].get("contentId").is_none(),
        "generated app feed item responses do not expose persistence-only contentId"
    );
    assert!(
        list_payload["data"][0].get("favoriteCount").is_none(),
        "generated app feed item responses expose isCollected but not persistence-only favoriteCount"
    );

    for uri in [
        format!("/app/v3/api/content/feeds/{feed_id}"),
        format!("/app/v3/api/content/feeds/{feed_id}/collections/current"),
        format!("/app/v3/api/content/feeds/hot?limit=5"),
        format!("/app/v3/api/content/feeds/recommend?limit=5"),
        format!("/app/v3/api/content/feeds?q=contract&page=1&page_size=10"),
        format!("/app/v3/api/content/feeds/top?limit=5"),
        format!("/app/v3/api/content/feeds/category/1001?page=1&page_size=10"),
        format!("/app/v3/api/content/feeds/most_viewed?limit=5"),
        format!("/app/v3/api/content/feeds/most_liked?limit=5"),
    ] {
        let response = router
            .clone()
            .oneshot(
                signed_request_builder()
                    .uri(uri)
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(StatusCode::OK, response.status());
    }

    let removed_search_route_response = router
        .clone()
        .oneshot(
            signed_request_builder()
                .uri("/app/v3/api/content/feeds/search?q=contract")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert!(
        matches!(
            removed_search_route_response.status(),
            StatusCode::NOT_FOUND | StatusCode::METHOD_NOT_ALLOWED
        ),
        "forum search must use the generated SDK list endpoint with q instead of a separate search route"
    );
}

#[tokio::test]
async fn app_forum_routes_ignore_removed_pagination_aliases() {
    let (router, _feed_id, comment_id) = router_with_forum_fixture().await;

    let default_list_response = router
        .clone()
        .oneshot(
            signed_request_builder()
                .uri("/app/v3/api/content/feeds")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, default_list_response.status());
    let default_list_payload = response_json(default_list_response).await;
    assert!(
        default_list_payload["data"].is_array(),
        "standard content feed list endpoints return a feed item array result"
    );

    let list_alias_response = router
        .clone()
        .oneshot(
            signed_request_builder()
                .uri("/app/v3/api/content/feeds?size=1")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, list_alias_response.status());
    let list_alias_payload = response_json(list_alias_response).await;
    assert_eq!(
        default_list_payload["data"], list_alias_payload["data"],
        "OpenAPI query declares page and page_size, so removed size alias must not silently paginate Rust responses",
    );

    let replies_response = router
        .clone()
        .oneshot(
            signed_request_builder()
                .uri(format!("/app/v3/api/content/comments/{comment_id}/replies"))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, replies_response.status());
    let replies_payload = response_json(replies_response).await;
    assert_eq!(
        10, replies_payload["data"]["size"],
        "standard comment replies endpoint defaults size to 10",
    );

    let reply_limit_alias_response = router
        .clone()
        .oneshot(
            signed_request_builder()
                .uri(format!(
                    "/app/v3/api/content/comments/{comment_id}/replies?limit=1"
                ))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, reply_limit_alias_response.status());
    let reply_limit_alias_payload = response_json(reply_limit_alias_response).await;
    assert_eq!(
        10, reply_limit_alias_payload["data"]["size"],
        "standard replies endpoint declares page and size, not limit",
    );
}

#[tokio::test]
async fn app_forum_api_enforces_standard_request_validation_contract() {
    let (router, feed_id, comment_id) = router_with_forum_fixture().await;

    let negative_category = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("POST")
                .uri("/app/v3/api/content/feeds")
                .header("content-type", "application/json")
                .body(Body::from(r#"{"content":"valid","categoryId":-1}"#))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, negative_category.status());

    let too_many_images = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("POST")
                .uri("/app/v3/api/content/feeds")
                .header("content-type", "application/json")
                .body(Body::from(format!(
                    r#"{{"content":"valid","images":[{}]}}"#,
                    (0..21)
                        .map(|index| format!(r#""https://cdn.sdkwork.com/{index}.png""#))
                        .collect::<Vec<_>>()
                        .join(",")
                )))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, too_many_images.status());

    let oversized_tag = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("POST")
                .uri("/app/v3/api/content/feeds")
                .header("content-type", "application/json")
                .body(Body::from(format!(
                    r#"{{"content":"valid","tags":["{}"]}}"#,
                    "t".repeat(65)
                )))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, oversized_tag.status());

    let too_many_tags = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("POST")
                .uri("/app/v3/api/content/feeds")
                .header("content-type", "application/json")
                .body(Body::from(format!(
                    r#"{{"content":"valid","tags":[{}]}}"#,
                    (0..21)
                        .map(|index| format!(r#""tag-{index}""#))
                        .collect::<Vec<_>>()
                        .join(",")
                )))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, too_many_tags.status());

    let invalid_collect = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("POST")
                .uri(format!(
                    "/app/v3/api/content/feeds/{feed_id}/collections?folder_id=0"
                ))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, invalid_collect.status());

    let invalid_feed_type = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("GET")
                .uri("/app/v3/api/content/feeds?type=latest")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, invalid_feed_type.status());

    let invalid_feed_content_type = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("GET")
                .uri("/app/v3/api/content/feeds?content_type=comments")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, invalid_feed_content_type.status());

    let invalid_comment = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("POST")
                .uri("/app/v3/api/content/comments")
                .header("content-type", "application/json")
                .body(Body::from(format!(
                    r#"{{"contentType":"feeds","contentId":{feed_id},"content":"ok","deviceInfo":"{}"}}"#,
                    "d".repeat(513)
                )))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, invalid_comment.status());

    let max_comment_response = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("POST")
                .uri("/app/v3/api/content/comments")
                .header("content-type", "application/json")
                .body(Body::from(format!(
                    r#"{{"contentType":"feeds","contentId":{feed_id},"content":"{}"}}"#,
                    "c".repeat(20_000)
                )))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::OK, max_comment_response.status());

    let oversized_reply = router
        .clone()
        .oneshot(
            signed_request_builder()
                .method("POST")
                .uri(format!("/app/v3/api/content/comments/{comment_id}/reply"))
                .header("content-type", "application/json")
                .body(Body::from(format!(
                    r#"{{"content":"{}"}}"#,
                    "r".repeat(20_001)
                )))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, oversized_reply.status());

    let invalid_content_id = router
        .oneshot(
            signed_request_builder()
                .method("GET")
                .uri("/app/v3/api/content/comments?content_type=feeds&content_id=0")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(StatusCode::BAD_REQUEST, invalid_content_id.status());
}

async fn router_with_forum_fixture() -> (axum::Router, i64, i64) {
    let pool = schema_sqlite_pool().await;

    let store = Arc::new(SqliteForumStore::new(pool.clone()));
    let subject = signed_subject();
    let feed = store
        .create_feed(
            CreateForumFeedCommand {
                subject,
                uuid: "forum-api-feed-uuid".to_owned(),
                title: Some("Forum API contract".to_owned()),
                content: "Align Rust forum routes with the generated app content API.".to_owned(),
                category_id: Some(1001),
                images: Vec::new(),
                tags: vec!["contract".to_owned()],
                source: Some("test".to_owned()),
                source_url: None,
                requested_at: "2026-05-10 10:00:00".to_owned(),
            },
            Some(subject),
        )
        .await
        .unwrap();
    let feed_id = feed.id;
    let comment = store
        .create_comment(
            CreateForumCommentCommand {
                subject,
                uuid: "forum-api-comment-uuid".to_owned(),
                content_type: "feeds".to_owned(),
                content_id: feed_id,
                content: "Parent comment".to_owned(),
                parent_id: None,
                device_info: Some("fixture".to_owned()),
                ip_address: Some("127.0.0.1".to_owned()),
                requested_at: "2026-05-10 10:01:00".to_owned(),
            },
            Some(subject),
        )
        .await
        .unwrap();
    let comment_id = comment.comment_id.parse::<i64>().unwrap();
    let router = app_forum_router_with_store(
        store.clone(),
        store.clone(),
        store.clone(),
        store,
        Arc::new(TestUuidGenerator),
    );
    (router, feed_id, comment_id)
}

async fn router_with_public_forum_fixture() -> (axum::Router, i64, i64, ExpectedForumOverviewStats)
{
    router_with_public_forum_fixture_and_links(Vec::new()).await
}

async fn router_with_seeded_public_forum_fixture(
) -> (axum::Router, i64, i64, ExpectedForumOverviewStats) {
    router_with_seeded_public_forum_fixture_and_links(Vec::new()).await
}

async fn router_with_public_forum_fixture_and_links(
    community_links: Vec<sdkwork_claw_product::ports::ForumCommunityLink>,
) -> (axum::Router, i64, i64, ExpectedForumOverviewStats) {
    public_forum_fixture(community_links, false).await
}

async fn router_with_seeded_public_forum_fixture_and_links(
    community_links: Vec<sdkwork_claw_product::ports::ForumCommunityLink>,
) -> (axum::Router, i64, i64, ExpectedForumOverviewStats) {
    public_forum_fixture(community_links, true).await
}

async fn public_forum_fixture(
    community_links: Vec<sdkwork_claw_product::ports::ForumCommunityLink>,
    include_bundled_seed: bool,
) -> (axum::Router, i64, i64, ExpectedForumOverviewStats) {
    let pool = if include_bundled_seed {
        repair_sqlite_pool().await
    } else {
        schema_sqlite_pool().await
    };

    let store = Arc::new(SqliteForumStore::new(pool.clone()));
    let subject = public_subject();
    let feed = store
        .create_feed(
            CreateForumFeedCommand {
                subject,
                uuid: "forum-public-feed-uuid".to_owned(),
                title: Some("Public forum overview".to_owned()),
                content: "Public read routes must work without trusted headers.".to_owned(),
                category_id: Some(1001),
                images: Vec::new(),
                tags: vec!["overview".to_owned()],
                source: Some("test".to_owned()),
                source_url: None,
                requested_at: "2026-05-10 10:00:00".to_owned(),
            },
            Some(subject),
        )
        .await
        .unwrap();
    let feed_id = feed.id;
    let comment = store
        .create_comment(
            CreateForumCommentCommand {
                subject,
                uuid: "forum-public-comment-uuid".to_owned(),
                content_type: "feeds".to_owned(),
                content_id: feed_id,
                content: "Public data should be visible anonymously.".to_owned(),
                parent_id: None,
                device_info: Some("fixture".to_owned()),
                ip_address: Some("127.0.0.1".to_owned()),
                requested_at: "2026-05-10 10:01:00".to_owned(),
            },
            Some(subject),
        )
        .await
        .unwrap();
    let comment_id = comment.comment_id.parse::<i64>().unwrap();
    let expected_stats = expected_public_forum_overview_stats(&pool).await;
    if include_bundled_seed {
        assert!(
            expected_stats.total_comments >= 9,
            "bundled forum tutorial comments plus fixture comments must be counted in forum overview comments"
        );
    }
    let router = app_forum_router_with_store_and_community_links(
        store.clone(),
        store.clone(),
        store.clone(),
        store,
        Arc::new(TestUuidGenerator),
        community_links,
    );
    (router, feed_id, comment_id, expected_stats)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct ExpectedForumOverviewStats {
    total_posts: i64,
    total_comments: i64,
    member_count: i64,
    online_members: i64,
}

async fn expected_public_forum_overview_stats(pool: &SqlitePool) -> ExpectedForumOverviewStats {
    let (total_posts, total_comments, member_count, online_members) =
        sqlx::query_as::<_, (i64, i64, i64, i64)>(
            r#"
            WITH published_feeds AS (
                SELECT user_id, created_at, updated_at
                FROM content_forum_post
                WHERE COALESCE(status, 0) = 2
                  AND tenant_id = 0
                  AND organization_id = 0
            ),
            published_comments AS (
                SELECT user_id, created_at, updated_at
                FROM content_comment
                WHERE COALESCE(status, 0) = 1
                  AND COALESCE(content_type, 0) IN (5, 22)
                  AND tenant_id = 0
                  AND organization_id = 0
            ),
            activity_users AS (
                SELECT user_id FROM published_feeds WHERE COALESCE(user_id, 0) > 0
                UNION
                SELECT user_id FROM published_comments WHERE COALESCE(user_id, 0) > 0
            ),
            recent_activity_users AS (
                SELECT user_id
                FROM published_feeds
                WHERE COALESCE(user_id, 0) > 0
                  AND datetime(replace(replace(COALESCE(updated_at, created_at), 'T', ' '), 'Z', '')) >= datetime('now', '-7 days')
                UNION
                SELECT user_id
                FROM published_comments
                WHERE COALESCE(user_id, 0) > 0
                  AND datetime(replace(replace(COALESCE(updated_at, created_at), 'T', ' '), 'Z', '')) >= datetime('now', '-7 days')
            )
            SELECT
                (SELECT COUNT(1) FROM published_feeds) AS total_posts,
                (SELECT COUNT(1) FROM published_comments) AS total_comments,
                (SELECT COUNT(1) FROM activity_users) AS member_count,
                (SELECT COUNT(1) FROM recent_activity_users) AS online_members
            "#,
        )
        .fetch_one(pool)
        .await
        .unwrap();
    ExpectedForumOverviewStats {
        total_posts,
        total_comments,
        member_count,
        online_members,
    }
}

fn assert_live_overview_stats(payload: &Value, expected: ExpectedForumOverviewStats) {
    let stats = &payload["data"]["stats"];
    assert_eq!(expected.total_posts, stats["totalPosts"].as_i64().unwrap());
    assert_eq!(
        expected.total_comments,
        stats["totalComments"].as_i64().unwrap()
    );
    assert_eq!(
        expected.member_count,
        stats["memberCount"].as_i64().unwrap()
    );
    assert_eq!(
        expected.online_members,
        stats["onlineMembers"].as_i64().unwrap()
    );
}

fn signed_request_builder() -> axum::http::request::Builder {
    Request::builder().internal_trusted_subject(10, 20, 30)
}

fn signed_subject() -> ForumSubject {
    ForumSubject {
        tenant_id: 100001,
        organization_id: 0,
        user_id: 30,
    }
}

fn public_subject() -> ForumSubject {
    ForumSubject {
        tenant_id: 0,
        organization_id: 0,
        user_id: 30,
    }
}

async fn response_json(response: axum::response::Response) -> Value {
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    serde_json::from_slice(&body).unwrap()
}

struct TestUuidGenerator;

static TEST_UUID_SEQUENCE: AtomicU64 = AtomicU64::new(1);

impl EntityUuidGenerator for TestUuidGenerator {
    fn generate_entity_uuid(&self) -> DomainResult<String> {
        let sequence = TEST_UUID_SEQUENCE.fetch_add(1, Ordering::Relaxed);
        Ok(format!("forum-api-generated-uuid-{sequence}"))
    }
}

fn env_guard() -> &'static Mutex<()> {
    static LOCK: OnceLock<Mutex<()>> = OnceLock::new();
    LOCK.get_or_init(|| Mutex::new(()))
}

fn unique_config_path(name: &str) -> std::path::PathBuf {
    std::env::temp_dir()
        .join("clawrouter-forum-tests")
        .join(format!(
            "{name}-{}-{}.toml",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ))
}

fn restore_env_var(name: &str, value: Option<String>) {
    match value {
        Some(value) => std::env::set_var(name, value),
        None => std::env::remove_var(name),
    }
}
