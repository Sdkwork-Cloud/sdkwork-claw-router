import Foundation

public class ContentApi {
    private let client: HttpClient

    public init(client: HttpClient) {
        self.client = client
    }

    /// List announcements
    public func announcementsList() async throws -> AnnouncementsListResult? {
        return try await client.get(ApiPaths.backendPath("/content/announcements"), responseType: AnnouncementsListResult.self)
    }

    /// Create announcement
    public func announcementsCreate(body: AdminAnnouncementCreateRequest) async throws -> AnnouncementsCreateResult? {
        return try await client.post(ApiPaths.backendPath("/content/announcements"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: AnnouncementsCreateResult.self)
    }

    /// Delete announcement
    public func announcementsDelete(announcementId: String) async throws -> AnnouncementsDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/content/announcements/\(serializePathParameter(announcementId, PathParameterSpec(name: "announcementId", style: "simple", explode: false)))"), responseType: AnnouncementsDeleteResult.self)
    }

    /// Update announcement
    public func announcementsUpdate(announcementId: String, body: AdminAnnouncementUpdateRequest) async throws -> AnnouncementsUpdateResult? {
        return try await client.patch(ApiPaths.backendPath("/content/announcements/\(serializePathParameter(announcementId, PathParameterSpec(name: "announcementId", style: "simple", explode: false)))"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: AnnouncementsUpdateResult.self)
    }

    /// Admin Course Applications List
    public func courseApplicationsList(page: String? = nil, pageSize: String? = nil, q: String? = nil, status: String? = nil) async throws -> CourseApplicationsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/course-applications"), query), responseType: CourseApplicationsListResult.self)
    }

    /// Admin Course Application Review
    public func courseApplicationsReview(applicationId: String, body: AdminCourseApplicationReviewRequest) async throws -> CourseApplicationsReviewResult? {
        return try await client.patch(ApiPaths.backendPath("/content/course-applications/\(serializePathParameter(applicationId, PathParameterSpec(name: "applicationId", style: "simple", explode: false)))/review"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: CourseApplicationsReviewResult.self)
    }

    /// Admin Course Lesson Delete
    public func courseLessonsDelete(lessonId: String) async throws -> CourseLessonsDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/content/course-lessons/\(serializePathParameter(lessonId, PathParameterSpec(name: "lessonId", style: "simple", explode: false)))"), responseType: CourseLessonsDeleteResult.self)
    }

    /// Admin Course Lesson Update
    public func courseLessonsUpdate(lessonId: String, body: AdminCourseLessonMutationRequest) async throws -> CourseLessonsUpdateResult? {
        return try await client.patch(ApiPaths.backendPath("/content/course-lessons/\(serializePathParameter(lessonId, PathParameterSpec(name: "lessonId", style: "simple", explode: false)))"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: CourseLessonsUpdateResult.self)
    }

    /// Admin Course Section Delete
    public func courseSectionsDelete(sectionId: String) async throws -> CourseSectionsDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/content/course-sections/\(serializePathParameter(sectionId, PathParameterSpec(name: "sectionId", style: "simple", explode: false)))"), responseType: CourseSectionsDeleteResult.self)
    }

    /// Admin Course Section Update
    public func courseSectionsUpdate(sectionId: String, body: AdminCourseSectionMutationRequest) async throws -> CourseSectionsUpdateResult? {
        return try await client.patch(ApiPaths.backendPath("/content/course-sections/\(serializePathParameter(sectionId, PathParameterSpec(name: "sectionId", style: "simple", explode: false)))"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: CourseSectionsUpdateResult.self)
    }

    /// Admin Courses List
    public func coursesList(page: String? = nil, pageSize: String? = nil, q: String? = nil, status: String? = nil) async throws -> CoursesListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses"), query), responseType: CoursesListResult.self)
    }

    /// Admin Course Create
    public func coursesCreate(body: AdminCourseMutationRequest) async throws -> CoursesCreateResult? {
        return try await client.post(ApiPaths.backendPath("/content/courses"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: CoursesCreateResult.self)
    }

    /// Admin Course Comments List
    public func courseCommentsList(page: String? = nil, pageSize: String? = nil, q: String? = nil, status: String? = nil) async throws -> CourseCommentsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/comments"), query), responseType: CourseCommentsListResult.self)
    }

