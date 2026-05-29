package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-app-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"
)

type ContentApi struct {
    client *sdkhttp.Client
}

func NewContentApi(client *sdkhttp.Client) *ContentApi {
    return &ContentApi{client: client}
}

// List forum comments
func (a *ContentApi) CommentsList(contentType string, contentId int, page *int, pageSize *int) (sdktypes.CommentsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "content_type", Value: contentType, Style: "form", Explode: true, AllowReserved: false},
        {Name: "content_id", Value: contentId, Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/content/comments"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CommentsListResult
        return zero, err
    }
    return decodeResult[sdktypes.CommentsListResult](raw)
}

// Create forum comment
func (a *ContentApi) CommentsCreate(body sdktypes.ForumCreateCommentRequest) (sdktypes.CommentsCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/content/comments"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.CommentsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CommentsCreateResult](raw)
}

// List forum comment statistics
func (a *ContentApi) CommentsStatisticsList(contentType string, contentId int) (sdktypes.CommentsStatisticsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "content_type", Value: contentType, Style: "form", Explode: true, AllowReserved: false},
        {Name: "content_id", Value: contentId, Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/content/comments/statistics"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CommentsStatisticsListResult
        return zero, err
    }
    return decodeResult[sdktypes.CommentsStatisticsListResult](raw)
}

