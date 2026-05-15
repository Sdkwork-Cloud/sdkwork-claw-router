import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class ContentApi {
  final HttpClient _client;

  ContentApi(this._client);

  /// List forum comments
  Future<CommentsListResult?> commentsList(String contentType, int contentId, [int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('content_type', contentType, 'form', true, false, null),
      QueryParameterSpec('content_id', contentId, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/content/comments'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommentsListResult.fromJson(map);
    })();
  }

  /// Create forum comment
  Future<CommentsCreateResult?> commentsCreate(ForumCreateCommentRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/content/comments'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommentsCreateResult.fromJson(map);
    })();
  }

  /// List forum comment statistics
  Future<CommentsStatisticsListResult?> commentsStatisticsList(String contentType, int contentId) async {
    final query = buildQueryString([
      QueryParameterSpec('content_type', contentType, 'form', true, false, null),
      QueryParameterSpec('content_id', contentId, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/content/comments/statistics'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommentsStatisticsListResult.fromJson(map);
    })();
  }

  /// Delete forum comment
  Future<CommentsDeleteResult?> commentsDelete(String commentId) async {
    final response = await _client.delete(ApiPaths.appPath('/content/comments/${serializePathParameter(commentId, const PathParameterSpec('commentId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommentsDeleteResult.fromJson(map);
    })();
  }

  /// List forum comment detail
  Future<CommentsRetrieveResult?> commentsRetrieve(String commentId) async {
    final response = await _client.get(ApiPaths.appPath('/content/comments/${serializePathParameter(commentId, const PathParameterSpec('commentId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommentsRetrieveResult.fromJson(map);
    })();
  }

  /// Like forum comment
  Future<CommentsLikesCreateResult?> commentsLikesCreate(String commentId, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.appPath('/content/comments/${serializePathParameter(commentId, const PathParameterSpec('commentId', 'simple', false))}/likes'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommentsLikesCreateResult.fromJson(map);
    })();
  }

  /// Unlike forum comment
  Future<CommentsLikesCurrentDeleteResult?> commentsLikesCurrentDelete(String commentId) async {
    final response = await _client.delete(ApiPaths.appPath('/content/comments/${serializePathParameter(commentId, const PathParameterSpec('commentId', 'simple', false))}/likes/current'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommentsLikesCurrentDeleteResult.fromJson(map);
    })();
  }

  /// Pin forum comment
  Future<CommentsPinsCreateResult?> commentsPinsCreate(String commentId, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.appPath('/content/comments/${serializePathParameter(commentId, const PathParameterSpec('commentId', 'simple', false))}/pins'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommentsPinsCreateResult.fromJson(map);
    })();
  }

  /// Unpin forum comment
  Future<CommentsPinsCurrentDeleteResult?> commentsPinsCurrentDelete(String commentId) async {
    final response = await _client.delete(ApiPaths.appPath('/content/comments/${serializePathParameter(commentId, const PathParameterSpec('commentId', 'simple', false))}/pins/current'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommentsPinsCurrentDeleteResult.fromJson(map);
    })();
  }

  /// List forum comment replies
  Future<CommentsRepliesListResult?> commentsRepliesList(String commentId, [int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/content/comments/${serializePathParameter(commentId, const PathParameterSpec('commentId', 'simple', false))}/replies'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommentsRepliesListResult.fromJson(map);
    })();
  }

  /// Reply forum comment
  Future<CommentsReplyCreateResult?> commentsReplyCreate(String commentId, ForumReplyCommentRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/content/comments/${serializePathParameter(commentId, const PathParameterSpec('commentId', 'simple', false))}/reply'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CommentsReplyCreateResult.fromJson(map);
    })();
  }

  /// List forum feeds
  Future<FeedsListResult?> feedsList([String? type, String? contentType, String? q, int? authorId, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('type', type, 'form', true, false, null),
      QueryParameterSpec('content_type', contentType, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('author_id', authorId, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/content/feeds'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsListResult.fromJson(map);
    })();
  }

  /// Create forum feed
  Future<FeedsCreateResult?> feedsCreate(ForumCreateFeedRequest body, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/content/feeds'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsCreateResult.fromJson(map);
    })();
  }

  /// List category forum feeds
  Future<FeedsCategoryRetrieveResult?> feedsCategoryRetrieve(String categoryId, [int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/content/feeds/category/${serializePathParameter(categoryId, const PathParameterSpec('categoryId', 'simple', false))}'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsCategoryRetrieveResult.fromJson(map);
    })();
  }

  /// List hot forum feeds
  Future<FeedsHotListResult?> feedsHotList([int? limit]) async {
    final query = buildQueryString([
      QueryParameterSpec('limit', limit, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/content/feeds/hot'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsHotListResult.fromJson(map);
    })();
  }

  /// List most liked forum feeds
  Future<FeedsMostLikedListResult?> feedsMostLikedList([int? limit]) async {
    final query = buildQueryString([
      QueryParameterSpec('limit', limit, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/content/feeds/most_liked'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsMostLikedListResult.fromJson(map);
    })();
  }

  /// List most viewed forum feeds
  Future<FeedsMostViewedListResult?> feedsMostViewedList([int? limit]) async {
    final query = buildQueryString([
      QueryParameterSpec('limit', limit, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/content/feeds/most_viewed'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsMostViewedListResult.fromJson(map);
    })();
  }

  /// List forum overview
  Future<FeedsOverviewRetrieveResult?> feedsOverviewRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/content/feeds/overview'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsOverviewRetrieveResult.fromJson(map);
    })();
  }

  /// List recommended forum feeds
  Future<FeedsRecommendListResult?> feedsRecommendList([int? limit]) async {
    final query = buildQueryString([
      QueryParameterSpec('limit', limit, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/content/feeds/recommend'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsRecommendListResult.fromJson(map);
    })();
  }

  /// List top forum feeds
  Future<FeedsTopListResult?> feedsTopList([int? limit]) async {
    final query = buildQueryString([
      QueryParameterSpec('limit', limit, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/content/feeds/top'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsTopListResult.fromJson(map);
    })();
  }

  /// Delete forum feed
  Future<FeedsDeleteResult?> feedsDelete(String id) async {
    final response = await _client.delete(ApiPaths.appPath('/content/feeds/${serializePathParameter(id, const PathParameterSpec('id', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsDeleteResult.fromJson(map);
    })();
  }

  /// List forum feed detail
  Future<FeedsRetrieveResult?> feedsRetrieve(String id) async {
    final response = await _client.get(ApiPaths.appPath('/content/feeds/${serializePathParameter(id, const PathParameterSpec('id', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsRetrieveResult.fromJson(map);
    })();
  }

  /// Collect forum feed
  Future<FeedsCollectionsCreateResult?> feedsCollectionsCreate(String id, [int? folderId, String? xRequestId]) async {
    final query = buildQueryString([
      QueryParameterSpec('folder_id', folderId, 'form', true, false, null)
    ]);
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.appendQueryString(ApiPaths.appPath('/content/feeds/${serializePathParameter(id, const PathParameterSpec('id', 'simple', false))}/collections'), query), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsCollectionsCreateResult.fromJson(map);
    })();
  }

  /// Uncollect forum feed
  Future<FeedsCollectionsCurrentDeleteResult?> feedsCollectionsCurrentDelete(String id, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.delete(ApiPaths.appPath('/content/feeds/${serializePathParameter(id, const PathParameterSpec('id', 'simple', false))}/collections/current'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsCollectionsCurrentDeleteResult.fromJson(map);
    })();
  }

  /// Check forum feed collected
  Future<FeedsCollectionsCurrentRetrieveResult?> feedsCollectionsCurrentRetrieve(String id) async {
    final response = await _client.get(ApiPaths.appPath('/content/feeds/${serializePathParameter(id, const PathParameterSpec('id', 'simple', false))}/collections/current'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsCollectionsCurrentRetrieveResult.fromJson(map);
    })();
  }

  /// Like forum feed
  Future<FeedsLikesCreateResult?> feedsLikesCreate(String id, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.appPath('/content/feeds/${serializePathParameter(id, const PathParameterSpec('id', 'simple', false))}/likes'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsLikesCreateResult.fromJson(map);
    })();
  }

  /// Unlike forum feed
  Future<FeedsLikesCurrentDeleteResult?> feedsLikesCurrentDelete(String id, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.delete(ApiPaths.appPath('/content/feeds/${serializePathParameter(id, const PathParameterSpec('id', 'simple', false))}/likes/current'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsLikesCurrentDeleteResult.fromJson(map);
    })();
  }

  /// Share forum feed
  Future<FeedsSharesCreateResult?> feedsSharesCreate(String id, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final response = await _client.post(ApiPaths.appPath('/content/feeds/${serializePathParameter(id, const PathParameterSpec('id', 'simple', false))}/shares'), headers: requestHeaders);
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : FeedsSharesCreateResult.fromJson(map);
    })();
  }

  /// List my forum comments
  Future<UsersCurrentCommentsListResult?> usersCurrentCommentsList([int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/content/users/current/comments'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : UsersCurrentCommentsListResult.fromJson(map);
    })();
  }

  /// List courses
  Future<CoursesListResult?> coursesList([int? level, String? category, String? q, int? page, int? pageSize]) async {
    final query = buildQueryString([
      QueryParameterSpec('level', level, 'form', true, false, null),
      QueryParameterSpec('category', category, 'form', true, false, null),
      QueryParameterSpec('q', q, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/courses'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesListResult.fromJson(map);
    })();
  }

  /// Create course application
  Future<ApplicationsCreateResult?> applicationsCreate(CourseApplicationCreateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/courses/applications'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ApplicationsCreateResult.fromJson(map);
    })();
  }

  /// Upload course application video
  Future<ApplicationsVideosCreateResult?> applicationsVideosCreate(CourseApplicationVideoUploadRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/courses/applications/videos'), body: payload, contentType: 'multipart/form-data');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ApplicationsVideosCreateResult.fromJson(map);
    })();
  }

  /// List course categories
  Future<CoursesCategoriesListResult?> coursesCategoriesList() async {
    final response = await _client.get(ApiPaths.appPath('/courses/categories'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesCategoriesListResult.fromJson(map);
    })();
  }

  /// List course overview
  Future<CoursesOverviewRetrieveResult?> coursesOverviewRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/courses/overview'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesOverviewRetrieveResult.fromJson(map);
    })();
  }

  /// List course detail
  Future<CoursesRetrieveResult?> coursesRetrieve(String courseId) async {
    final response = await _client.get(ApiPaths.appPath('/courses/${serializePathParameter(courseId, const PathParameterSpec('courseId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CoursesRetrieveResult.fromJson(map);
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
class HeaderParameterSpec {
  final dynamic value;
  final String style;
  final bool explode;
  final String? contentType;

  HeaderParameterSpec(this.value, this.style, this.explode, this.contentType);
}

Map<String, String>? buildRequestHeaders(
  Map<String, HeaderParameterSpec> headers, [
  Map<String, HeaderParameterSpec> cookies = const {},
]) {
  final requestHeaders = <String, String>{};

  headers.forEach((name, parameter) {
    final serialized = serializeParameterValue(parameter);
    if (serialized != null) {
      requestHeaders[name] = serialized;
    }
  });

  final cookieHeader = buildCookieHeader(cookies);
  if (cookieHeader != null && cookieHeader.isNotEmpty) {
    requestHeaders['Cookie'] = requestHeaders.containsKey('Cookie')
        ? '${requestHeaders['Cookie']}; $cookieHeader'
        : cookieHeader;
  }

  return requestHeaders.isEmpty ? null : requestHeaders;
}

String? buildCookieHeader(Map<String, HeaderParameterSpec> cookies) {
  final pairs = <String>[];
  cookies.forEach((name, parameter) {
    final serialized = serializeParameterValue(parameter);
    if (serialized != null) {
      pairs.add('${Uri.encodeComponent(name)}=${Uri.encodeComponent(serialized)}');
    }
  });
  return pairs.isEmpty ? null : pairs.join('; ');
}

String? serializeParameterValue(HeaderParameterSpec? parameter) {
  final value = parameter?.value;
  if (value == null) return null;
  if (parameter!.contentType != null && parameter.contentType!.trim().isNotEmpty) {
    return jsonEncode(value);
  }
  if (value is DateTime) return value.toIso8601String();
  if (value is Iterable) {
    return value
        .where((item) => item != null)
        .map((item) => item.toString())
        .whereType<String>()
        .join(',');
  }
  if (value is Map) {
    final serialized = <String>[];
    value.forEach((key, item) {
      if (item == null) return;
      if (parameter.explode) {
        serialized.add('$key=$item');
      } else {
        serialized.add(key.toString());
        serialized.add(item.toString());
      }
    });
    return serialized.join(',');
  }
  return value.toString();
}
