using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumFeedItem
    {
        public ForumAuthor Author { get; set; }
        public string CategoryId { get; set; }
        public string CommentCount { get; set; }
        public string Content { get; set; }
        public string ContentType { get; set; }
        public MediaResource Cover { get; set; }
        public string CreatedAt { get; set; }
        public string Id { get; set; }
        public bool IsCollected { get; set; }
        public bool IsHot { get; set; }
        public bool IsLiked { get; set; }
        public bool IsRecommended { get; set; }
        public bool IsTop { get; set; }
        public string LikeCount { get; set; }
        public string ShareCount { get; set; }
        public string Summary { get; set; }
        public List<string> Tags { get; set; }
        public string Title { get; set; }
        public string UpdatedAt { get; set; }
        public string ViewCount { get; set; }
    }
}