// Delete forum comment
func (a *ContentApi) CommentsDelete(commentId string) (sdktypes.CommentsDeleteResult, error) {
    raw, err := a.client.Delete(AppApiPath(fmt.Sprintf("/content/comments/%s", SerializePathParameter(commentId, PathParameterSpec{Name: "commentId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.CommentsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.CommentsDeleteResult](raw)
}

// List forum comment detail
func (a *ContentApi) CommentsRetrieve(commentId string) (sdktypes.CommentsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/content/comments/%s", SerializePathParameter(commentId, PathParameterSpec{Name: "commentId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.CommentsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.CommentsRetrieveResult](raw)
}

// Like forum comment
func (a *ContentApi) CommentsLikesCreate(commentId string) (sdktypes.CommentsLikesCreateResult, error) {
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/content/comments/%s/likes", SerializePathParameter(commentId, PathParameterSpec{Name: "commentId", Style: "simple", Explode: false}))), nil, nil, nil, "")
    if err != nil {
        var zero sdktypes.CommentsLikesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CommentsLikesCreateResult](raw)
}

// Unlike forum comment
func (a *ContentApi) CommentsLikesCurrentDelete(commentId string) (sdktypes.CommentsLikesCurrentDeleteResult, error) {
    raw, err := a.client.Delete(AppApiPath(fmt.Sprintf("/content/comments/%s/likes/current", SerializePathParameter(commentId, PathParameterSpec{Name: "commentId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.CommentsLikesCurrentDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.CommentsLikesCurrentDeleteResult](raw)
}

// Pin forum comment
func (a *ContentApi) CommentsPinsCreate(commentId string) (sdktypes.CommentsPinsCreateResult, error) {
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/content/comments/%s/pins", SerializePathParameter(commentId, PathParameterSpec{Name: "commentId", Style: "simple", Explode: false}))), nil, nil, nil, "")
    if err != nil {
        var zero sdktypes.CommentsPinsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CommentsPinsCreateResult](raw)
}

// Unpin forum comment
func (a *ContentApi) CommentsPinsCurrentDelete(commentId string) (sdktypes.CommentsPinsCurrentDeleteResult, error) {
    raw, err := a.client.Delete(AppApiPath(fmt.Sprintf("/content/comments/%s/pins/current", SerializePathParameter(commentId, PathParameterSpec{Name: "commentId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.CommentsPinsCurrentDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.CommentsPinsCurrentDeleteResult](raw)
}

// List forum comment replies
func (a *ContentApi) CommentsRepliesList(commentId string, page *int, pageSize *int) (sdktypes.CommentsRepliesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath(fmt.Sprintf("/content/comments/%s/replies", SerializePathParameter(commentId, PathParameterSpec{Name: "commentId", Style: "simple", Explode: false}))), query), nil, nil)
    if err != nil {
        var zero sdktypes.CommentsRepliesListResult
        return zero, err
    }
    return decodeResult[sdktypes.CommentsRepliesListResult](raw)
}

// Reply forum comment
func (a *ContentApi) CommentsReplyCreate(commentId string, body sdktypes.ForumReplyCommentRequest) (sdktypes.CommentsReplyCreateResult, error) {
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/content/comments/%s/reply", SerializePathParameter(commentId, PathParameterSpec{Name: "commentId", Style: "simple", Explode: false}))), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.CommentsReplyCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CommentsReplyCreateResult](raw)
}

// List forum feeds
func (a *ContentApi) FeedsList(type_ *string, contentType *string, q *string, authorId *int, page *int, pageSize *int) (sdktypes.FeedsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "type", Value: func() interface{} { if type_ == nil { return nil }; return *type_ }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "content_type", Value: func() interface{} { if contentType == nil { return nil }; return *contentType }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "author_id", Value: func() interface{} { if authorId == nil { return nil }; return *authorId }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/content/feeds"), query), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsListResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsListResult](raw)
}

// Create forum feed
func (a *ContentApi) FeedsCreate(body sdktypes.ForumCreateFeedRequest) (sdktypes.FeedsCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/content/feeds"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.FeedsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsCreateResult](raw)
}

// List category forum feeds
func (a *ContentApi) FeedsCategoryRetrieve(categoryId string, page *int, pageSize *int) (sdktypes.FeedsCategoryRetrieveResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath(fmt.Sprintf("/content/feeds/category/%s", SerializePathParameter(categoryId, PathParameterSpec{Name: "categoryId", Style: "simple", Explode: false}))), query), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsCategoryRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsCategoryRetrieveResult](raw)
}

// List hot forum feeds
func (a *ContentApi) FeedsHotList(limit *int) (sdktypes.FeedsHotListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "limit", Value: func() interface{} { if limit == nil { return nil }; return *limit }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/content/feeds/hot"), query), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsHotListResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsHotListResult](raw)
}

// List most liked forum feeds
func (a *ContentApi) FeedsMostLikedList(limit *int) (sdktypes.FeedsMostLikedListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "limit", Value: func() interface{} { if limit == nil { return nil }; return *limit }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/content/feeds/most_liked"), query), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsMostLikedListResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsMostLikedListResult](raw)
}

// List most viewed forum feeds
func (a *ContentApi) FeedsMostViewedList(limit *int) (sdktypes.FeedsMostViewedListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "limit", Value: func() interface{} { if limit == nil { return nil }; return *limit }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/content/feeds/most_viewed"), query), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsMostViewedListResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsMostViewedListResult](raw)
}

// List forum overview
func (a *ContentApi) FeedsOverviewRetrieve() (sdktypes.FeedsOverviewRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/content/feeds/overview"), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsOverviewRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsOverviewRetrieveResult](raw)
}

// List recommended forum feeds
func (a *ContentApi) FeedsRecommendList(limit *int) (sdktypes.FeedsRecommendListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "limit", Value: func() interface{} { if limit == nil { return nil }; return *limit }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/content/feeds/recommend"), query), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsRecommendListResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsRecommendListResult](raw)
}

// List top forum feeds
func (a *ContentApi) FeedsTopList(limit *int) (sdktypes.FeedsTopListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "limit", Value: func() interface{} { if limit == nil { return nil }; return *limit }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/content/feeds/top"), query), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsTopListResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsTopListResult](raw)
}

// Delete forum feed
func (a *ContentApi) FeedsDelete(id string) (sdktypes.FeedsDeleteResult, error) {
    raw, err := a.client.Delete(AppApiPath(fmt.Sprintf("/content/feeds/%s", SerializePathParameter(id, PathParameterSpec{Name: "id", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsDeleteResult](raw)
}

// List forum feed detail
func (a *ContentApi) FeedsRetrieve(id string) (sdktypes.FeedsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/content/feeds/%s", SerializePathParameter(id, PathParameterSpec{Name: "id", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsRetrieveResult](raw)
}

// Collect forum feed
func (a *ContentApi) FeedsCollectionsCreate(id string, folderId *int) (sdktypes.FeedsCollectionsCreateResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "folder_id", Value: func() interface{} { if folderId == nil { return nil }; return *folderId }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Post(AppendQueryString(AppApiPath(fmt.Sprintf("/content/feeds/%s/collections", SerializePathParameter(id, PathParameterSpec{Name: "id", Style: "simple", Explode: false}))), query), nil, nil, nil, "")
    if err != nil {
        var zero sdktypes.FeedsCollectionsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsCollectionsCreateResult](raw)
}

// Uncollect forum feed
func (a *ContentApi) FeedsCollectionsCurrentDelete(id string) (sdktypes.FeedsCollectionsCurrentDeleteResult, error) {
    raw, err := a.client.Delete(AppApiPath(fmt.Sprintf("/content/feeds/%s/collections/current", SerializePathParameter(id, PathParameterSpec{Name: "id", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsCollectionsCurrentDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsCollectionsCurrentDeleteResult](raw)
}

// Check forum feed collected
func (a *ContentApi) FeedsCollectionsCurrentRetrieve(id string) (sdktypes.FeedsCollectionsCurrentRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/content/feeds/%s/collections/current", SerializePathParameter(id, PathParameterSpec{Name: "id", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsCollectionsCurrentRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsCollectionsCurrentRetrieveResult](raw)
}

// Like forum feed
func (a *ContentApi) FeedsLikesCreate(id string) (sdktypes.FeedsLikesCreateResult, error) {
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/content/feeds/%s/likes", SerializePathParameter(id, PathParameterSpec{Name: "id", Style: "simple", Explode: false}))), nil, nil, nil, "")
    if err != nil {
        var zero sdktypes.FeedsLikesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsLikesCreateResult](raw)
}

// Unlike forum feed
func (a *ContentApi) FeedsLikesCurrentDelete(id string) (sdktypes.FeedsLikesCurrentDeleteResult, error) {
    raw, err := a.client.Delete(AppApiPath(fmt.Sprintf("/content/feeds/%s/likes/current", SerializePathParameter(id, PathParameterSpec{Name: "id", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.FeedsLikesCurrentDeleteResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsLikesCurrentDeleteResult](raw)
}

// Share forum feed
func (a *ContentApi) FeedsSharesCreate(id string) (sdktypes.FeedsSharesCreateResult, error) {
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/content/feeds/%s/shares", SerializePathParameter(id, PathParameterSpec{Name: "id", Style: "simple", Explode: false}))), nil, nil, nil, "")
    if err != nil {
        var zero sdktypes.FeedsSharesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.FeedsSharesCreateResult](raw)
}

// List my forum comments
func (a *ContentApi) UsersCurrentCommentsList(page *int, pageSize *int) (sdktypes.UsersCurrentCommentsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/content/users/current/comments"), query), nil, nil)
    if err != nil {
        var zero sdktypes.UsersCurrentCommentsListResult
        return zero, err
    }
    return decodeResult[sdktypes.UsersCurrentCommentsListResult](raw)
}

// List courses
func (a *ContentApi) CoursesList(level *int, category *string, q *string, page *int, pageSize *int) (sdktypes.CoursesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "level", Value: func() interface{} { if level == nil { return nil }; return *level }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "category", Value: func() interface{} { if category == nil { return nil }; return *category }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "q", Value: func() interface{} { if q == nil { return nil }; return *q }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/courses"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CoursesListResult
        return zero, err
    }
    return decodeResult[sdktypes.CoursesListResult](raw)
}

// Create course application
func (a *ContentApi) ApplicationsCreate(body sdktypes.CourseApplicationCreateRequest) (sdktypes.ApplicationsCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/courses/applications"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.ApplicationsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.ApplicationsCreateResult](raw)
}

// Upload course application video
func (a *ContentApi) ApplicationsVideosCreate(body sdktypes.CourseApplicationVideoUploadRequest) (sdktypes.ApplicationsVideosCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/courses/applications/videos"), body, nil, nil, "multipart/form-data")
    if err != nil {
        var zero sdktypes.ApplicationsVideosCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.ApplicationsVideosCreateResult](raw)
}

// List course categories
func (a *ContentApi) CoursesCategoriesList() (sdktypes.CoursesCategoriesListResult, error) {
    raw, err := a.client.Get(AppApiPath("/courses/categories"), nil, nil)
    if err != nil {
        var zero sdktypes.CoursesCategoriesListResult
        return zero, err
    }
    return decodeResult[sdktypes.CoursesCategoriesListResult](raw)
}

// List course overview
func (a *ContentApi) CoursesOverviewRetrieve() (sdktypes.CoursesOverviewRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/courses/overview"), nil, nil)
    if err != nil {
        var zero sdktypes.CoursesOverviewRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.CoursesOverviewRetrieveResult](raw)
}

// List course detail
func (a *ContentApi) CoursesRetrieve(courseId string) (sdktypes.CoursesRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/courses/%s", SerializePathParameter(courseId, PathParameterSpec{Name: "courseId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.CoursesRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.CoursesRetrieveResult](raw)
}

type PathParameterSpec struct {
    Name    string
    Style   string
    Explode bool
}

func SerializePathParameter(value interface{}, spec PathParameterSpec) string {
    if value == nil {
        return ""
    }
    style := spec.Style
    if style == "" {
        style = "simple"
    }

    switch typed := value.(type) {
    case []string:
        return SerializePathArray(spec.Name, stringSliceToInterface(typed), style, spec.Explode)
    case []int:
        return SerializePathArray(spec.Name, intSliceToInterface(typed), style, spec.Explode)
    case []interface{}:
        return SerializePathArray(spec.Name, typed, style, spec.Explode)
    case map[string]string:
        return SerializePathObject(spec.Name, stringMapToInterface(typed), style, spec.Explode)
    case map[string]int:
        return SerializePathObject(spec.Name, intMapToInterface(typed), style, spec.Explode)
    case map[string]interface{}:
        return SerializePathObject(spec.Name, typed, style, spec.Explode)
    default:
        return PathPrefix(spec.Name, style) + url.PathEscape(fmt.Sprint(value))
    }
}

func SerializePathArray(name string, values []interface{}, style string, explode bool) string {
    serialized := make([]string, 0, len(values))
    for _, item := range values {
        if item != nil {
            serialized = append(serialized, url.PathEscape(fmt.Sprint(item)))
        }
    }
    if len(serialized) == 0 {
        return PathPrefix(name, style)
    }
    if style == "matrix" {
        if explode {
            parts := make([]string, 0, len(serialized))
            for _, item := range serialized {
                parts = append(parts, ";"+name+"="+item)
            }
            return strings.Join(parts, "")
        }
        return ";" + name + "=" + strings.Join(serialized, ",")
    }
    separator := ","
    if explode {
        separator = "."
    }
    return PathPrefix(name, style) + strings.Join(serialized, separator)
}

func SerializePathObject(name string, values map[string]interface{}, style string, explode bool) string {
    entries := make([]string, 0, len(values)*2)
    exploded := make([]string, 0, len(values))
    for key, value := range values {
        if value == nil {
            continue
        }
        escapedKey := url.PathEscape(key)
        escapedValue := url.PathEscape(fmt.Sprint(value))
        if explode {
            if style == "matrix" {
                exploded = append(exploded, ";"+escapedKey+"="+escapedValue)
            } else {
                exploded = append(exploded, escapedKey+"="+escapedValue)
            }
        } else {
            entries = append(entries, escapedKey, escapedValue)
        }
    }
    if style == "matrix" {
        if explode {
            return strings.Join(exploded, "")
        }
        return ";" + name + "=" + strings.Join(entries, ",")
    }
    if explode {
        separator := ","
        if style == "label" {
            separator = "."
        }
        return PathPrefix(name, style) + strings.Join(exploded, separator)
    }
    return PathPrefix(name, style) + strings.Join(entries, ",")
}

func PathPrefix(name string, style string) string {
    if style == "label" {
        return "."
    }
    if style == "matrix" {
        return ";" + name
    }
    return ""
}
type QueryParameterSpec struct {
    Name          string
    Value         interface{}
    Style         string
    Explode       bool
    AllowReserved bool
    ContentType   string
}

func BuildQueryString(parameters []QueryParameterSpec) string {
    pairs := make([]string, 0)
    for _, parameter := range parameters {
        AppendSerializedParameter(&pairs, parameter)
    }
    return strings.Join(pairs, "&")
}

func AppendSerializedParameter(pairs *[]string, parameter QueryParameterSpec) {
    if parameter.Value == nil {
        return
    }

    if parameter.ContentType != "" {
        encoded, _ := json.Marshal(parameter.Value)
        *pairs = append(*pairs, url.QueryEscape(parameter.Name)+"="+EncodeQueryValue(string(encoded), parameter.AllowReserved))
        return
    }

    style := parameter.Style
    if style == "" {
        style = "form"
    }

    switch value := parameter.Value.(type) {
    case []string:
        AppendArrayParameter(pairs, parameter.Name, stringSliceToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case []int:
        AppendArrayParameter(pairs, parameter.Name, intSliceToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case []interface{}:
        AppendArrayParameter(pairs, parameter.Name, value, style, parameter.Explode, parameter.AllowReserved)
    case map[string]int:
        AppendObjectParameter(pairs, parameter.Name, intMapToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case map[string]string:
        AppendObjectParameter(pairs, parameter.Name, stringMapToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case map[string]interface{}:
        if style == "deepObject" {
            AppendDeepObjectParameter(pairs, parameter.Name, value, parameter.AllowReserved)
        } else {
            AppendObjectParameter(pairs, parameter.Name, value, style, parameter.Explode, parameter.AllowReserved)
        }
    default:
        *pairs = append(*pairs, url.QueryEscape(parameter.Name)+"="+EncodeQueryValue(fmt.Sprint(value), parameter.AllowReserved))
    }
}

func AppendArrayParameter(pairs *[]string, name string, value []interface{}, style string, explode bool, allowReserved bool) {
    values := make([]string, 0, len(value))
    for _, item := range value {
        if item != nil {
            values = append(values, fmt.Sprint(item))
        }
    }
    if len(values) == 0 {
        return
    }
    if style == "form" && explode {
        for _, item := range values {
            *pairs = append(*pairs, url.QueryEscape(name)+"="+EncodeQueryValue(item, allowReserved))
        }
        return
    }
    *pairs = append(*pairs, url.QueryEscape(name)+"="+EncodeQueryValue(strings.Join(values, ","), allowReserved))
}

func AppendObjectParameter(pairs *[]string, name string, value map[string]interface{}, style string, explode bool, allowReserved bool) {
    entries := make([]string, 0, len(value)*2)
    for key, item := range value {
        if item == nil {
            continue
        }
        if style == "form" && explode {
            *pairs = append(*pairs, url.QueryEscape(key)+"="+EncodeQueryValue(fmt.Sprint(item), allowReserved))
            continue
        }
        entries = append(entries, key, fmt.Sprint(item))
    }
    if len(entries) == 0 {
        return
    }
    if !(style == "form" && explode) {
        *pairs = append(*pairs, url.QueryEscape(name)+"="+EncodeQueryValue(strings.Join(entries, ","), allowReserved))
    }
}

func AppendDeepObjectParameter(pairs *[]string, name string, value map[string]interface{}, allowReserved bool) {
    for key, item := range value {
        if item == nil {
            continue
        }
        *pairs = append(*pairs, url.QueryEscape(fmt.Sprintf("%s[%s]", name, key))+"="+EncodeQueryValue(fmt.Sprint(item), allowReserved))
    }
}

func EncodeQueryValue(value string, allowReserved bool) string {
    encoded := url.QueryEscape(value)
    if !allowReserved {
        return encoded
    }
    replacements := map[string]string{
        "%3A": ":", "%2F": "/", "%3F": "?", "%23": "#",
        "%5B": "[", "%5D": "]", "%40": "@", "%21": "!",
        "%24": "$", "%26": "&", "%27": "'", "%28": "(",
        "%29": ")", "%2A": "*", "%2B": "+", "%2C": ",",
        "%3B": ";", "%3D": "=",
    }
    for escaped, reserved := range replacements {
        encoded = strings.ReplaceAll(encoded, escaped, reserved)
    }
    return encoded
}



func stringSliceToInterface(values []string) []interface{} {
    result := make([]interface{}, 0, len(values))
    for _, value := range values {
        result = append(result, value)
    }
    return result
}

func intSliceToInterface(values []int) []interface{} {
    result := make([]interface{}, 0, len(values))
    for _, value := range values {
        result = append(result, value)
    }
    return result
}

func stringMapToInterface(values map[string]string) map[string]interface{} {
    result := make(map[string]interface{}, len(values))
    for key, value := range values {
        result[key] = value
    }
    return result
}

func intMapToInterface(values map[string]int) map[string]interface{} {
    result := make(map[string]interface{}, len(values))
    for key, value := range values {
        result[key] = value
    }
    return result
}
