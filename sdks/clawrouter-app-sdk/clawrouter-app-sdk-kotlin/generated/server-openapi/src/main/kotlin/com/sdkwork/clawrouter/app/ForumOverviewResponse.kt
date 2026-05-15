package com.sdkwork.clawrouter.app

data class ForumOverviewResponse(
    val communityLinks: List<ForumCommunityLink>? = null,
    val source: ForumOverviewSource? = null,
    val stats: ForumOverviewStats? = null
)