    /// Admin Course Comment Moderate
    public func courseCommentsModerate(commentId: String, body: AdminCourseCommentModerationRequest) async throws -> CourseCommentsModerateResult? {
        return try await client.patch(ApiPaths.backendPath("/content/courses/comments/\(serializePathParameter(commentId, PathParameterSpec(name: "commentId", style: "simple", explode: false)))/moderation"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: CourseCommentsModerateResult.self)
    }

    /// Course Dashboard Retrieve
    public func coursesDashboardRetrieve() async throws -> CoursesDashboardRetrieveResult? {
        return try await client.get(ApiPaths.backendPath("/content/courses/dashboard"), responseType: CoursesDashboardRetrieveResult.self)
    }

    /// Admin Course Engagement List
    public func courseEngagementList(page: String? = nil, pageSize: String? = nil, q: String? = nil, status: String? = nil) async throws -> CourseEngagementListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/engagement"), query), responseType: CourseEngagementListResult.self)
    }

    /// Admin Course Delete
    public func coursesDelete(courseId: String) async throws -> CoursesDeleteResult? {
        return try await client.delete(ApiPaths.backendPath("/content/courses/\(serializePathParameter(courseId, PathParameterSpec(name: "courseId", style: "simple", explode: false)))"), responseType: CoursesDeleteResult.self)
    }

    /// Admin Course Update
    public func coursesUpdate(courseId: String, body: AdminCourseMutationRequest) async throws -> CoursesUpdateResult? {
        return try await client.patch(ApiPaths.backendPath("/content/courses/\(serializePathParameter(courseId, PathParameterSpec(name: "courseId", style: "simple", explode: false)))"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: CoursesUpdateResult.self)
    }

    /// Admin Course Lessons List
    public func coursesLessonsList(courseId: String, page: String? = nil, pageSize: String? = nil, q: String? = nil, status: String? = nil) async throws -> CoursesLessonsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/\(serializePathParameter(courseId, PathParameterSpec(name: "courseId", style: "simple", explode: false)))/lessons"), query), responseType: CoursesLessonsListResult.self)
    }

    /// Admin Course Lesson Create
    public func coursesLessonsCreate(courseId: String, body: AdminCourseLessonMutationRequest) async throws -> CoursesLessonsCreateResult? {
        return try await client.post(ApiPaths.backendPath("/content/courses/\(serializePathParameter(courseId, PathParameterSpec(name: "courseId", style: "simple", explode: false)))/lessons"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: CoursesLessonsCreateResult.self)
    }

    /// Admin Course Relations List
    public func coursesRelationsList(courseId: String, page: String? = nil, pageSize: String? = nil, q: String? = nil, status: String? = nil) async throws -> CoursesRelationsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/\(serializePathParameter(courseId, PathParameterSpec(name: "courseId", style: "simple", explode: false)))/relations"), query), responseType: CoursesRelationsListResult.self)
    }

    /// Admin Course Relations Replace
    public func coursesRelationsReplace(courseId: String, body: AdminCourseRelationsReplaceRequest) async throws -> CoursesRelationsReplaceResult? {
        return try await client.put(ApiPaths.backendPath("/content/courses/\(serializePathParameter(courseId, PathParameterSpec(name: "courseId", style: "simple", explode: false)))/relations"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: CoursesRelationsReplaceResult.self)
    }

    /// Admin Course Sections List
    public func coursesSectionsList(courseId: String, page: String? = nil, pageSize: String? = nil, q: String? = nil, status: String? = nil) async throws -> CoursesSectionsListResult? {
        let query = buildQueryString([
            QueryParameterSpec(name: "page", value: page, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "page_size", value: pageSize, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "q", value: q, style: "form", explode: true, allowReserved: false, contentType: nil),
            QueryParameterSpec(name: "status", value: status, style: "form", explode: true, allowReserved: false, contentType: nil)
        ])
        return try await client.get(ApiPaths.appendQueryString(ApiPaths.backendPath("/content/courses/\(serializePathParameter(courseId, PathParameterSpec(name: "courseId", style: "simple", explode: false)))/sections"), query), responseType: CoursesSectionsListResult.self)
    }

    /// Admin Course Section Create
    public func coursesSectionsCreate(courseId: String, body: AdminCourseSectionMutationRequest) async throws -> CoursesSectionsCreateResult? {
        return try await client.post(ApiPaths.backendPath("/content/courses/\(serializePathParameter(courseId, PathParameterSpec(name: "courseId", style: "simple", explode: false)))/sections"), body: body, params: nil, headers: nil, contentType: "application/json", responseType: CoursesSectionsCreateResult.self)
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
