using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseCommentModerationRequest
    {
        public string? ModerationNote { get; set; }
        public string Status { get; set; }
    }
}
