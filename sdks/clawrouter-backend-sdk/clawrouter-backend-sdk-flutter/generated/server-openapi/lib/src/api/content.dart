import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class ContentApi {
  final HttpClient _client;

  ContentApi(this._client);

  /// List announcements
  Future<AnnouncementsListResult?> announcementsList() async {
    final response = await _client.get(ApiPaths.backendPath('/content/announcements'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AnnouncementsListResult.fromJson(map);
    })();
  }

  /// Create announcement
  Future<AnnouncementsCreateResult?> announcementsCreate(AdminAnnouncementCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/content/announcements'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AnnouncementsCreateResult.fromJson(map);
    })();
  }

  /// Delete announcement
  Future<AnnouncementsDeleteResult?> announcementsDelete(String announcementId) async {
    final response = await _client.delete(ApiPaths.backendPath('/content/announcements/${serializePathParameter(announcementId, const PathParameterSpec('announcementId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AnnouncementsDeleteResult.fromJson(map);
    })();
  }

  /// Update announcement
  Future<AnnouncementsUpdateResult?> announcementsUpdate(String announcementId, AdminAnnouncementUpdateRequest body) async {
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/content/announcements/${serializePathParameter(announcementId, const PathParameterSpec('announcementId', 'simple', false))}'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AnnouncementsUpdateResult.fromJson(map);
    })();
  }

  /// Admin Course Applications List
  Future<CourseApplicationsListResult?> courseApplicationsList([int? page, int? pageSize, String? q, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/content/course-applications'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CourseApplicationsListResult.fromJson(map);
    })();
  }

  /// Admin Course Application Review
  Future<CourseApplicationsReviewResult?> courseApplicationsReview(String applicationId, AdminCourseApplicationReviewRequest body) async {
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/content/course-applications/${serializePathParameter(applicationId, const PathParameterSpec('applicationId', 'simple', false))}/review'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CourseApplicationsReviewResult.fromJson(map);
    })();
  }

  /// Admin Course Lesson Delete
  Future<CourseLessonsDeleteResult?> courseLessonsDelete(String lessonId) async {
    final response = await _client.delete(ApiPaths.backendPath('/content/course-lessons/${serializePathParameter(lessonId, const PathParameterSpec('lessonId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CourseLessonsDeleteResult.fromJson(map);
    })();
  }

  /// Admin Course Lesson Update
  Future<CourseLessonsUpdateResult?> courseLessonsUpdate(String lessonId, AdminCourseLessonMutationRequest body) async {
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/content/course-lessons/${serializePathParameter(lessonId, const PathParameterSpec('lessonId', 'simple', false))}'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CourseLessonsUpdateResult.fromJson(map);
    })();
  }

  /// Admin Course Section Delete
  Future<CourseSectionsDeleteResult?> courseSectionsDelete(String sectionId) async {
    final response = await _client.delete(ApiPaths.backendPath('/content/course-sections/${serializePathParameter(sectionId, const PathParameterSpec('sectionId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CourseSectionsDeleteResult.fromJson(map);
    })();
  }

  /// Admin Course Section Update
  Future<CourseSectionsUpdateResult?> courseSectionsUpdate(String sectionId, AdminCourseSectionMutationRequest body) async {
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/content/course-sections/${serializePathParameter(sectionId, const PathParameterSpec('sectionId', 'simple', false))}'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CourseSectionsUpdateResult.fromJson(map);
    })();
  }

  /// Admin Courses List
  Future<CoursesListResult?> coursesList([int? page, int? pageSize, String? q, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/content/courses'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesListResult.fromJson(map);
    })();
  }

  /// Admin Course Create
  Future<CoursesCreateResult?> coursesCreate(AdminCourseMutationRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/content/courses'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesCreateResult.fromJson(map);
    })();
  }

  /// Admin Course Comments List
  Future<CourseCommentsListResult?> courseCommentsList([int? page, int? pageSize, String? q, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/content/courses/comments'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CourseCommentsListResult.fromJson(map);
    })();
  }

  /// Admin Course Comment Moderate
  Future<CourseCommentsModerateResult?> courseCommentsModerate(String commentId, AdminCourseCommentModerationRequest body) async {
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/content/courses/comments/${serializePathParameter(commentId, const PathParameterSpec('commentId', 'simple', false))}/moderation'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CourseCommentsModerateResult.fromJson(map);
    })();
  }

  /// Course Dashboard Retrieve
  Future<CoursesDashboardRetrieveResult?> coursesDashboardRetrieve() async {
    final response = await _client.get(ApiPaths.backendPath('/content/courses/dashboard'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesDashboardRetrieveResult.fromJson(map);
    })();
  }

  /// Admin Course Engagement List
  Future<CourseEngagementListResult?> courseEngagementList([int? page, int? pageSize, String? q, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/content/courses/engagement'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CourseEngagementListResult.fromJson(map);
    })();
  }

  /// Admin Course Delete
  Future<CoursesDeleteResult?> coursesDelete(String courseId) async {
    final response = await _client.delete(ApiPaths.backendPath('/content/courses/${serializePathParameter(courseId, const PathParameterSpec('courseId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesDeleteResult.fromJson(map);
    })();
  }

  /// Admin Course Update
  Future<CoursesUpdateResult?> coursesUpdate(String courseId, AdminCourseMutationRequest body) async {
    final payload = body.toJson();
    final response = await _client.patch(ApiPaths.backendPath('/content/courses/${serializePathParameter(courseId, const PathParameterSpec('courseId', 'simple', false))}'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesUpdateResult.fromJson(map);
    })();
  }

  /// Admin Course Lessons List
  Future<CoursesLessonsListResult?> coursesLessonsList(String courseId, [int? page, int? pageSize, String? q, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/content/courses/${serializePathParameter(courseId, const PathParameterSpec('courseId', 'simple', false))}/lessons'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesLessonsListResult.fromJson(map);
    })();
  }

  /// Admin Course Lesson Create
  Future<CoursesLessonsCreateResult?> coursesLessonsCreate(String courseId, AdminCourseLessonMutationRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/content/courses/${serializePathParameter(courseId, const PathParameterSpec('courseId', 'simple', false))}/lessons'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesLessonsCreateResult.fromJson(map);
    })();
  }

  /// Admin Course Relations List
  Future<CoursesRelationsListResult?> coursesRelationsList(String courseId, [int? page, int? pageSize, String? q, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/content/courses/${serializePathParameter(courseId, const PathParameterSpec('courseId', 'simple', false))}/relations'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesRelationsListResult.fromJson(map);
    })();
  }

  /// Admin Course Relations Replace
  Future<CoursesRelationsReplaceResult?> coursesRelationsReplace(String courseId, AdminCourseRelationsReplaceRequest body) async {
    final payload = body.toJson();
    final response = await _client.put(ApiPaths.backendPath('/content/courses/${serializePathParameter(courseId, const PathParameterSpec('courseId', 'simple', false))}/relations'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesRelationsReplaceResult.fromJson(map);
    })();
  }

  /// Admin Course Sections List
  Future<CoursesSectionsListResult?> coursesSectionsList(String courseId, [int? page, int? pageSize, String? q, String? status]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('status', status, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.backendPath('/content/courses/${serializePathParameter(courseId, const PathParameterSpec('courseId', 'simple', false))}/sections'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesSectionsListResult.fromJson(map);
    })();
  }

  /// Admin Course Section Create
  Future<CoursesSectionsCreateResult?> coursesSectionsCreate(String courseId, AdminCourseSectionMutationRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.backendPath('/content/courses/${serializePathParameter(courseId, const PathParameterSpec('courseId', 'simple', false))}/sections'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesSectionsCreateResult.fromJson(map);
    })();
  }
}

