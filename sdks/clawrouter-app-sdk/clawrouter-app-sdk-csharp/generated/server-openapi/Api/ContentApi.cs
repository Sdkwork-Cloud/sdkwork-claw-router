using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.App.Models;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;

namespace Sdkwork.ClawRouter.App.Api
{
    public class ContentApi
    {
        private readonly SdkHttpClient _client;

        public ContentApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// List forum comments
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CommentsListResult?> CommentsListAsync(string contentType, int contentId, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("content_type", contentType, "form", true, false, null),
                new QueryParameterSpec("content_id", contentId, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CommentsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/content/comments"), queryString));
        }

        /// <summary>
        /// Create forum comment
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CommentsCreateResult?> CommentsCreateAsync(Sdkwork.ClawRouter.App.Models.ForumCreateCommentRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CommentsCreateResult>(ApiPaths.AppPath("/content/comments"), body, null, null, "application/json");
        }

        /// <summary>
        /// List forum comment statistics
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CommentsStatisticsListResult?> CommentsStatisticsListAsync(string contentType, int contentId)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("content_type", contentType, "form", true, false, null),
                new QueryParameterSpec("content_id", contentId, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CommentsStatisticsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/content/comments/statistics"), queryString));
        }

        /// <summary>
        /// Delete forum comment
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CommentsDeleteResult?> CommentsDeleteAsync(string commentId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.App.Models.CommentsDeleteResult>(ApiPaths.AppPath($"/content/comments/{SerializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false))}"));
        }

        /// <summary>
        /// List forum comment detail
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CommentsRetrieveResult?> CommentsRetrieveAsync(string commentId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CommentsRetrieveResult>(ApiPaths.AppPath($"/content/comments/{SerializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false))}"));
        }

        /// <summary>
        /// Like forum comment
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CommentsLikesCreateResult?> CommentsLikesCreateAsync(string commentId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CommentsLikesCreateResult>(ApiPaths.AppPath($"/content/comments/{SerializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false))}/likes"), null);
        }

        /// <summary>
        /// Unlike forum comment
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CommentsLikesCurrentDeleteResult?> CommentsLikesCurrentDeleteAsync(string commentId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.App.Models.CommentsLikesCurrentDeleteResult>(ApiPaths.AppPath($"/content/comments/{SerializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false))}/likes/current"));
        }

        /// <summary>
        /// Pin forum comment
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CommentsPinsCreateResult?> CommentsPinsCreateAsync(string commentId)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CommentsPinsCreateResult>(ApiPaths.AppPath($"/content/comments/{SerializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false))}/pins"), null);
        }

        /// <summary>
        /// Unpin forum comment
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CommentsPinsCurrentDeleteResult?> CommentsPinsCurrentDeleteAsync(string commentId)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.App.Models.CommentsPinsCurrentDeleteResult>(ApiPaths.AppPath($"/content/comments/{SerializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false))}/pins/current"));
        }

