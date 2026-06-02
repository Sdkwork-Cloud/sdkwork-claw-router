use sdkwork_claw_product::infrastructure::sql::sqlite::SqliteAppSkillsReadStore;
use sdkwork_claw_product::ports::{
    AppSkillsCommandStore, AppSkillsQuery, AppSkillsReadStore, AppSkillsSubject,
    EnableAppSkillCommand,
};
use sdkwork_claw_product_test_support::repair_sqlite_pool;

#[tokio::test]
async fn sqlite_app_skills_reads_installed_seed_assets_artifacts_and_user_installations() {
    let pool = repair_sqlite_pool().await;

    let store = SqliteAppSkillsReadStore::new(pool);
    let items = store
        .load_skills(
            AppSkillsQuery {
                keyword: Some("prompt".to_owned()),
                page_no: Some(1),
                page_size: Some(10),
                ..AppSkillsQuery::default()
            },
            Some(owner_subject()),
        )
        .await
        .unwrap();

    assert_eq!(1, items.len());
    let skill = &items[0];
    assert_eq!("8101", skill.id);
    assert_eq!("Prompt Optimizer", skill.name);
    assert_eq!("SDKWork", skill.developer);
    assert_eq!("SDKWork Official", skill.category);
    assert_eq!("SDKWork Commercial", skill.license);
    assert_eq!("2026-05-08", skill.last_updated);
    assert_eq!(
        "https://cdn.sdkwork.example/skills/prompt-optimizer/cover.png",
        skill.image["publicUrl"]
    );
    assert!(
        skill
            .screenshots
            .iter()
            .any(|resource| resource["publicUrl"]
                == "https://cdn.sdkwork.example/skills/prompt-optimizer/screenshot-1.png"),
        "skills hub seed read model must expose marketplace screenshots"
    );
    assert!(
        skill.frameworks.iter().any(|item| item == "Spring AI"),
        "skills hub seed read model must expose artifact or portal frameworks"
    );
    assert_eq!(1, skill.packages.len());
    assert_eq!("1.0.0", skill.packages[0].version);
    assert_eq!(
        "builtin://sdkwork.skills.prompt_optimizer@1.0.0",
        skill.packages[0].artifact_ref
    );
    assert_eq!(1748, skill.packages[0].artifact_size_bytes);

    let enabled = store
        .enable_skill(EnableAppSkillCommand {
            subject: owner_subject(),
            skill_id: "prompt-optimizer".to_owned(),
            install_uuid: "install-prompt-optimizer".to_owned(),
            config: None,
            requested_at: "2026-05-09T12:00:00Z".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!("8101", enabled.skill_id);
    assert!(enabled.enabled);
    assert_eq!("balanced", enabled.config["strictness"]);
    assert!(
        enabled.config.get("portal").is_none(),
        "runtime installation config must not persist skill store presentation metadata"
    );
    assert_eq!(
        "builtin://sdkwork.skills.prompt_optimizer@1.0.0",
        enabled.skill.packages[0].artifact_ref
    );

    let installed = store.load_user_skills(Some(owner_subject())).await.unwrap();
    assert_eq!(1, installed.len());
    assert_eq!("8101", installed[0].skill_id);
    assert_eq!("Prompt Optimizer", installed[0].skill.name);
    assert!(installed[0].enabled);
}

fn owner_subject() -> AppSkillsSubject {
    AppSkillsSubject {
        tenant_id: 20_001,
        organization_id: 0,
        user_id: 9001,
    }
}
