using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumFeedItem
    {
        public ForumAuthor? Author { get; set; }
        public int? CategoryId { get; set; }
        public int? CommentCount { get; set; }
        public string? Content { get; set; }
        public string? ContentType { get; set; }
        public MediaResource? Cover { get; set; }
        public string? CreatedAt { get; set; }
        public int? Id { get; set; }
        public bool? IsCollected { get; set; }
        public bool? IsHot { get; set; }
        public bool? IsLiked { get; set; }
        public bool? IsRecommended { get; set; }
        public bool? IsTop { get; set; }
        public int? LikeCount { get; set; }
        public int? ShareCount { get; set; }
        public string? Summary { get; set; }
        public List<string>? Tags { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public int? ViewCount { get; set; }
    }
}
