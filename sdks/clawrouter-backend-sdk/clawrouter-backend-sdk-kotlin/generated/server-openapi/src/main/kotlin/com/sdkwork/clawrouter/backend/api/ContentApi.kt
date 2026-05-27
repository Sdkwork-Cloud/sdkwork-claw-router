package com.sdkwork.clawrouter.backend.api

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.sdkwork.clawrouter.backend.*
import com.sdkwork.clawrouter.backend.http.HttpClient

class ContentApi(private val client: HttpClient) {

    /** List announcements */
    suspend fun announcementsList(): AnnouncementsListResult? {
        val raw = client.get(ApiPaths.backendPath("/content/announcements"))
        return client.convertValue(raw, object : TypeReference<AnnouncementsListResult>() {})
    }

    /** Create announcement */
    suspend fun announcementsCreate(body: AdminAnnouncementCreateRequest, xRequestId: String? = null): AnnouncementsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/content/announcements"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<AnnouncementsCreateResult>() {})
    }

    /** Delete announcement */
    suspend fun announcementsDelete(announcementId: String): AnnouncementsDeleteResult? {
        val raw = client.delete(ApiPaths.backendPath("/content/announcements/${serializePathParameter(announcementId, PathParameterSpec("announcementId", "simple", false))}"))
        return client.convertValue(raw, object : TypeReference<AnnouncementsDeleteResult>() {})
    }

    /** Update announcement */
    suspend fun announcementsUpdate(announcementId: String, body: AdminAnnouncementUpdateRequest, xRequestId: String? = null): AnnouncementsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/content/announcements/${serializePathParameter(announcementId, PathParameterSpec("announcementId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<AnnouncementsUpdateResult>() {})
    }

    /** Admin Course Applications List */
    suspend fun courseApplicationsList(page: Int? = null, pageSize: Int? = null, q: String? = null, status: String? = null): CourseApplicationsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/course-applications"), query))
        return client.convertValue(raw, object : TypeReference<CourseApplicationsListResult>() {})
    }

    /** Admin Course Application Review */
    suspend fun courseApplicationsReview(applicationId: String, body: AdminCourseApplicationReviewRequest, xRequestId: String? = null): CourseApplicationsReviewResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/content/course-applications/${serializePathParameter(applicationId, PathParameterSpec("applicationId", "simple", false))}/review"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CourseApplicationsReviewResult>() {})
    }

    /** Admin Course Lesson Delete */
    suspend fun courseLessonsDelete(lessonId: String, xRequestId: String? = null): CourseLessonsDeleteResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.delete(ApiPaths.backendPath("/content/course-lessons/${serializePathParameter(lessonId, PathParameterSpec("lessonId", "simple", false))}"), null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<CourseLessonsDeleteResult>() {})
    }

    /** Admin Course Lesson Update */
    suspend fun courseLessonsUpdate(lessonId: String, body: AdminCourseLessonMutationRequest, xRequestId: String? = null): CourseLessonsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/content/course-lessons/${serializePathParameter(lessonId, PathParameterSpec("lessonId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CourseLessonsUpdateResult>() {})
    }

    /** Admin Course Section Delete */
    suspend fun courseSectionsDelete(sectionId: String, xRequestId: String? = null): CourseSectionsDeleteResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.delete(ApiPaths.backendPath("/content/course-sections/${serializePathParameter(sectionId, PathParameterSpec("sectionId", "simple", false))}"), null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<CourseSectionsDeleteResult>() {})
    }

    /** Admin Course Section Update */
    suspend fun courseSectionsUpdate(sectionId: String, body: AdminCourseSectionMutationRequest, xRequestId: String? = null): CourseSectionsUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/content/course-sections/${serializePathParameter(sectionId, PathParameterSpec("sectionId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CourseSectionsUpdateResult>() {})
    }

    /** Admin Courses List */
    suspend fun coursesList(page: Int? = null, pageSize: Int? = null, q: String? = null, status: String? = null): CoursesListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses"), query))
        return client.convertValue(raw, object : TypeReference<CoursesListResult>() {})
    }

    /** Admin Course Create */
    suspend fun coursesCreate(body: AdminCourseMutationRequest, xRequestId: String? = null): CoursesCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/content/courses"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CoursesCreateResult>() {})
    }

    /** Admin Course Comments List */
    suspend fun courseCommentsList(page: Int? = null, pageSize: Int? = null, q: String? = null, status: String? = null): CourseCommentsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/comments"), query))
        return client.convertValue(raw, object : TypeReference<CourseCommentsListResult>() {})
    }

    /** Admin Course Comment Moderate */
    suspend fun courseCommentsModerate(commentId: String, body: AdminCourseCommentModerationRequest, xRequestId: String? = null): CourseCommentsModerateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/content/courses/comments/${serializePathParameter(commentId, PathParameterSpec("commentId", "simple", false))}/moderation"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CourseCommentsModerateResult>() {})
    }

    /** Course Dashboard Retrieve */
    suspend fun coursesDashboardRetrieve(): CoursesDashboardRetrieveResult? {
        val raw = client.get(ApiPaths.backendPath("/content/courses/dashboard"))
        return client.convertValue(raw, object : TypeReference<CoursesDashboardRetrieveResult>() {})
    }

    /** Admin Course Engagement List */
    suspend fun courseEngagementList(page: Int? = null, pageSize: Int? = null, q: String? = null, status: String? = null): CourseEngagementListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/engagement"), query))
        return client.convertValue(raw, object : TypeReference<CourseEngagementListResult>() {})
    }

    /** Admin Course Delete */
    suspend fun coursesDelete(courseId: String, xRequestId: String? = null): CoursesDeleteResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.delete(ApiPaths.backendPath("/content/courses/${serializePathParameter(courseId, PathParameterSpec("courseId", "simple", false))}"), null, requestHeaders)
        return client.convertValue(raw, object : TypeReference<CoursesDeleteResult>() {})
    }

    /** Admin Course Update */
    suspend fun coursesUpdate(courseId: String, body: AdminCourseMutationRequest, xRequestId: String? = null): CoursesUpdateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.patch(ApiPaths.backendPath("/content/courses/${serializePathParameter(courseId, PathParameterSpec("courseId", "simple", false))}"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CoursesUpdateResult>() {})
    }

    /** Admin Course Lessons List */
    suspend fun coursesLessonsList(courseId: String, page: Int? = null, pageSize: Int? = null, q: String? = null, status: String? = null): CoursesLessonsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/${serializePathParameter(courseId, PathParameterSpec("courseId", "simple", false))}/lessons"), query))
        return client.convertValue(raw, object : TypeReference<CoursesLessonsListResult>() {})
    }

    /** Admin Course Lesson Create */
    suspend fun coursesLessonsCreate(courseId: String, body: AdminCourseLessonMutationRequest, xRequestId: String? = null): CoursesLessonsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/content/courses/${serializePathParameter(courseId, PathParameterSpec("courseId", "simple", false))}/lessons"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CoursesLessonsCreateResult>() {})
    }

    /** Admin Course Relations List */
    suspend fun coursesRelationsList(courseId: String, page: Int? = null, pageSize: Int? = null, q: String? = null, status: String? = null): CoursesRelationsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/${serializePathParameter(courseId, PathParameterSpec("courseId", "simple", false))}/relations"), query))
        return client.convertValue(raw, object : TypeReference<CoursesRelationsListResult>() {})
    }

    /** Admin Course Relations Replace */
    suspend fun coursesRelationsReplace(courseId: String, body: AdminCourseRelationsReplaceRequest, xRequestId: String? = null): CoursesRelationsReplaceResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.put(ApiPaths.backendPath("/content/courses/${serializePathParameter(courseId, PathParameterSpec("courseId", "simple", false))}/relations"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CoursesRelationsReplaceResult>() {})
    }

    /** Admin Course Sections List */
    suspend fun coursesSectionsList(courseId: String, page: Int? = null, pageSize: Int? = null, q: String? = null, status: String? = null): CoursesSectionsListResult? {
        val query = buildQueryString(listOf(
            QueryParameterSpec("page", page, "form", true, false, null),
            QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            QueryParameterSpec("q", q, "form", true, false, null),
            QueryParameterSpec("status", status, "form", true, false, null)
        ))
        val raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/${serializePathParameter(courseId, PathParameterSpec("courseId", "simple", false))}/sections"), query))
        return client.convertValue(raw, object : TypeReference<CoursesSectionsListResult>() {})
    }

    /** Admin Course Section Create */
    suspend fun coursesSectionsCreate(courseId: String, body: AdminCourseSectionMutationRequest, xRequestId: String? = null): CoursesSectionsCreateResult? {
        val requestHeaders = buildRequestHeaders(
            mapOf(
                "X-Request-Id" to HeaderParameterSpec(xRequestId, "simple", false, null),
            ),
            emptyMap()
        )
        val raw = client.post(ApiPaths.backendPath("/content/courses/${serializePathParameter(courseId, PathParameterSpec("courseId", "simple", false))}/sections"), body, null, requestHeaders, "application/json")
        return client.convertValue(raw, object : TypeReference<CoursesSectionsCreateResult>() {})
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

    private data class HeaderParameterSpec(val value: Any?, val style: String, val explode: Boolean, val contentType: String?)

    private val headerObjectMapper = ObjectMapper().registerKotlinModule()

    private fun buildRequestHeaders(headers: Map<String, HeaderParameterSpec>, cookies: Map<String, HeaderParameterSpec>): Map<String, String>? {
        val requestHeaders = linkedMapOf<String, String>()
        headers.forEach { (name, parameter) ->
            serializeParameterValue(parameter)?.let { requestHeaders[name] = it }
        }

        val cookieHeader = buildCookieHeader(cookies)
        if (cookieHeader.isNotEmpty()) {
            requestHeaders["Cookie"] = requestHeaders["Cookie"]?.let { "$it; $cookieHeader" } ?: cookieHeader
        }

        return requestHeaders.takeIf { it.isNotEmpty() }
    }

    private fun buildCookieHeader(cookies: Map<String, HeaderParameterSpec>): String {
        return cookies.mapNotNull { (name, parameter) ->
            serializeParameterValue(parameter)?.let {
                java.net.URLEncoder.encode(name, java.nio.charset.StandardCharsets.UTF_8) + "=" +
                    java.net.URLEncoder.encode(it, java.nio.charset.StandardCharsets.UTF_8)
            }
        }.joinToString("; ")
    }

    private fun serializeParameterValue(parameter: HeaderParameterSpec?): String? {
        val value = parameter?.value ?: return null
        if (!parameter.contentType.isNullOrBlank()) {
            return headerObjectMapper.writeValueAsString(value)
        }
        return when (value) {
            is Iterable<*> -> value.mapNotNull { it?.toString() }.joinToString(",")
            is Map<*, *> -> value.mapNotNull { (key, item) ->
                if (item == null) {
                    null
                } else if (parameter.explode) {
                    "$key=$item"
                } else {
                    listOf(key.toString(), item.toString()).joinToString(",")
                }
            }.joinToString(",")
            else -> value.toString()
        }
    }
}
