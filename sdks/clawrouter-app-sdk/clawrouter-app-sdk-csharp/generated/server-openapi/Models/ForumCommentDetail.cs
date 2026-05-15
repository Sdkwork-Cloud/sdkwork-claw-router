using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumCommentDetail
    {
        public ForumAuthor? Author { get; set; }
        public string? CommentId { get; set; }
        public string? Content { get; set; }
        public int? ContentId { get; set; }
        public string? ContentType { get; set; }
        public string? CreatedAt { get; set; }
        public string? DeviceInfo { get; set; }
        public string? IpAddress { get; set; }
        public bool? IsTop { get; set; }
        public int? Likes { get; set; }
        public int? ParentId { get; set; }
        public List<ForumCommentItem>? Replies { get; set; }
        public int? ReplyCount { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
        public int? UserId { get; set; }
    }
}
