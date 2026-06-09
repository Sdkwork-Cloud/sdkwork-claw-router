using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumCreateCommentRequest
    {
        public string Content { get; set; }
        public string ContentId { get; set; }
        public string ContentType { get; set; }
        public string? DeviceInfo { get; set; }
    }
}
