using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommentsCreateResult
    {
        public string Code { get; set; }
        public ForumCommentItem? Data { get; set; }
        public string? Msg { get; set; }
    }
}
