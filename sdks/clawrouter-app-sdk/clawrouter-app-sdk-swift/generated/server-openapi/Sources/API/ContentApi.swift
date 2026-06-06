import Foundation

public class ContentApi {
    private let client: HttpClient

    public init(client: HttpClient) {
        self.client = client
    }

    /// List forum comments
    public func commentsList(contentType: String, contentId: String, page: String? = nil, pageSize: String? = nil) async throws -> CommentsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "content_type", value: contentType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "content_id", value: contentId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/comments"), query), responseType: CommentsListResult.self)
    }

    /// Create forum comment
    public func commentsCreate(body: ForumCreateCommentRequest) async throws -> CommentsCreateResult? {
        return try await client.post(ApiPaths.appPath("/content/comments"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: CommentsCreateResult.self)
    }

    /// List forum comment statistics
    public func commentsStatisticsList(contentType: String, contentId: String) async throws -> CommentsStatisticsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "content_type", value: contentType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "content_id", value: contentId, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/comments/statistics"), query), responseType: CommentsStatisticsListResult.self)
    }

    /// Delete forum comment
    public func commentsDelete(commentId: String) async throws -> CommentsDeleteResult? {
        return try await client.delete(ApiPaths.appPath("/content/comments/\(serializePathParameter(commentId, PathParameterSpec(name: "commentId", style: "simple", explode: false)))"), responseType: CommentsDeleteResult.self)
    }

    /// List forum comment detail
    public func commentsRetrieve(commentId: String) async throws -> CommentsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/content/comments/\(serializePathParameter(commentId, PathParameterSpec(name: "commentId", style: "simple", explode: false)))"), responseType: CommentsRetrieveResult.self)
    }

    /// Like forum comment
    public func commentsLikesCreate(commentId: String) async throws -> CommentsLikesCreateResult? {
        return try await client.post(ApiPaths.appPath("/content/comments/\(serializePathParameter(commentId, PathParameterSpec(name: "commentId", style: "simple", explode: false)))/likes"), body: nil, responseType: CommentsLikesCreateResult.self)
    }

    /// Unlike forum comment
    public func commentsLikesCurrentDelete(commentId: String) async throws -> CommentsLikesCurrentDeleteResult? {
        return try await client.delete(ApiPaths.appPath("/content/comments/\(serializePathParameter(commentId, PathParameterSpec(name: "commentId", style: "simple", explode: false)))/likes/current"), responseType: CommentsLikesCurrentDeleteResult.self)
    }

    /// Pin forum comment
    public func commentsPinsCreate(commentId: String) async throws -> CommentsPinsCreateResult? {
        return try await client.post(ApiPaths.appPath("/content/comments/\(serializePathParameter(commentId, PathParameterSpec(name: "commentId", style: "simple", explode: false)))/pins"), body: nil, responseType: CommentsPinsCreateResult.self)
    }

    /// Unpin forum comment
    public func commentsPinsCurrentDelete(commentId: String) async throws -> CommentsPinsCurrentDeleteResult? {
        return try await client.delete(ApiPaths.appPath("/content/comments/\(serializePathParameter(commentId, PathParameterSpec(name: "commentId", style: "simple", explode: false)))/pins/current"), responseType: CommentsPinsCurrentDeleteResult.self)
    }

    /// List forum comment replies
    public func commentsRepliesList(commentId: String, page: String? = nil, pageSize: String? = nil) async throws -> CommentsRepliesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/comments/\(serializePathParameter(commentId, PathParameterSpec(name: "commentId", style: "simple", explode: false)))/replies"), query), responseType: CommentsRepliesListResult.self)
    }

    /// Reply forum comment
    public func commentsReplyCreate(commentId: String, body: ForumReplyCommentRequest) async throws -> CommentsReplyCreateResult? {
        return try await client.post(ApiPaths.appPath("/content/comments/\(serializePathParameter(commentId, PathParameterSpec(name: "commentId", style: "simple", explode: false)))/reply"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: CommentsReplyCreateResult.self)
    }

    /// List forum feeds
    public func feedsList(type: String? = nil, contentType: String? = nil, q: String? = nil, authorId: String? = nil, page: String? = nil, pageSize: String? = nil) async throws -> FeedsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "type", value: type, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "content_type", value: contentType, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "author_id", value: authorId, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds"), query), responseType: FeedsListResult.self)
    }

    /// Create forum feed
    public func feedsCreate(body: ForumCreateFeedRequest) async throws -> FeedsCreateResult? {
        return try await client.post(ApiPaths.appPath("/content/feeds"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: FeedsCreateResult.self)
    }

    /// List category forum feeds
    public func feedsCategoryRetrieve(categoryId: String, page: String? = nil, pageSize: String? = nil) async throws -> FeedsCategoryRetrieveResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/category/\(serializePathParameter(categoryId, PathParameterSpec(name: "categoryId", style: "simple", explode: false)))"), query), responseType: FeedsCategoryRetrieveResult.self)
    }

    /// List hot forum feeds
    public func feedsHotList(limit: String? = nil) async throws -> FeedsHotListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "limit", value: limit, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/hot"), query), responseType: FeedsHotListResult.self)
    }

    /// List most liked forum feeds
    public func feedsMostLikedList(limit: String? = nil) async throws -> FeedsMostLikedListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "limit", value: limit, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/most_liked"), query), responseType: FeedsMostLikedListResult.self)
    }

    /// List most viewed forum feeds
    public func feedsMostViewedList(limit: String? = nil) async throws -> FeedsMostViewedListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "limit", value: limit, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/most_viewed"), query), responseType: FeedsMostViewedListResult.self)
    }

    /// List forum overview
    public func feedsOverviewRetrieve() async throws -> FeedsOverviewRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/content/feeds/overview"), responseType: FeedsOverviewRetrieveResult.self)
    }

    /// List recommended forum feeds
    public func feedsRecommendList(limit: String? = nil) async throws -> FeedsRecommendListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "limit", value: limit, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/recommend"), query), responseType: FeedsRecommendListResult.self)
    }

    /// List top forum feeds
    public func feedsTopList(limit: String? = nil) async throws -> FeedsTopListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "limit", value: limit, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/top"), query), responseType: FeedsTopListResult.self)
    }

    /// Delete forum feed
    public func feedsDelete(id: String) async throws -> FeedsDeleteResult? {
        return try await client.delete(ApiPaths.appPath("/content/feeds/\(serializePathParameter(id, PathParameterSpec(name: "id", style: "simple", explode: false)))"), responseType: FeedsDeleteResult.self)
    }

    /// List forum feed detail
    public func feedsRetrieve(id: String) async throws -> FeedsRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/content/feeds/\(serializePathParameter(id, PathParameterSpec(name: "id", style: "simple", explode: false)))"), responseType: FeedsRetrieveResult.self)
    }

    /// Collect forum feed
    public func feedsCollectionsCreate(id: String, folderId: String? = nil) async throws -> FeedsCollectionsCreateResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "folder_id", value: folderId, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.post(ApiPaths.appendQueryString(ApiPaths.appPath("/content/feeds/\(serializePathParameter(id, PathParameterSpec(name: "id", style: "simple", explode: false)))/collections"), query), body: nil, responseType: FeedsCollectionsCreateResult.self)
    }

    /// Uncollect forum feed
    public func feedsCollectionsCurrentDelete(id: String) async throws -> FeedsCollectionsCurrentDeleteResult? {
        return try await client.delete(ApiPaths.appPath("/content/feeds/\(serializePathParameter(id, PathParameterSpec(name: "id", style: "simple", explode: false)))/collections/current"), responseType: FeedsCollectionsCurrentDeleteResult.self)
    }

    /// Check forum feed collected
    public func feedsCollectionsCurrentRetrieve(id: String) async throws -> FeedsCollectionsCurrentRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/content/feeds/\(serializePathParameter(id, PathParameterSpec(name: "id", style: "simple", explode: false)))/collections/current"), responseType: FeedsCollectionsCurrentRetrieveResult.self)
    }

    /// Like forum feed
    public func feedsLikesCreate(id: String) async throws -> FeedsLikesCreateResult? {
        return try await client.post(ApiPaths.appPath("/content/feeds/\(serializePathParameter(id, PathParameterSpec(name: "id", style: "simple", explode: false)))/likes"), body: nil, responseType: FeedsLikesCreateResult.self)
    }

    /// Unlike forum feed
    public func feedsLikesCurrentDelete(id: String) async throws -> FeedsLikesCurrentDeleteResult? {
        return try await client.delete(ApiPaths.appPath("/content/feeds/\(serializePathParameter(id, PathParameterSpec(name: "id", style: "simple", explode: false)))/likes/current"), responseType: FeedsLikesCurrentDeleteResult.self)
    }

    /// Share forum feed
    public func feedsSharesCreate(id: String) async throws -> FeedsSharesCreateResult? {
        return try await client.post(ApiPaths.appPath("/content/feeds/\(serializePathParameter(id, PathParameterSpec(name: "id", style: "simple", explode: false)))/shares"), body: nil, responseType: FeedsSharesCreateResult.self)
    }

    /// List my forum comments
    public func usersCurrentCommentsList(page: String? = nil, pageSize: String? = nil) async throws -> UsersCurrentCommentsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/content/users/current/comments"), query), responseType: UsersCurrentCommentsListResult.self)
    }

    /// List courses
    public func coursesList(level: String? = nil, category: String? = nil, q: String? = nil, page: String? = nil, pageSize: String? = nil) async throws -> CoursesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "level", value: level, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "category", value: category, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.appPath("/courses"), query), responseType: CoursesListResult.self)
    }

    /// Create course application
    public func applicationsCreate(body: CourseApplicationCreateRequest) async throws -> ApplicationsCreateResult? {
        return try await client.post(ApiPaths.appPath("/courses/applications"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: ApplicationsCreateResult.self)
    }

    /// Upload course application video
    public func applicationsVideosCreate(body: CourseApplicationVideoUploadRequest) async throws -> ApplicationsVideosCreateResult? {
        return try await client.post(ApiPaths.appPath("/courses/applications/videos"), body: body, params: nil, headers: nil, contentType: "multipart/form-data", responseType: ApplicationsVideosCreateResult.self)
    }

    /// List course categories
    public func coursesCategoriesList() async throws -> CoursesCategoriesListResult? {
        return try await client.get(ApiPaths.appPath("/courses/categories"), responseType: CoursesCategoriesListResult.self)
    }

    /// List course overview
    public func coursesOverviewRetrieve() async throws -> CoursesOverviewRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/courses/overview"), responseType: CoursesOverviewRetrieveResult.self)
    }

    /// List course detail
    public func coursesRetrieve(courseId: String) async throws -> CoursesRetrieveResult? {
        return try await client.get(ApiPaths.appPath("/courses/\(serializePathParameter(courseId, PathParameterSpec(name: "courseId", style: "simple", explode: false)))"), responseType: CoursesRetrieveResult.self)
    }

    private struct PathParameterSpec {
        let name: String
        let style: String
        let explode: Bool
    }

    private func serializePathParameter(_ value: Any?, _ spec: PathParameterSpec) -> String {
        guard let value else { return "" }
        let style = spec.style.isEmpty ? "simple" : spec.style
        if let array = value as? [Any] {
            return serializePathArray(spec.name, array, style, spec.explode)
        }
        if let object = value as? [String: Any] {
            return serializePathObject(spec.name, object, style, spec.explode)
        }
        return pathPrimitivePrefix(spec.name, style) + pathEncode(String(describing: value))
    }

    private func serializePathArray(_ name: String, _ values: [Any], _ style: String, _ explode: Bool) -> String {
        let serialized = values.map { pathEncode(String(describing: $0)) }
        if serialized.isEmpty { return pathPrefix(name, style) }
        if style == "matrix" {
            if explode {
                return serialized.map { ";\(name)=\($0)" }.joined()
            }
            return ";\(name)=" + serialized.joined(separator: ",")
        }
        let separator = explode ? "." : ","
        return pathPrefix(name, style) + serialized.joined(separator: separator)
    }

    private func serializePathObject(_ name: String, _ values: [String: Any], _ style: String, _ explode: Bool) -> String {
        var entries: [String] = []
        var exploded: [String] = []
        for (key, value) in values {
            let escapedKey = pathEncode(key)
            let escapedValue = pathEncode(String(describing: value))
            if explode {
                if style == "matrix" {
                    exploded.append(";\(escapedKey)=\(escapedValue)")
                } else {
                    exploded.append("\(escapedKey)=\(escapedValue)")
                }
            } else {
                entries.append(escapedKey)
                entries.append(escapedValue)
            }
        }
        if style == "matrix" {
            if explode {
                return exploded.joined()
            }
            return ";\(name)=" + entries.joined(separator: ",")
        }
        if explode {
            let separator = style == "label" ? "." : ","
            return pathPrefix(name, style) + exploded.joined(separator: separator)
        }
        return pathPrefix(name, style) + entries.joined(separator: ",")
    }

    private func pathPrefix(_ name: String, _ style: String) -> String {
        if style == "label" { return "." }
        if style == "matrix" { return ";\(name)" }
        return ""
    }

    private func pathPrimitivePrefix(_ name: String, _ style: String) -> String {
        style == "matrix" ? ";\(name)=" : pathPrefix(name, style)
    }

    private func pathEncode(_ value: String) -> String {
        value.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? value
    }

    private struct QueryParameterSpec {
        let name: String
        let value: Any?
        let style: String
        let explode: Bool
        let allowReserved: Bool
        let contentType: String?
    }

    private func buildQueryString(_ parameters: [QueryParameterSpec]) -> String {
        var pairs: [String] = []
        for parameter in parameters {
            appendSerializedParameter(&pairs, parameter)
        }
        return pairs.joined(separator: "&")
    }

    private func appendSerializedParameter(_ pairs: inout [String], _ parameter: QueryParameterSpec) {
        guard let value = parameter.value else { return }
        if let contentType = parameter.contentType, !contentType.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            let data = (try? JSONSerialization.data(withJSONObject: value, options: [])) ?? Data(String(describing: value).utf8)
            let json = String(data: data, encoding: .utf8) ?? String(describing: value)
            pairs.append("\(urlEncode(parameter.name))=\(encodeQueryValue(json, allowReserved: parameter.allowReserved))")
            return
        }

        let style = parameter.style.isEmpty ? "form" : parameter.style
        if style == "deepObject", let object = value as? [String: Any] {
            appendDeepObjectParameter(&pairs, name: parameter.name, values: object, allowReserved: parameter.allowReserved)
        } else if let array = value as? [Any] {
            appendArrayParameter(&pairs, name: parameter.name, values: array, style: style, explode: parameter.explode, allowReserved: parameter.allowReserved)
        } else if let object = value as? [String: Any] {
            appendObjectParameter(&pairs, name: parameter.name, values: object, style: style, explode: parameter.explode, allowReserved: parameter.allowReserved)
        } else {
            pairs.append("\(urlEncode(parameter.name))=\(encodeQueryValue(String(describing: value), allowReserved: parameter.allowReserved))")
        }
    }

    private func appendArrayParameter(
        _ pairs: inout [String],
        name: String,
        values: [Any],
        style: String,
        explode: Bool,
        allowReserved: Bool
    ) {
        let serialized = values.map { String(describing: $0) }
        guard !serialized.isEmpty else { return }
        if style == "form" && explode {
            for item in serialized {
                pairs.append("\(urlEncode(name))=\(encodeQueryValue(item, allowReserved: allowReserved))")
            }
            return
        }
        pairs.append("\(urlEncode(name))=\(encodeQueryValue(serialized.joined(separator: ","), allowReserved: allowReserved))")
    }

    private func appendObjectParameter(
        _ pairs: inout [String],
        name: String,
        values: [String: Any],
        style: String,
        explode: Bool,
        allowReserved: Bool
    ) {
        var serialized: [String] = []
        for (key, value) in values {
            if style == "form" && explode {
                pairs.append("\(urlEncode(key))=\(encodeQueryValue(String(describing: value), allowReserved: allowReserved))")
            } else {
                serialized.append(key)
                serialized.append(String(describing: value))
            }
        }
        if !serialized.isEmpty {
            pairs.append("\(urlEncode(name))=\(encodeQueryValue(serialized.joined(separator: ","), allowReserved: allowReserved))")
        }
    }

    private func appendDeepObjectParameter(_ pairs: inout [String], name: String, values: [String: Any], allowReserved: Bool) {
        for (key, value) in values {
            pairs.append("\(urlEncode("\(name)[\(key)]"))=\(encodeQueryValue(String(describing: value), allowReserved: allowReserved))")
        }
    }

    private func encodeQueryValue(_ value: String, allowReserved: Bool) -> String {
        var encoded = urlEncode(value)
        if !allowReserved { return encoded }
        [
            "%3A": ":", "%2F": "/", "%3F": "?", "%23": "#",
            "%5B": "[", "%5D": "]", "%40": "@", "%21": "!",
            "%24": "$", "%26": "&", "%27": "'", "%28": "(",
            "%29": ")", "%2A": "*", "%2B": "+", "%2C": ",",
            "%3B": ";", "%3D": "=",
        ].forEach { encoded = encoded.replacingOccurrences(of: $0.key, with: $0.value) }
        return encoded
    }

    private func urlEncode(_ value: String) -> String {
        value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? value
    }

}
