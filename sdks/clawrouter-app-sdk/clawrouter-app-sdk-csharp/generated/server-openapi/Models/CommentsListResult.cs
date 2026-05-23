using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommentsListResult
    {
        public string? Code { get; set; }
        public ForumCommentPage? Data { get; set; }
        public string? Msg { get; set; }
    }
}
