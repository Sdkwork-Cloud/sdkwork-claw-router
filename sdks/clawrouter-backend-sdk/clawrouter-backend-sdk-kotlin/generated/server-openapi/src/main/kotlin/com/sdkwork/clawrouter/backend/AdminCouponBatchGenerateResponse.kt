package com.sdkwork.clawrouter.backend

data class AdminCouponBatchGenerateResponse(
    val batch: AdminCouponBatchItem? = null,
    val codes: List<AdminPromoCodeItem>? = null
)
