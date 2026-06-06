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
        public string? ContentId { get; set; }
        public string? ContentType { get; set; }
        public string? CreatedAt { get; set; }
        public string? DeviceInfo { get; set; }
        public string? IpAddress { get; set; }
        public bool? IsTop { get; set; }
        public string? Likes { get; set; }
        public string? ParentId { get; set; }
        public List<ForumCommentItem>? Replies { get; set; }
        public string? ReplyCount { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
    }
}