class PathParameterSpec {
  final String name;
  final String style;
  final bool explode;

  const PathParameterSpec(this.name, this.style, this.explode);
}

String serializePathParameter(dynamic value, PathParameterSpec spec) {
  if (value == null) return '';
  final style = spec.style.trim().isEmpty ? 'simple' : spec.style;
  if (value is Iterable) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (value is Map) {
    return serializePathObject(spec.name, value, style, spec.explode);
  }
  return pathPrimitivePrefix(spec.name, style) + Uri.encodeComponent(value.toString());
}

String serializePathArray(String name, Iterable values, String style, bool explode) {
  final serialized = values.where((item) => item != null).map((item) => Uri.encodeComponent(item.toString())).toList();
  if (serialized.isEmpty) return pathPrefix(name, style);
  if (style == 'matrix') {
    if (explode) {
      return serialized.map((item) => ';$name=$item').join();
    }
    return ';$name=${serialized.join(',')}';
  }
  final separator = explode ? '.' : ',';
  return pathPrefix(name, style) + serialized.join(separator);
}

String serializePathObject(String name, Map values, String style, bool explode) {
  final entries = <String>[];
  final exploded = <String>[];
  values.forEach((key, value) {
    if (value == null) return;
    final escapedKey = Uri.encodeComponent(key.toString());
    final escapedValue = Uri.encodeComponent(value.toString());
    if (explode) {
      if (style == 'matrix') {
        exploded.add(';$escapedKey=$escapedValue');
      } else {
        exploded.add('$escapedKey=$escapedValue');
      }
    } else {
      entries.add(escapedKey);
      entries.add(escapedValue);
    }
  });
  if (style == 'matrix') {
    if (explode) return exploded.join();
    return ';$name=${entries.join(',')}';
  }
  if (explode) {
    final separator = style == 'label' ? '.' : ',';
    return pathPrefix(name, style) + exploded.join(separator);
  }
  return pathPrefix(name, style) + entries.join(',');
}

