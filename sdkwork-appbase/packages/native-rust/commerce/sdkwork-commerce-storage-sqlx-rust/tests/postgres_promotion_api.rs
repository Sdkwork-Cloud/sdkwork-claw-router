use sdkwork_commerce_promotion::{
    CurrentUserCouponListQuery, PointsBalanceQuery, PointsHistoryQuery, RedeemCodeCommand,
};
use sdkwork_commerce_storage_sqlx::PostgresCommercePromotionStore;

#[test]
fn postgres_promotion_store_api_is_publicly_constructible() {
    let _: fn(sqlx::PgPool) -> PostgresCommercePromotionStore = PostgresCommercePromotionStore::new;
    let _ = PostgresCommercePromotionStore::list_current_user_coupons;
    let _ = PostgresCommercePromotionStore::retrieve_points_balance;
    let _ = PostgresCommercePromotionStore::list_points_history;
    let _ = PostgresCommercePromotionStore::redeem_code;

    let _ = std::mem::size_of::<CurrentUserCouponListQuery>();
    let _ = std::mem::size_of::<PointsBalanceQuery>();
    let _ = std::mem::size_of::<PointsHistoryQuery>();
    let _ = std::mem::size_of::<RedeemCodeCommand>();
}
