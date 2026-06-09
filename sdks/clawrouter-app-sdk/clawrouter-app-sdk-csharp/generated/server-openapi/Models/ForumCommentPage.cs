using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumCommentPage
    {
        public List<ForumCommentItem> Content { get; set; }
        public List<ForumCommentItem> Items { get; set; }
        public string Page { get; set; }
        public string Size { get; set; }
        public string TotalElements { get; set; }
    }
}
