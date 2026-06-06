package com.sdkwork.clawrouter.backend.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.backend.http.HttpClient;
import com.sdkwork.clawrouter.backend.model.*;
import java.util.List;
import java.util.Map;

public class ContentApi {
    private final HttpClient client;

    public ContentApi(HttpClient client) {
        this.client = client;
    }

    /** List announcements */
    public AnnouncementsListResult announcementsList() throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/content/announcements"));
        return client.convertValue(raw, new TypeReference<AnnouncementsListResult>() {});
    }

    /** Create announcement */
    public AnnouncementsCreateResult announcementsCreate(AdminAnnouncementCreateRequest body) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/content/announcements"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<AnnouncementsCreateResult>() {});
    }

    /** Delete announcement */
    public AnnouncementsDeleteResult announcementsDelete(String announcementId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/content/announcements/" + serializePathParameter(announcementId, new PathParameterSpec("announcementId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<AnnouncementsDeleteResult>() {});
    }

    /** Update announcement */
    public AnnouncementsUpdateResult announcementsUpdate(String announcementId, AdminAnnouncementUpdateRequest body) throws Exception {
        Object raw = client.patch(ApiPaths.backendPath("/content/announcements/" + serializePathParameter(announcementId, new PathParameterSpec("announcementId", "simple", false)) + ""), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<AnnouncementsUpdateResult>() {});
    }

    /** Admin Course Applications List */
    public CourseApplicationsListResult courseApplicationsList(String page, String pageSize, String q, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/course-applications"), query));
        return client.convertValue(raw, new TypeReference<CourseApplicationsListResult>() {});
    }

    /** Admin Course Application Review */
    public CourseApplicationsReviewResult courseApplicationsReview(String applicationId, AdminCourseApplicationReviewRequest body) throws Exception {
        Object raw = client.patch(ApiPaths.backendPath("/content/course-applications/" + serializePathParameter(applicationId, new PathParameterSpec("applicationId", "simple", false)) + "/review"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<CourseApplicationsReviewResult>() {});
    }

    /** Admin Course Lesson Delete */
    public CourseLessonsDeleteResult courseLessonsDelete(String lessonId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/content/course-lessons/" + serializePathParameter(lessonId, new PathParameterSpec("lessonId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CourseLessonsDeleteResult>() {});
    }

    /** Admin Course Lesson Update */
    public CourseLessonsUpdateResult courseLessonsUpdate(String lessonId, AdminCourseLessonMutationRequest body) throws Exception {
        Object raw = client.patch(ApiPaths.backendPath("/content/course-lessons/" + serializePathParameter(lessonId, new PathParameterSpec("lessonId", "simple", false)) + ""), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<CourseLessonsUpdateResult>() {});
    }

    /** Admin Course Section Delete */
    public CourseSectionsDeleteResult courseSectionsDelete(String sectionId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/content/course-sections/" + serializePathParameter(sectionId, new PathParameterSpec("sectionId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CourseSectionsDeleteResult>() {});
    }

    /** Admin Course Section Update */
    public CourseSectionsUpdateResult courseSectionsUpdate(String sectionId, AdminCourseSectionMutationRequest body) throws Exception {
        Object raw = client.patch(ApiPaths.backendPath("/content/course-sections/" + serializePathParameter(sectionId, new PathParameterSpec("sectionId", "simple", false)) + ""), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<CourseSectionsUpdateResult>() {});
    }

    /** Admin Courses List */
    public CoursesListResult coursesList(String page, String pageSize, String q, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses"), query));
        return client.convertValue(raw, new TypeReference<CoursesListResult>() {});
    }

    /** Admin Course Create */
    public CoursesCreateResult coursesCreate(AdminCourseMutationRequest body) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/content/courses"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<CoursesCreateResult>() {});
    }

    /** Admin Course Comments List */
    public CourseCommentsListResult courseCommentsList(String page, String pageSize, String q, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/comments"), query));
        return client.convertValue(raw, new TypeReference<CourseCommentsListResult>() {});
    }

    /** Admin Course Comment Moderate */
    public CourseCommentsModerateResult courseCommentsModerate(String commentId, AdminCourseCommentModerationRequest body) throws Exception {
        Object raw = client.patch(ApiPaths.backendPath("/content/courses/comments/" + serializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false)) + "/moderation"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<CourseCommentsModerateResult>() {});
    }

    /** Course Dashboard Retrieve */
    public CoursesDashboardRetrieveResult coursesDashboardRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.backendPath("/content/courses/dashboard"));
        return client.convertValue(raw, new TypeReference<CoursesDashboardRetrieveResult>() {});
    }

    /** Admin Course Engagement List */
    public CourseEngagementListResult courseEngagementList(String page, String pageSize, String q, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/engagement"), query));
        return client.convertValue(raw, new TypeReference<CourseEngagementListResult>() {});
    }

    /** Admin Course Delete */
    public CoursesDeleteResult coursesDelete(String courseId) throws Exception {
        Object raw = client.delete(ApiPaths.backendPath("/content/courses/" + serializePathParameter(courseId, new PathParameterSpec("courseId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CoursesDeleteResult>() {});
    }

    /** Admin Course Update */
    public CoursesUpdateResult coursesUpdate(String courseId, AdminCourseMutationRequest body) throws Exception {
        Object raw = client.patch(ApiPaths.backendPath("/content/courses/" + serializePathParameter(courseId, new PathParameterSpec("courseId", "simple", false)) + ""), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<CoursesUpdateResult>() {});
    }

    /** Admin Course Lessons List */
    public CoursesLessonsListResult coursesLessonsList(String courseId, String page, String pageSize, String q, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/" + serializePathParameter(courseId, new PathParameterSpec("courseId", "simple", false)) + "/lessons"), query));
        return client.convertValue(raw, new TypeReference<CoursesLessonsListResult>() {});
    }

    /** Admin Course Lesson Create */
    public CoursesLessonsCreateResult coursesLessonsCreate(String courseId, AdminCourseLessonMutationRequest body) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/content/courses/" + serializePathParameter(courseId, new PathParameterSpec("courseId", "simple", false)) + "/lessons"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<CoursesLessonsCreateResult>() {});
    }

    /** Admin Course Relations List */
    public CoursesRelationsListResult coursesRelationsList(String courseId, String page, String pageSize, String q, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/" + serializePathParameter(courseId, new PathParameterSpec("courseId", "simple", false)) + "/relations"), query));
        return client.convertValue(raw, new TypeReference<CoursesRelationsListResult>() {});
    }

    /** Admin Course Relations Replace */
    public CoursesRelationsReplaceResult coursesRelationsReplace(String courseId, AdminCourseRelationsReplaceRequest body) throws Exception {
        Object raw = client.put(ApiPaths.backendPath("/content/courses/" + serializePathParameter(courseId, new PathParameterSpec("courseId", "simple", false)) + "/relations"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<CoursesRelationsReplaceResult>() {});
    }

    /** Admin Course Sections List */
    public CoursesSectionsListResult coursesSectionsList(String courseId, String page, String pageSize, String q, String status) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("status", status, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/" + serializePathParameter(courseId, new PathParameterSpec("courseId", "simple", false)) + "/sections"), query));
        return client.convertValue(raw, new TypeReference<CoursesSectionsListResult>() {});
    }

    /** Admin Course Section Create */
    public CoursesSectionsCreateResult coursesSectionsCreate(String courseId, AdminCourseSectionMutationRequest body) throws Exception {
        Object raw = client.post(ApiPaths.backendPath("/content/courses/" + serializePathParameter(courseId, new PathParameterSpec("courseId", "simple", false)) + "/sections"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<CoursesSectionsCreateResult>() {});
    }

    private record PathParameterSpec(String name, String style, boolean explode) {}

    private static String serializePathParameter(Object value, PathParameterSpec spec) {
        if (value == null) {
            return "";
        }
        String style = spec.style() == null || spec.style().isBlank() ? "simple" : spec.style();
        if (value instanceof Iterable<?> iterable) {
            return serializePathArray(spec.name(), iterable, style, spec.explode());
        }
        if (value instanceof Map<?, ?> map) {
            return serializePathObject(spec.name(), map, style, spec.explode());
        }
        return pathPrimitivePrefix(spec.name(), style) + pathEncode(String.valueOf(value));
    }

    private static String serializePathArray(String name, Iterable<?> values, String style, boolean explode) {
        List<String> serialized = new java.util.ArrayList<>();
        for (Object item : values) {
            if (item != null) {
                serialized.add(pathEncode(String.valueOf(item)));
            }
        }
        if (serialized.isEmpty()) {
            return pathPrefix(name, style);
        }
        if ("matrix".equals(style)) {
            if (explode) {
                List<String> parts = new java.util.ArrayList<>();
                for (String item : serialized) {
                    parts.add(";" + name + "=" + item);
                }
                return String.join("", parts);
            }
            return ";" + name + "=" + String.join(",", serialized);
        }
        String separator = explode ? "." : ",";
        return pathPrefix(name, style) + String.join(separator, serialized);
    }

    private static String serializePathObject(String name, Map<?, ?> values, String style, boolean explode) {
        List<String> entries = new java.util.ArrayList<>();
        List<String> exploded = new java.util.ArrayList<>();
        values.forEach((key, value) -> {
            if (value == null) {
                return;
            }
            String escapedKey = pathEncode(String.valueOf(key));
            String escapedValue = pathEncode(String.valueOf(value));
            if (explode) {
                if ("matrix".equals(style)) {
                    exploded.add(";" + escapedKey + "=" + escapedValue);
                } else {
                    exploded.add(escapedKey + "=" + escapedValue);
                }
            } else {
                entries.add(escapedKey);
                entries.add(escapedValue);
            }
        });
        if ("matrix".equals(style)) {
            if (explode) {
                return String.join("", exploded);
            }
            return ";" + name + "=" + String.join(",", entries);
        }
        if (explode) {
            String separator = "label".equals(style) ? "." : ",";
            return pathPrefix(name, style) + String.join(separator, exploded);
        }
        return pathPrefix(name, style) + String.join(",", entries);
    }

    private static String pathPrefix(String name, String style) {
        if ("label".equals(style)) {
            return ".";
        }
        if ("matrix".equals(style)) {
            return ";" + name;
        }
        return "";
    }

    private static String pathPrimitivePrefix(String name, String style) {
        if ("matrix".equals(style)) {
            return ";" + name + "=";
        }
        return pathPrefix(name, style);
    }

    private static String pathEncode(String value) {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8).replace("+", "%20");
    }

    private record QueryParameterSpec(String name, Object value, String style, boolean explode, boolean allowReserved, String contentType) {}

    private static String buildQueryString(List<QueryParameterSpec> parameters) throws Exception {
        List<String> pairs = new java.util.ArrayList<>();
        for (QueryParameterSpec parameter : parameters) {
            appendSerializedParameter(pairs, parameter);
        }
        return String.join("&", pairs);
    }

    private static void appendSerializedParameter(List<String> pairs, QueryParameterSpec parameter) throws Exception {
        if (parameter.value() == null) {
            return;
        }
        if (parameter.contentType() != null && !parameter.contentType().isBlank()) {
            String json = clientObjectMapper().writeValueAsString(parameter.value());
            pairs.add(urlEncode(parameter.name()) + "=" + encodeQueryValue(json, parameter.allowReserved()));
            return;
        }

        String style = parameter.style() == null || parameter.style().isBlank() ? "form" : parameter.style();
        Object value = parameter.value();
        if ("deepObject".equals(style) && value instanceof Map<?, ?> map) {
            appendDeepObjectParameter(pairs, parameter.name(), map, parameter.allowReserved());
        } else if (value instanceof Iterable<?> iterable) {
            appendArrayParameter(pairs, parameter.name(), iterable, style, parameter.explode(), parameter.allowReserved());
        } else if (value instanceof Map<?, ?> map) {
            appendObjectParameter(pairs, parameter.name(), map, style, parameter.explode(), parameter.allowReserved());
        } else {
            pairs.add(urlEncode(parameter.name()) + "=" + encodeQueryValue(String.valueOf(value), parameter.allowReserved()));
        }
    }

    private static void appendArrayParameter(List<String> pairs, String name, Iterable<?> values, String style, boolean explode, boolean allowReserved) {
        List<String> serialized = new java.util.ArrayList<>();
        for (Object item : values) {
            if (item != null) {
                serialized.add(String.valueOf(item));
            }
        }
        if (serialized.isEmpty()) {
            return;
        }
        if ("form".equals(style) && explode) {
            for (String item : serialized) {
                pairs.add(urlEncode(name) + "=" + encodeQueryValue(item, allowReserved));
            }
            return;
        }
        pairs.add(urlEncode(name) + "=" + encodeQueryValue(String.join(",", serialized), allowReserved));
    }

    private static void appendObjectParameter(List<String> pairs, String name, Map<?, ?> values, String style, boolean explode, boolean allowReserved) {
        List<String> serialized = new java.util.ArrayList<>();
        values.forEach((key, value) -> {
            if (value == null) {
                return;
            }
            if ("form".equals(style) && explode) {
                pairs.add(urlEncode(String.valueOf(key)) + "=" + encodeQueryValue(String.valueOf(value), allowReserved));
            } else {
                serialized.add(String.valueOf(key));
                serialized.add(String.valueOf(value));
            }
        });
        if (!serialized.isEmpty()) {
            pairs.add(urlEncode(name) + "=" + encodeQueryValue(String.join(",", serialized), allowReserved));
        }
    }

    private static void appendDeepObjectParameter(List<String> pairs, String name, Map<?, ?> values, boolean allowReserved) {
        values.forEach((key, value) -> {
            if (value != null) {
                pairs.add(urlEncode(name + "[" + key + "]") + "=" + encodeQueryValue(String.valueOf(value), allowReserved));
            }
        });
    }

    private static String encodeQueryValue(String value, boolean allowReserved) {
        String encoded = urlEncode(value);
        if (!allowReserved) {
            return encoded;
        }
        return encoded
            .replace("%3A", ":").replace("%2F", "/").replace("%3F", "?").replace("%23", "#")
            .replace("%5B", "[").replace("%5D", "]").replace("%40", "@").replace("%21", "!")
            .replace("%24", "$").replace("%26", "&").replace("%27", "'").replace("%28", "(")
            .replace("%29", ")").replace("%2A", "*").replace("%2B", "+").replace("%2C", ",")
            .replace("%3B", ";").replace("%3D", "=");
    }

    private static com.fasterxml.jackson.databind.ObjectMapper clientObjectMapper() {
        return new com.fasterxml.jackson.databind.ObjectMapper();
    }


    private static String urlEncode(String value) {
        return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8);
    }
}
