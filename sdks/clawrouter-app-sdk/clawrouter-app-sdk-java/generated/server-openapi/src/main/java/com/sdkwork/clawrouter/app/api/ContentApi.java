package com.sdkwork.clawrouter.app.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.sdkwork.clawrouter.app.http.HttpClient;
import com.sdkwork.clawrouter.app.model.*;
import java.util.List;
import java.util.Map;

public class ContentApi {
    private final HttpClient client;

    public ContentApi(HttpClient client) {
        this.client = client;
    }

    /** List forum comments */
    public CommentsListResult commentsList(String contentType, Integer contentId, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("content_type", contentType, "form", true, false, null),
            new QueryParameterSpec("content_id", contentId, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/comments"), query));
        return client.convertValue(raw, new TypeReference<CommentsListResult>() {});
    }

    /** Create forum comment */
    public CommentsCreateResult commentsCreate(ForumCreateCommentRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/content/comments"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<CommentsCreateResult>() {});
    }

    /** List forum comment statistics */
    public CommentsStatisticsListResult commentsStatisticsList(String contentType, Integer contentId) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("content_type", contentType, "form", true, false, null),
            new QueryParameterSpec("content_id", contentId, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/comments/statistics"), query));
        return client.convertValue(raw, new TypeReference<CommentsStatisticsListResult>() {});
    }

    /** Delete forum comment */
    public CommentsDeleteResult commentsDelete(String commentId) throws Exception {
        Object raw = client.delete(ApiPaths.appPath("/content/comments/" + serializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CommentsDeleteResult>() {});
    }

    /** List forum comment detail */
    public CommentsRetrieveResult commentsRetrieve(String commentId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/content/comments/" + serializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CommentsRetrieveResult>() {});
    }

    /** Like forum comment */
    public CommentsLikesCreateResult commentsLikesCreate(String commentId) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/content/comments/" + serializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false)) + "/likes"), null);
        return client.convertValue(raw, new TypeReference<CommentsLikesCreateResult>() {});
    }

    /** Unlike forum comment */
    public CommentsLikesCurrentDeleteResult commentsLikesCurrentDelete(String commentId) throws Exception {
        Object raw = client.delete(ApiPaths.appPath("/content/comments/" + serializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false)) + "/likes/current"));
        return client.convertValue(raw, new TypeReference<CommentsLikesCurrentDeleteResult>() {});
    }

    /** Pin forum comment */
    public CommentsPinsCreateResult commentsPinsCreate(String commentId) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/content/comments/" + serializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false)) + "/pins"), null);
        return client.convertValue(raw, new TypeReference<CommentsPinsCreateResult>() {});
    }

    /** Unpin forum comment */
    public CommentsPinsCurrentDeleteResult commentsPinsCurrentDelete(String commentId) throws Exception {
        Object raw = client.delete(ApiPaths.appPath("/content/comments/" + serializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false)) + "/pins/current"));
        return client.convertValue(raw, new TypeReference<CommentsPinsCurrentDeleteResult>() {});
    }

    /** List forum comment replies */
    public CommentsRepliesListResult commentsRepliesList(String commentId, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/comments/" + serializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false)) + "/replies"), query));
        return client.convertValue(raw, new TypeReference<CommentsRepliesListResult>() {});
    }

    /** Reply forum comment */
    public CommentsReplyCreateResult commentsReplyCreate(String commentId, ForumReplyCommentRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/content/comments/" + serializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false)) + "/reply"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<CommentsReplyCreateResult>() {});
    }

    /** List forum feeds */
    public FeedsListResult feedsList(String type, String contentType, String q, Integer authorId, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("type", type, "form", true, false, null),
            new QueryParameterSpec("content_type", contentType, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("author_id", authorId, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds"), query));
        return client.convertValue(raw, new TypeReference<FeedsListResult>() {});
    }

    /** Create forum feed */
    public FeedsCreateResult feedsCreate(ForumCreateFeedRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/content/feeds"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<FeedsCreateResult>() {});
    }

    /** List category forum feeds */
    public FeedsCategoryRetrieveResult feedsCategoryRetrieve(String categoryId, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/category/" + serializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false)) + ""), query));
        return client.convertValue(raw, new TypeReference<FeedsCategoryRetrieveResult>() {});
    }

    /** List hot forum feeds */
    public FeedsHotListResult feedsHotList(Integer limit) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("limit", limit, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/hot"), query));
        return client.convertValue(raw, new TypeReference<FeedsHotListResult>() {});
    }

    /** List most liked forum feeds */
    public FeedsMostLikedListResult feedsMostLikedList(Integer limit) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("limit", limit, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/most_liked"), query));
        return client.convertValue(raw, new TypeReference<FeedsMostLikedListResult>() {});
    }

    /** List most viewed forum feeds */
    public FeedsMostViewedListResult feedsMostViewedList(Integer limit) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("limit", limit, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/most_viewed"), query));
        return client.convertValue(raw, new TypeReference<FeedsMostViewedListResult>() {});
    }

    /** List forum overview */
    public FeedsOverviewRetrieveResult feedsOverviewRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/content/feeds/overview"));
        return client.convertValue(raw, new TypeReference<FeedsOverviewRetrieveResult>() {});
    }

    /** List recommended forum feeds */
    public FeedsRecommendListResult feedsRecommendList(Integer limit) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("limit", limit, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/recommend"), query));
        return client.convertValue(raw, new TypeReference<FeedsRecommendListResult>() {});
    }

    /** List top forum feeds */
    public FeedsTopListResult feedsTopList(Integer limit) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("limit", limit, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/top"), query));
        return client.convertValue(raw, new TypeReference<FeedsTopListResult>() {});
    }

    /** Delete forum feed */
    public FeedsDeleteResult feedsDelete(String id) throws Exception {
        Object raw = client.delete(ApiPaths.appPath("/content/feeds/" + serializePathParameter(id, new PathParameterSpec("id", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<FeedsDeleteResult>() {});
    }

    /** List forum feed detail */
    public FeedsRetrieveResult feedsRetrieve(String id) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/content/feeds/" + serializePathParameter(id, new PathParameterSpec("id", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<FeedsRetrieveResult>() {});
    }

    /** Collect forum feed */
    public FeedsCollectionsCreateResult feedsCollectionsCreate(String id, Integer folderId) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("folder_id", folderId, "form", true, false, null)
        ));
        Object raw = client.post(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/" + serializePathParameter(id, new PathParameterSpec("id", "simple", false)) + "/collections"), query), null);
        return client.convertValue(raw, new TypeReference<FeedsCollectionsCreateResult>() {});
    }

    /** Uncollect forum feed */
    public FeedsCollectionsCurrentDeleteResult feedsCollectionsCurrentDelete(String id) throws Exception {
        Object raw = client.delete(ApiPaths.appPath("/content/feeds/" + serializePathParameter(id, new PathParameterSpec("id", "simple", false)) + "/collections/current"));
        return client.convertValue(raw, new TypeReference<FeedsCollectionsCurrentDeleteResult>() {});
    }

    /** Check forum feed collected */
    public FeedsCollectionsCurrentRetrieveResult feedsCollectionsCurrentRetrieve(String id) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/content/feeds/" + serializePathParameter(id, new PathParameterSpec("id", "simple", false)) + "/collections/current"));
        return client.convertValue(raw, new TypeReference<FeedsCollectionsCurrentRetrieveResult>() {});
    }

    /** Like forum feed */
    public FeedsLikesCreateResult feedsLikesCreate(String id) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/content/feeds/" + serializePathParameter(id, new PathParameterSpec("id", "simple", false)) + "/likes"), null);
        return client.convertValue(raw, new TypeReference<FeedsLikesCreateResult>() {});
    }

    /** Unlike forum feed */
    public FeedsLikesCurrentDeleteResult feedsLikesCurrentDelete(String id) throws Exception {
        Object raw = client.delete(ApiPaths.appPath("/content/feeds/" + serializePathParameter(id, new PathParameterSpec("id", "simple", false)) + "/likes/current"));
        return client.convertValue(raw, new TypeReference<FeedsLikesCurrentDeleteResult>() {});
    }

    /** Share forum feed */
    public FeedsSharesCreateResult feedsSharesCreate(String id) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/content/feeds/" + serializePathParameter(id, new PathParameterSpec("id", "simple", false)) + "/shares"), null);
        return client.convertValue(raw, new TypeReference<FeedsSharesCreateResult>() {});
    }

    /** List my forum comments */
    public UsersCurrentCommentsListResult usersCurrentCommentsList(Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/users/current/comments"), query));
        return client.convertValue(raw, new TypeReference<UsersCurrentCommentsListResult>() {});
    }

    /** List courses */
    public CoursesListResult coursesList(Integer level, String category, String q, Integer page, Integer pageSize) throws Exception {
        String query = buildQueryString(List.of(
            new QueryParameterSpec("level", level, "form", true, false, null),
            new QueryParameterSpec("category", category, "form", true, false, null),
            new QueryParameterSpec("q", q, "form", true, false, null),
            new QueryParameterSpec("page", page, "form", true, false, null),
            new QueryParameterSpec("page_size", pageSize, "form", true, false, null)
        ));
        Object raw = client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/courses"), query));
        return client.convertValue(raw, new TypeReference<CoursesListResult>() {});
    }

    /** Create course application */
    public ApplicationsCreateResult applicationsCreate(CourseApplicationCreateRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/courses/applications"), body, null, null, "application/json");
        return client.convertValue(raw, new TypeReference<ApplicationsCreateResult>() {});
    }

    /** Upload course application video */
    public ApplicationsVideosCreateResult applicationsVideosCreate(CourseApplicationVideoUploadRequest body) throws Exception {
        Object raw = client.post(ApiPaths.appPath("/courses/applications/videos"), body, null, null, "multipart/form-data");
        return client.convertValue(raw, new TypeReference<ApplicationsVideosCreateResult>() {});
    }

    /** List course categories */
    public CoursesCategoriesListResult coursesCategoriesList() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/courses/categories"));
        return client.convertValue(raw, new TypeReference<CoursesCategoriesListResult>() {});
    }

    /** List course overview */
    public CoursesOverviewRetrieveResult coursesOverviewRetrieve() throws Exception {
        Object raw = client.get(ApiPaths.appPath("/courses/overview"));
        return client.convertValue(raw, new TypeReference<CoursesOverviewRetrieveResult>() {});
    }

    /** List course detail */
    public CoursesRetrieveResult coursesRetrieve(String courseId) throws Exception {
        Object raw = client.get(ApiPaths.appPath("/courses/" + serializePathParameter(courseId, new PathParameterSpec("courseId", "simple", false)) + ""));
        return client.convertValue(raw, new TypeReference<CoursesRetrieveResult>() {});
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