String pathPrefix(String name, String style) {
  if (style == 'label') return '.';
  if (style == 'matrix') return ';$name';
  return '';
}

String pathPrimitivePrefix(String name, String style) {
  return style == 'matrix' ? ';$name=' : pathPrefix(name, style);
}
class QueryParameterSpec {
  final String name;
  final dynamic value;
  final String style;
  final bool explode;
  final bool allowReserved;
  final String? contentType;

  const QueryParameterSpec(
    this.name,
    this.value,
    this.style,
    this.explode,
    this.allowReserved,
    this.contentType,
  );
}

String buildQueryString(List<QueryParameterSpec> parameters) {
  final pairs = <String>[];
  for (final parameter in parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join('&');
}

void appendSerializedParameter(List<String> pairs, QueryParameterSpec parameter) {
  final value = parameter.value;
  if (value == null) return;

  final contentType = parameter.contentType;
  if (contentType != null && contentType.trim().isNotEmpty) {
    pairs.add('${urlEncode(parameter.name)}=${encodeQueryValue(jsonEncode(value), parameter.allowReserved)}');
    return;
  }

  final style = parameter.style.trim().isEmpty ? 'form' : parameter.style;
  if (style == 'deepObject' && value is Map) {
    appendDeepObjectParameter(pairs, parameter.name, value, parameter.allowReserved);
    return;
  }
  if (value is Iterable) {
    appendArrayParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (value is Map) {
    appendObjectParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.add('${urlEncode(parameter.name)}=${encodeQueryValue(value.toString(), parameter.allowReserved)}');
}

void appendArrayParameter(
  List<String> pairs,
  String name,
  Iterable values,
  String style,
  bool explode,
  bool allowReserved,
) {
  final serialized = values.where((item) => item != null).map((item) => item.toString()).toList();
  if (serialized.isEmpty) return;
  if (style == 'form' && explode) {
    for (final item in serialized) {
      pairs.add('${urlEncode(name)}=${encodeQueryValue(item, allowReserved)}');
    }
    return;
  }
  pairs.add('${urlEncode(name)}=${encodeQueryValue(serialized.join(','), allowReserved)}');
}

void appendObjectParameter(
  List<String> pairs,
  String name,
  Map values,
  String style,
  bool explode,
  bool allowReserved,
) {
  final serialized = <String>[];
  values.forEach((key, value) {
    if (value == null) return;
    if (style == 'form' && explode) {
      pairs.add('${urlEncode(key.toString())}=${encodeQueryValue(value.toString(), allowReserved)}');
      return;
    }
    serialized.add(key.toString());
    serialized.add(value.toString());
  });
  if (serialized.isNotEmpty) {
    pairs.add('${urlEncode(name)}=${encodeQueryValue(serialized.join(','), allowReserved)}');
  }
}

void appendDeepObjectParameter(List<String> pairs, String name, Map values, bool allowReserved) {
  values.forEach((key, value) {
    if (value != null) {
      pairs.add('${urlEncode('$name[$key]')}=${encodeQueryValue(value.toString(), allowReserved)}');
    }
  });
}

String encodeQueryValue(String value, bool allowReserved) {
  var encoded = urlEncode(value);
  if (!allowReserved) return encoded;
  const replacements = <String, String>{
    '%3A': ':',
    '%2F': '/',
    '%3F': '?',
    '%23': '#',
    '%5B': '[',
    '%5D': ']',
    '%40': '@',
    '%21': '!',
    '%24': r'$',
    '%26': '&',
    '%27': "'",
    '%28': '(',
    '%29': ')',
    '%2A': '*',
    '%2B': '+',
    '%2C': ',',
    '%3B': ';',
    '%3D': '=',
  };
  replacements.forEach((escaped, reserved) {
    encoded = encoded.replaceAll(escaped, reserved);
  });
  return encoded;
}

String urlEncode(String value) => Uri.encodeQueryComponent(value);
