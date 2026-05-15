package com.sdkwork.clawrouter.backend

data class AdminCouponBatchGenerateRequest(
    val count: Int? = null,
    val couponId: Int? = null,
    val name: String? = null,
    val prefix: String? = null
)
