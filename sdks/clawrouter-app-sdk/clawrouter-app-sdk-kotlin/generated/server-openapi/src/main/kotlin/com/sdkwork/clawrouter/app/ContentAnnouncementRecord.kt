package com.sdkwork.clawrouter.app

data class ContentAnnouncementRecord(
    val announcementType: String? = null,
    val audienceFilter: Map<String, String>? = null,
    val content: String? = null,
    val createdAt: String? = null,
    val dataScope: String? = null,
    val deletedAt: String? = null,
    val deletedBy: String? = null,
    val effectiveFrom: String? = null,
    val effectiveTo: String? = null,
    val id: String? = null,
    val metadata: Map<String, String>? = null,
    val organizationId: String? = null,
    val pinned: Boolean? = null,
    val publishedAt: String? = null,
    val status: String? = null,
    val targetScope: String? = null,
    val tenantId: String? = null,
    val title: String? = null,
    val updatedAt: String? = null,
    val uuid: String? = null,
    val version: String? = null
)
