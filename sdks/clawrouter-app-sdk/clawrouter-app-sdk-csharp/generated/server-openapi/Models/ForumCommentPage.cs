using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumCommentPage
    {
        public List<ForumCommentItem>? Content { get; set; }
        public List<ForumCommentItem>? Items { get; set; }
        public int? Page { get; set; }
        public int? Size { get; set; }
        public int? TotalElements { get; set; }
    }
}
