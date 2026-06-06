package com.sdkwork.clawrouter.app.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.app.*
import com.sdkwork.clawrouter.app.http.HttpClient

class ContentApi(private val client: HttpClient) {

    /** List forum comments */
    suspend fun commentsList(contentType: String, contentId: String, page: String? = null, pageSize: String? = null): CommentsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("content_type", contentType, "form", true, false, null),
            QueryParameterSpec("content_id", contentId, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/comments"), query))
        return client.convertValue(raw, object : TypeReference<CommentsListResult>() {})
    }

    /** Create forum comment */
    suspend fun commentsCreate(body: ForumCreateCommentRequest): CommentsCreateResult? {
        val raw = client.post(ApiPaths.appPath("/content/comments"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<CommentsCreateResult>() {})
    }

    /** List forum comment statistics */
    suspend fun commentsStatisticsList(contentType: String, contentId: String): CommentsStatisticsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("content_type", contentType, "form", true, false, null),
            QueryParameterSpec("content_id", contentId, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/comments/statistics"), query))
        return client.convertValue(raw, object : TypeReference<CommentsStatisticsListResult>() {})
    }

    /** Delete forum comment */
    suspend fun commentsDelete(commentId: String): CommentsDeleteResult? {
        val raw = client.delete(ApiPaths.appPath("/content/comments/${serializePathParameter(commentId, PathParameterSpec("commentId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CommentsDeleteResult>() {})
    }

    /** List forum comment detail */
    suspend fun commentsRetrieve(commentId: String): CommentsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/content/comments/${serializePathParameter(commentId, PathParameterSpec("commentId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CommentsRetrieveResult>() {})
    }

    /** Like forum comment */
    suspend fun commentsLikesCreate(commentId: String): CommentsLikesCreateResult? {
        val raw = client.post(ApiPaths.appPath("/content/comments/${serializePathParameter(commentId, PathParameterSpec("commentId", "simple", false))}/likes"), null)
        return client.convertValue(raw, object : TypeReference<CommentsLikesCreateResult>() {})
    }

    /** Unlike forum comment */
    suspend fun commentsLikesCurrentDelete(commentId: String): CommentsLikesCurrentDeleteResult? {
        val raw = client.delete(ApiPaths.appPath("/content/comments/${serializePathParameter(commentId, PathParameterSpec("commentId", "simple", false))}/likes/current"))
        return client.convertValue(raw, object : TypeReference<CommentsLikesCurrentDeleteResult>() {})
    }

    /** Pin forum comment */
    suspend fun commentsPinsCreate(commentId: String): CommentsPinsCreateResult? {
        val raw = client.post(ApiPaths.appPath("/content/comments/${serializePathParameter(commentId, PathParameterSpec("commentId", "simple", false))}/pins"), null)
        return client.convertValue(raw, object : TypeReference<CommentsPinsCreateResult>() {})
    }

    /** Unpin forum comment */
    suspend fun commentsPinsCurrentDelete(commentId: String): CommentsPinsCurrentDeleteResult? {
        val raw = client.delete(ApiPaths.appPath("/content/comments/${serializePathParameter(commentId, PathParameterSpec("commentId", "simple", false))}/pins/current"))
        return client.convertValue(raw, object : TypeReference<CommentsPinsCurrentDeleteResult>() {})
    }

    /** List forum comment replies */
    suspend fun commentsRepliesList(commentId: String, page: String? = null, pageSize: String? = null): CommentsRepliesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/comments/${serializePathParameter(commentId, PathParameterSpec("commentId", "simple", false))}/replies"), query))
        return client.convertValue(raw, object : TypeReference<CommentsRepliesListResult>() {})
    }

    /** Reply forum comment */
    suspend fun commentsReplyCreate(commentId: String, body: ForumReplyCommentRequest): CommentsReplyCreateResult? {
        val raw = client.post(ApiPaths.appPath("/content/comments/${serializePathParameter(commentId, PathParameterSpec("commentId", "simple", false))}/reply"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<CommentsReplyCreateResult>() {})
    }

    /** List forum feeds */
    suspend fun feedsList(type: String? = null, contentType: String? = null, q: String? = null, authorId: String? = null, page: String? = null, pageSize: String? = null): FeedsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("type", type, "form", true, false, null),
            QueryParameterSpec("content_type", contentType, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("author_id", authorId, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds"), query))
        return client.convertValue(raw, object : TypeReference<FeedsListResult>() {})
    }

    /** Create forum feed */
    suspend fun feedsCreate(body: ForumCreateFeedRequest): FeedsCreateResult? {
        val raw = client.post(ApiPaths.appPath("/content/feeds"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<FeedsCreateResult>() {})
    }

    /** List category forum feeds */
    suspend fun feedsCategoryRetrieve(categoryId: String, page: String? = null, pageSize: String? = null): FeedsCategoryRetrieveResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/category/${serializePathParameter(categoryId, PathParameterSpec("categoryId", "simple", false))}"), query))
        return client.convertValue(raw, object : TypeReference<FeedsCategoryRetrieveResult>() {})
    }

    /** List hot forum feeds */
    suspend fun feedsHotList(limit: String? = null): FeedsHotListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("limit", limit, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/hot"), query))
        return client.convertValue(raw, object : TypeReference<FeedsHotListResult>() {})
    }

    /** List most liked forum feeds */
    suspend fun feedsMostLikedList(limit: String? = null): FeedsMostLikedListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("limit", limit, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/most_liked"), query))
        return client.convertValue(raw, object : TypeReference<FeedsMostLikedListResult>() {})
    }

    /** List most viewed forum feeds */
    suspend fun feedsMostViewedList(limit: String? = null): FeedsMostViewedListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("limit", limit, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/most_viewed"), query))
        return client.convertValue(raw, object : TypeReference<FeedsMostViewedListResult>() {})
    }

    /** List forum overview */
    suspend fun feedsOverviewRetrieve(): FeedsOverviewRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/content/feeds/overview"))
        return client.convertValue(raw, object : TypeReference<FeedsOverviewRetrieveResult>() {})
    }

    /** List recommended forum feeds */
    suspend fun feedsRecommendList(limit: String? = null): FeedsRecommendListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("limit", limit, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/recommend"), query))
        return client.convertValue(raw, object : TypeReference<FeedsRecommendListResult>() {})
    }

    /** List top forum feeds */
    suspend fun feedsTopList(limit: String? = null): FeedsTopListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("limit", limit, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/top"), query))
        return client.convertValue(raw, object : TypeReference<FeedsTopListResult>() {})
    }

    /** Delete forum feed */
    suspend fun feedsDelete(id: String): FeedsDeleteResult? {
        val raw = client.delete(ApiPaths.appPath("/content/feeds/${serializePathParameter(id, PathParameterSpec("id", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<FeedsDeleteResult>() {})
    }

    /** List forum feed detail */
    suspend fun feedsRetrieve(id: String): FeedsRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/content/feeds/${serializePathParameter(id, PathParameterSpec("id", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<FeedsRetrieveResult>() {})
    }

    /** Collect forum feed */
    suspend fun feedsCollectionsCreate(id: String, folderId: String? = null): FeedsCollectionsCreateResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("folder_id", folderId, "form", true, false, null)
        ))
        val raw = client.post(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/${serializePathParameter(id, PathParameterSpec("id", "simple", false))}/collections"), query), null)
        return client.convertValue(raw, object : TypeReference<FeedsCollectionsCreateResult>() {})
    }

    /** Uncollect forum feed */
    suspend fun feedsCollectionsCurrentDelete(id: String): FeedsCollectionsCurrentDeleteResult? {
        val raw = client.delete(ApiPaths.appPath("/content/feeds/${serializePathParameter(id, PathParameterSpec("id", "simple", false))}/collections/current"))
        return client.convertValue(raw, object : TypeReference<FeedsCollectionsCurrentDeleteResult>() {})
    }

    /** Check forum feed collected */
    suspend fun feedsCollectionsCurrentRetrieve(id: String): FeedsCollectionsCurrentRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/content/feeds/${serializePathParameter(id, PathParameterSpec("id", "simple", false))}/collections/current"))
        return client.convertValue(raw, object : TypeReference<FeedsCollectionsCurrentRetrieveResult>() {})
    }

    /** Like forum feed */
    suspend fun feedsLikesCreate(id: String): FeedsLikesCreateResult? {
        val raw = client.post(ApiPaths.appPath("/content/feeds/${serializePathParameter(id, PathParameterSpec("id", "simple", false))}/likes"), null)
        return client.convertValue(raw, object : TypeReference<FeedsLikesCreateResult>() {})
    }

    /** Unlike forum feed */
    suspend fun feedsLikesCurrentDelete(id: String): FeedsLikesCurrentDeleteResult? {
        val raw = client.delete(ApiPaths.appPath("/content/feeds/${serializePathParameter(id, PathParameterSpec("id", "simple", false))}/likes/current"))
        return client.convertValue(raw, object : TypeReference<FeedsLikesCurrentDeleteResult>() {})
    }

    /** Share forum feed */
    suspend fun feedsSharesCreate(id: String): FeedsSharesCreateResult? {
        val raw = client.post(ApiPaths.appPath("/content/feeds/${serializePathParameter(id, PathParameterSpec("id", "simple", false))}/shares"), null)
        return client.convertValue(raw, object : TypeReference<FeedsSharesCreateResult>() {})
    }

    /** List my forum comments */
    suspend fun usersCurrentCommentsList(page: String? = null, pageSize: String? = null): UsersCurrentCommentsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/users/current/comments"), query))
        return client.convertValue(raw, object : TypeReference<UsersCurrentCommentsListResult>() {})
    }

    /** List courses */
    suspend fun coursesList(level: String? = null, category: String? = null, q: String? = null, page: String? = null, pageSize: String? = null): CoursesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("level", level, "form", true, false, null),
            QueryParameterSpec("category", category, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/courses"), query))
        return client.convertValue(raw, object : TypeReference<CoursesListResult>() {})
    }

    /** Create course application */
    suspend fun applicationsCreate(body: CourseApplicationCreateRequest): ApplicationsCreateResult? {
        val raw = client.post(ApiPaths.appPath("/courses/applications"), body, null, null, "application/json")
        return client.convertValue(raw, object : TypeReference<ApplicationsCreateResult>() {})
    }

    /** Upload course application video */
    suspend fun applicationsVideosCreate(body: CourseApplicationVideoUploadRequest): ApplicationsVideosCreateResult? {
        val raw = client.post(ApiPaths.appPath("/courses/applications/videos"), body, null, null, "multipart/form-data")
        return client.convertValue(raw, object : TypeReference<ApplicationsVideosCreateResult>() {})
    }

    /** List course categories */
    suspend fun coursesCategoriesList(): CoursesCategoriesListResult? {
        val raw = client.get(ApiPaths.appPath("/courses/categories"))
        return client.convertValue(raw, object : TypeReference<CoursesCategoriesListResult>() {})
    }

    /** List course overview */
    suspend fun coursesOverviewRetrieve(): CoursesOverviewRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/courses/overview"))
        return client.convertValue(raw, object : TypeReference<CoursesOverviewRetrieveResult>() {})
    }

    /** List course detail */
    suspend fun coursesRetrieve(courseId: String): CoursesRetrieveResult? {
        val raw = client.get(ApiPaths.appPath("/courses/${serializePathParameter(courseId, PathParameterSpec("courseId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<CoursesRetrieveResult>() {})
    }

    private data class PathParameterSpec(val name: String, val style: String, val explode: Boolean)

    private fun serializePathParameter(value: Any?, spec: PathParameterSpec): String {
        if (value == null) return ""
        val style = spec.style.ifBlank { "simple" }
        return when (value) {
            is Iterable<*> -> serializePathArray(spec.name, value, style, spec.explode)
            is Map<*, *> -> serializePathObject(spec.name, value, style, spec.explode)
            else -> pathPrimitivePrefix(spec.name, style) + pathEncode(value.toString())
        }
    }

    private fun serializePathArray(name: String, values: Iterable<*>, style: String, explode: Boolean): String {
        val serialized = values.mapNotNull { it?.toString()?.let(::pathEncode) }
        if (serialized.isEmpty()) return pathPrefix(name, style)
        if (style == "matrix") {
            if (explode) {
                return serialized.joinToString("") { ";$name=$it" }
            }
            return ";$name=" + serialized.joinToString(",")
        }
        val separator = if (explode) "." else ","
        return pathPrefix(name, style) + serialized.joinToString(separator)
    }

    private fun serializePathObject(name: String, values: Map<*, *>, style: String, explode: Boolean): String {
        val entries = mutableListOf<String>()
        val exploded = mutableListOf<String>()
        values.forEach { (key, value) ->
            if (value == null) return@forEach
            val escapedKey = pathEncode(key.toString())
            val escapedValue = pathEncode(value.toString())
            if (explode) {
                if (style == "matrix") {
                    exploded += ";$escapedKey=$escapedValue"
                } else {
                    exploded += "$escapedKey=$escapedValue"
                }
            } else {
                entries += escapedKey
                entries += escapedValue
            }
        }
        if (style == "matrix") {
            if (explode) return exploded.joinToString("")
            return ";$name=" + entries.joinToString(",")
        }
        if (explode) {
            val separator = if (style == "label") "." else ","
            return pathPrefix(name, style) + exploded.joinToString(separator)
        }
        return pathPrefix(name, style) + entries.joinToString(",")
    }

    private fun pathPrefix(name: String, style: String): String {
        return when (style) {
            "label" -> "."
            "matrix" -> ";$name"
            else -> ""
        }
    }

    private fun pathPrimitivePrefix(name: String, style: String): String {
        return if (style == "matrix") ";$name=" else pathPrefix(name, style)
    }

    private fun pathEncode(value: String): String {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20")
    }

    private data class QueryParameterSpec(
        val name: String,
        val value: Any?,
        val style: String,
        val explode: Boolean,
        val allowReserved: Boolean,
        val contentType: String?,
    )

    private val queryObjectMapper = ObjectMapper().registerKotlinModule()

    private fun buildQueryString(parameters: List<QueryParameterSpec>): String {
        val pairs = mutableListOf<String>()
        parameters.forEach { appendSerializedParameter(pairs, it) }
        return pairs.joinToString("&")
    }

    private fun appendSerializedParameter(pairs: MutableList<String>, parameter: QueryParameterSpec) {
        val value = parameter.value ?: return
        if (!parameter.contentType.isNullOrBlank()) {
            val json = queryObjectMapper.writeValueAsString(value)
            pairs += urlEncode(parameter.name) + "=" + encodeQueryValue(json, parameter.allowReserved)
            return
        }

        val style = parameter.style.ifBlank { "form" }
        when (value) {
            is Iterable<*> -> appendArrayParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved)
            is Map<*, *> -> if (style == "deepObject") {
                appendDeepObjectParameter(pairs, parameter.name, value, parameter.allowReserved)
            } else {
                appendObjectParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved)
            }
            else -> pairs += urlEncode(parameter.name) + "=" + encodeQueryValue(value.toString(), parameter.allowReserved)
        }
    }

    private fun appendArrayParameter(
        pairs: MutableList<String>,
        name: String,
        values: Iterable<*>,
        style: String,
        explode: Boolean,
        allowReserved: Boolean,
    ) {
        val serialized = values.mapNotNull { it?.toString() }
        if (serialized.isEmpty()) return
        if (style == "form" && explode) {
            serialized.forEach { pairs += urlEncode(name) + "=" + encodeQueryValue(it, allowReserved) }
            return
        }
        pairs += urlEncode(name) + "=" + encodeQueryValue(serialized.joinToString(","), allowReserved)
    }

    private fun appendObjectParameter(
        pairs: MutableList<String>,
        name: String,
        values: Map<*, *>,
        style: String,
        explode: Boolean,
        allowReserved: Boolean,
    ) {
        val serialized = mutableListOf<String>()
        values.forEach { (key, value) ->
            if (value == null) return@forEach
            if (style == "form" && explode) {
                pairs += urlEncode(key.toString()) + "=" + encodeQueryValue(value.toString(), allowReserved)
            } else {
                serialized += key.toString()
                serialized += value.toString()
            }
        }
        if (serialized.isNotEmpty()) {
            pairs += urlEncode(name) + "=" + encodeQueryValue(serialized.joinToString(","), allowReserved)
        }
    }

    private fun appendDeepObjectParameter(pairs: MutableList<String>, name: String, values: Map<*, *>, allowReserved: Boolean) {
        values.forEach { (key, value) ->
            if (value != null) {
                pairs += urlEncode("$name[$key]") + "=" + encodeQueryValue(value.toString(), allowReserved)
            }
        }
    }

    private fun encodeQueryValue(value: String, allowReserved: Boolean): String {
        var encoded = urlEncode(value)
        if (!allowReserved) return encoded
        mapOf(
            "%3A" to ":", "%2F" to "/", "%3F" to "?", "%23" to "#",
            "%5B" to "[", "%5D" to "]", "%40" to "@", "%21" to "!",
            "%24" to "$", "%26" to "&", "%27" to "'", "%28" to "(",
            "%29" to ")", "%2A" to "*", "%2B" to "+", "%2C" to ",",
            "%3B" to ";", "%3D" to "=",
        ).forEach { (escaped, reserved) -> encoded = encoded.replace(escaped, reserved) }
        return encoded
    }

    private fun urlEncode(value: String): String {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8)
    }

}