        /// <summary>
        /// List forum comment replies
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CommentsRepliesListResult?> CommentsRepliesListAsync(string commentId, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CommentsRepliesListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath($"/content/comments/{SerializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false))}/replies"), queryString));
        }

        /// <summary>
        /// Reply forum comment
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CommentsReplyCreateResult?> CommentsReplyCreateAsync(string commentId, Sdkwork.ClawRouter.App.Models.ForumReplyCommentRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.CommentsReplyCreateResult>(ApiPaths.AppPath($"/content/comments/{SerializePathParameter(commentId, new PathParameterSpec("commentId", "simple", false))}/reply"), body, null, null, "application/json");
        }

        /// <summary>
        /// List forum feeds
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsListResult?> FeedsListAsync(string? type = null, string? contentType = null, string? q = null, int? authorId = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("type", type, "form", true, false, null),
                new QueryParameterSpec("content_type", contentType, "form", true, false, null),
                new QueryParameterSpec("q", q, "form", true, false, null),
                new QueryParameterSpec("author_id", authorId, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FeedsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/content/feeds"), queryString));
        }

        /// <summary>
        /// Create forum feed
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsCreateResult?> FeedsCreateAsync(Sdkwork.ClawRouter.App.Models.ForumCreateFeedRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.FeedsCreateResult>(ApiPaths.AppPath("/content/feeds"), body, null, null, "application/json");
        }

        /// <summary>
        /// List category forum feeds
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsCategoryRetrieveResult?> FeedsCategoryRetrieveAsync(string categoryId, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FeedsCategoryRetrieveResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath($"/content/feeds/category/{SerializePathParameter(categoryId, new PathParameterSpec("categoryId", "simple", false))}"), queryString));
        }

        /// <summary>
        /// List hot forum feeds
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsHotListResult?> FeedsHotListAsync(int? limit = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("limit", limit, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FeedsHotListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/content/feeds/hot"), queryString));
        }

        /// <summary>
        /// List most liked forum feeds
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsMostLikedListResult?> FeedsMostLikedListAsync(int? limit = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("limit", limit, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FeedsMostLikedListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/content/feeds/most_liked"), queryString));
        }

        /// <summary>
        /// List most viewed forum feeds
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsMostViewedListResult?> FeedsMostViewedListAsync(int? limit = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("limit", limit, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FeedsMostViewedListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/content/feeds/most_viewed"), queryString));
        }

        /// <summary>
        /// List forum overview
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsOverviewRetrieveResult?> FeedsOverviewRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FeedsOverviewRetrieveResult>(ApiPaths.AppPath("/content/feeds/overview"));
        }

        /// <summary>
        /// List recommended forum feeds
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsRecommendListResult?> FeedsRecommendListAsync(int? limit = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("limit", limit, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FeedsRecommendListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/content/feeds/recommend"), queryString));
        }

        /// <summary>
        /// List top forum feeds
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsTopListResult?> FeedsTopListAsync(int? limit = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("limit", limit, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FeedsTopListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/content/feeds/top"), queryString));
        }

        /// <summary>
        /// Delete forum feed
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsDeleteResult?> FeedsDeleteAsync(string id)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.App.Models.FeedsDeleteResult>(ApiPaths.AppPath($"/content/feeds/{SerializePathParameter(id, new PathParameterSpec("id", "simple", false))}"));
        }

        /// <summary>
        /// List forum feed detail
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsRetrieveResult?> FeedsRetrieveAsync(string id)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FeedsRetrieveResult>(ApiPaths.AppPath($"/content/feeds/{SerializePathParameter(id, new PathParameterSpec("id", "simple", false))}"));
        }

        /// <summary>
        /// Collect forum feed
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsCollectionsCreateResult?> FeedsCollectionsCreateAsync(string id, int? folderId = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("folder_id", folderId, "form", true, false, null),
            });
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.FeedsCollectionsCreateResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath($"/content/feeds/{SerializePathParameter(id, new PathParameterSpec("id", "simple", false))}/collections"), queryString), null);
        }

        /// <summary>
        /// Uncollect forum feed
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsCollectionsCurrentDeleteResult?> FeedsCollectionsCurrentDeleteAsync(string id)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.App.Models.FeedsCollectionsCurrentDeleteResult>(ApiPaths.AppPath($"/content/feeds/{SerializePathParameter(id, new PathParameterSpec("id", "simple", false))}/collections/current"));
        }

        /// <summary>
        /// Check forum feed collected
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsCollectionsCurrentRetrieveResult?> FeedsCollectionsCurrentRetrieveAsync(string id)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.FeedsCollectionsCurrentRetrieveResult>(ApiPaths.AppPath($"/content/feeds/{SerializePathParameter(id, new PathParameterSpec("id", "simple", false))}/collections/current"));
        }

        /// <summary>
        /// Like forum feed
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsLikesCreateResult?> FeedsLikesCreateAsync(string id)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.FeedsLikesCreateResult>(ApiPaths.AppPath($"/content/feeds/{SerializePathParameter(id, new PathParameterSpec("id", "simple", false))}/likes"), null);
        }

        /// <summary>
        /// Unlike forum feed
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsLikesCurrentDeleteResult?> FeedsLikesCurrentDeleteAsync(string id)
        {
            return await _client.DeleteAsync<Sdkwork.ClawRouter.App.Models.FeedsLikesCurrentDeleteResult>(ApiPaths.AppPath($"/content/feeds/{SerializePathParameter(id, new PathParameterSpec("id", "simple", false))}/likes/current"));
        }

        /// <summary>
        /// Share forum feed
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.FeedsSharesCreateResult?> FeedsSharesCreateAsync(string id)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.FeedsSharesCreateResult>(ApiPaths.AppPath($"/content/feeds/{SerializePathParameter(id, new PathParameterSpec("id", "simple", false))}/shares"), null);
        }

        /// <summary>
        /// List my forum comments
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.UsersCurrentCommentsListResult?> UsersCurrentCommentsListAsync(int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.UsersCurrentCommentsListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/content/users/current/comments"), queryString));
        }

        /// <summary>
        /// List courses
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CoursesListResult?> CoursesListAsync(int? level = null, string? category = null, string? q = null, int? page = null, int? pageSize = null)
        {
            var queryString = BuildQueryString(new[]
            {
                new QueryParameterSpec("level", level, "form", true, false, null),
                new QueryParameterSpec("category", category, "form", true, false, null),
                new QueryParameterSpec("q", q, "form", true, false, null),
                new QueryParameterSpec("page", page, "form", true, false, null),
                new QueryParameterSpec("page_size", pageSize, "form", true, false, null),
            });
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CoursesListResult>(ApiPaths.AppendQueryString(ApiPaths.AppPath("/courses"), queryString));
        }

        /// <summary>
        /// Create course application
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.ApplicationsCreateResult?> ApplicationsCreateAsync(Sdkwork.ClawRouter.App.Models.CourseApplicationCreateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.ApplicationsCreateResult>(ApiPaths.AppPath("/courses/applications"), body, null, null, "application/json");
        }

        /// <summary>
        /// Upload course application video
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.ApplicationsVideosCreateResult?> ApplicationsVideosCreateAsync(Sdkwork.ClawRouter.App.Models.CourseApplicationVideoUploadRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.ApplicationsVideosCreateResult>(ApiPaths.AppPath("/courses/applications/videos"), body, null, null, "multipart/form-data");
        }

        /// <summary>
        /// List course categories
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CoursesCategoriesListResult?> CoursesCategoriesListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CoursesCategoriesListResult>(ApiPaths.AppPath("/courses/categories"));
        }

        /// <summary>
        /// List course overview
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CoursesOverviewRetrieveResult?> CoursesOverviewRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CoursesOverviewRetrieveResult>(ApiPaths.AppPath("/courses/overview"));
        }

        /// <summary>
        /// List course detail
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.CoursesRetrieveResult?> CoursesRetrieveAsync(string courseId)
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.CoursesRetrieveResult>(ApiPaths.AppPath($"/courses/{SerializePathParameter(courseId, new PathParameterSpec("courseId", "simple", false))}"));
        }

        private sealed record PathParameterSpec(string Name, string Style, bool Explode);

        private static string SerializePathParameter(object? value, PathParameterSpec spec)
        {
            if (value is null)
            {
                return string.Empty;
            }
            var style = string.IsNullOrWhiteSpace(spec.Style) ? "simple" : spec.Style;
            if (value is System.Collections.IDictionary dictionary)
            {
                return SerializePathObject(spec.Name, dictionary, style, spec.Explode);
            }
            if (value is System.Collections.IEnumerable enumerable && value is not string)
            {
                return SerializePathArray(spec.Name, enumerable, style, spec.Explode);
            }
            return PathPrimitivePrefix(spec.Name, style) + Uri.EscapeDataString(value.ToString() ?? string.Empty);
        }

        private static string SerializePathArray(string name, System.Collections.IEnumerable values, string style, bool explode)
        {
            var serialized = new List<string>();
            foreach (var item in values)
            {
                if (item is not null)
                {
                    serialized.Add(Uri.EscapeDataString(item.ToString() ?? string.Empty));
                }
            }
            if (serialized.Count == 0)
            {
                return PathPrefix(name, style);
            }
            if (style == "matrix")
            {
                if (explode)
                {
                    var parts = new List<string>();
                    foreach (var item in serialized)
                    {
                        parts.Add(";" + name + "=" + item);
                    }
                    return string.Join(string.Empty, parts);
                }
                return ";" + name + "=" + string.Join(",", serialized);
            }
            var separator = explode ? "." : ",";
            return PathPrefix(name, style) + string.Join(separator, serialized);
        }

        private static string SerializePathObject(string name, System.Collections.IDictionary values, string style, bool explode)
        {
            var entries = new List<string>();
            var exploded = new List<string>();
            foreach (System.Collections.DictionaryEntry item in values)
            {
                if (item.Value is null)
                {
                    continue;
                }
                var escapedKey = Uri.EscapeDataString(item.Key.ToString() ?? string.Empty);
                var escapedValue = Uri.EscapeDataString(item.Value.ToString() ?? string.Empty);
                if (explode)
                {
                    exploded.Add(style == "matrix" ? ";" + escapedKey + "=" + escapedValue : escapedKey + "=" + escapedValue);
                }
                else
                {
                    entries.Add(escapedKey);
                    entries.Add(escapedValue);
                }
            }
            if (style == "matrix")
            {
                return explode ? string.Join(string.Empty, exploded) : ";" + name + "=" + string.Join(",", entries);
            }
            if (explode)
            {
                var separator = style == "label" ? "." : ",";
                return PathPrefix(name, style) + string.Join(separator, exploded);
            }
            return PathPrefix(name, style) + string.Join(",", entries);
        }

        private static string PathPrefix(string name, string style)
        {
            return style switch
            {
                "label" => ".",
                "matrix" => ";" + name,
                _ => string.Empty,
            };
        }

        private static string PathPrimitivePrefix(string name, string style)
        {
            return style == "matrix" ? ";" + name + "=" : PathPrefix(name, style);
        }

        private sealed record QueryParameterSpec(
            string Name,
            object? Value,
            string Style,
            bool Explode,
            bool AllowReserved,
            string? ContentType);

        private static string BuildQueryString(IEnumerable<QueryParameterSpec> parameters)
        {
            var pairs = new List<string>();
            foreach (var parameter in parameters)
            {
                AppendSerializedParameter(pairs, parameter);
            }
            return string.Join("&", pairs);
        }

        private static void AppendSerializedParameter(List<string> pairs, QueryParameterSpec parameter)
        {
            if (parameter.Value is null)
            {
                return;
            }

            if (!string.IsNullOrWhiteSpace(parameter.ContentType))
            {
                var json = System.Text.Json.JsonSerializer.Serialize(parameter.Value);
                pairs.Add(Uri.EscapeDataString(parameter.Name) + "=" + EncodeQueryValue(json, parameter.AllowReserved));
                return;
            }

            var style = string.IsNullOrWhiteSpace(parameter.Style) ? "form" : parameter.Style;
            if (style == "deepObject" && parameter.Value is System.Collections.IDictionary deepObject)
            {
                AppendDeepObjectParameter(pairs, parameter.Name, deepObject, parameter.AllowReserved);
            }
            else if (parameter.Value is System.Collections.IEnumerable enumerable && parameter.Value is not string && parameter.Value is not System.Collections.IDictionary)
            {
                AppendArrayParameter(pairs, parameter.Name, enumerable, style, parameter.Explode, parameter.AllowReserved);
            }
            else if (parameter.Value is System.Collections.IDictionary dictionary)
            {
                AppendObjectParameter(pairs, parameter.Name, dictionary, style, parameter.Explode, parameter.AllowReserved);
            }
            else
            {
                pairs.Add(Uri.EscapeDataString(parameter.Name) + "=" + EncodeQueryValue(parameter.Value.ToString() ?? string.Empty, parameter.AllowReserved));
            }
        }

        private static void AppendArrayParameter(List<string> pairs, string name, System.Collections.IEnumerable values, string style, bool explode, bool allowReserved)
        {
            var serialized = new List<string>();
            foreach (var item in values)
            {
                if (item is not null)
                {
                    serialized.Add(item.ToString() ?? string.Empty);
                }
            }
            if (serialized.Count == 0)
            {
                return;
            }
            if (style == "form" && explode)
            {
                foreach (var item in serialized)
                {
                    pairs.Add(Uri.EscapeDataString(name) + "=" + EncodeQueryValue(item, allowReserved));
                }
                return;
            }
            pairs.Add(Uri.EscapeDataString(name) + "=" + EncodeQueryValue(string.Join(",", serialized), allowReserved));
        }

        private static void AppendObjectParameter(List<string> pairs, string name, System.Collections.IDictionary values, string style, bool explode, bool allowReserved)
        {
            var serialized = new List<string>();
            foreach (System.Collections.DictionaryEntry item in values)
            {
                if (item.Value is null)
                {
                    continue;
                }
                if (style == "form" && explode)
                {
                    pairs.Add(Uri.EscapeDataString(item.Key.ToString() ?? string.Empty) + "=" + EncodeQueryValue(item.Value.ToString() ?? string.Empty, allowReserved));
                }
                else
                {
                    serialized.Add(item.Key.ToString() ?? string.Empty);
                    serialized.Add(item.Value.ToString() ?? string.Empty);
                }
            }
            if (serialized.Count > 0)
            {
                pairs.Add(Uri.EscapeDataString(name) + "=" + EncodeQueryValue(string.Join(",", serialized), allowReserved));
            }
        }

        private static void AppendDeepObjectParameter(List<string> pairs, string name, System.Collections.IDictionary values, bool allowReserved)
        {
            foreach (System.Collections.DictionaryEntry item in values)
            {
                if (item.Value is not null)
                {
                    pairs.Add(Uri.EscapeDataString(name + "[" + item.Key + "]") + "=" + EncodeQueryValue(item.Value.ToString() ?? string.Empty, allowReserved));
                }
            }
        }

        private static string EncodeQueryValue(string value, bool allowReserved)
        {
            var encoded = Uri.EscapeDataString(value);
            if (!allowReserved)
            {
                return encoded;
            }
            return encoded
                .Replace("%3A", ":").Replace("%2F", "/").Replace("%3F", "?").Replace("%23", "#")
                .Replace("%5B", "[").Replace("%5D", "]").Replace("%40", "@").Replace("%21", "!")
                .Replace("%24", "$").Replace("%26", "&").Replace("%27", "'").Replace("%28", "(")
                .Replace("%29", ")").Replace("%2A", "*").Replace("%2B", "+").Replace("%2C", ",")
                .Replace("%3B", ";").Replace("%3D", "=");
        }

    }
}
