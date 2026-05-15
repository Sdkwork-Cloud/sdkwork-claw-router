using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumReplyCommentRequest
    {
        public string? Content { get; set; }
        public string? DeviceInfo { get; set; }
    }
}
