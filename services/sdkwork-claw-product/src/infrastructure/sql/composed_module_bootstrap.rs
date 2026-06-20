use sqlx::{PgPool, SqlitePool};

const DEFAULT_APPSTORE_PUBLISHER_ID: &str = "appstore-publisher-default-20";
const DEFAULT_IAM_TENANT_ID: &str = "10";
const DEFAULT_IAM_ORGANIZATION_ID: &str = "20";
const DEFAULT_BOOTSTRAP_ADMIN_USER_ID: &str = "1";
const DEFAULT_COURSE_CATEGORY_ID: &str = "course-category-root";

pub(crate) async fn ensure_sqlite_composed_module_bootstrap(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO appstore_publisher
            (
                id,
                tenant_id,
                organization_id,
                publisher_no,
                publisher_type,
                display_name,
                publisher_status,
                verification_status,
                owner_user_id,
                created_at,
                updated_at
            )
        VALUES
            (?, ?, ?, 'default-root', 'organization', 'Root Organization Publisher', 'active', 'verified', ?, datetime('now'), datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
            display_name = excluded.display_name,
            publisher_status = excluded.publisher_status,
            verification_status = excluded.verification_status,
            updated_at = datetime('now')
        "#,
    )
    .bind(DEFAULT_APPSTORE_PUBLISHER_ID)
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(DEFAULT_BOOTSTRAP_ADMIN_USER_ID)
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        INSERT INTO course_category
            (
                id,
                uuid,
                tenant_id,
                organization_id,
                category_code,
                name,
                description,
                level_no,
                sort_order,
                status,
                created_at,
                updated_at
            )
        VALUES
            (?, ?, '0', '0', 'root', 'Courses', 'Default course catalog root category', 0, 0, 'active', datetime('now'), datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            description = excluded.description,
            status = excluded.status,
            updated_at = datetime('now')
        "#,
    )
    .bind(DEFAULT_COURSE_CATEGORY_ID)
    .bind(DEFAULT_COURSE_CATEGORY_ID)
    .execute(pool)
    .await?;
    Ok(())
}

pub(crate) async fn ensure_postgres_composed_module_bootstrap(pool: &PgPool) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO appstore_publisher
            (
                id,
                tenant_id,
                organization_id,
                publisher_no,
                publisher_type,
                display_name,
                publisher_status,
                verification_status,
                owner_user_id,
                created_at,
                updated_at
            )
        VALUES
            ($1, $2, $3, 'default-root', 'organization', 'Root Organization Publisher', 'active', 'verified', $4, CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
        ON CONFLICT(id) DO UPDATE SET
            display_name = excluded.display_name,
            publisher_status = excluded.publisher_status,
            verification_status = excluded.verification_status,
            updated_at = CURRENT_TIMESTAMP::text
        "#,
    )
    .bind(DEFAULT_APPSTORE_PUBLISHER_ID)
    .bind(DEFAULT_IAM_TENANT_ID)
    .bind(DEFAULT_IAM_ORGANIZATION_ID)
    .bind(DEFAULT_BOOTSTRAP_ADMIN_USER_ID)
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        INSERT INTO course_category
            (
                id,
                uuid,
                tenant_id,
                organization_id,
                category_code,
                name,
                description,
                level_no,
                sort_order,
                status,
                created_at,
                updated_at
            )
        VALUES
            ($1, $1, '0', '0', 'root', 'Courses', 'Default course catalog root category', 0, 0, 'active', CURRENT_TIMESTAMP::text, CURRENT_TIMESTAMP::text)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            description = excluded.description,
            status = excluded.status,
            updated_at = CURRENT_TIMESTAMP::text
        "#,
    )
    .bind(DEFAULT_COURSE_CATEGORY_ID)
    .execute(pool)
    .await?;
    Ok(())
}
