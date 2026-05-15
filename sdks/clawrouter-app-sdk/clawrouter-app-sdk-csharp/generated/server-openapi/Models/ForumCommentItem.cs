using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumCommentItem
    {
        public ForumAuthor? Author { get; set; }
        public string? CommentId { get; set; }
        public string? Content { get; set; }
        public int? ContentId { get; set; }
        public string? ContentType { get; set; }
        public string? CreatedAt { get; set; }
        public bool? IsTop { get; set; }
        public int? Likes { get; set; }
        public int? ParentId { get; set; }
        public int? ReplyCount { get; set; }
        public string? Status { get; set; }
        public int? UserId { get; set; }
    }
}
