using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillReviewRequest
    {
        public string? Comment { get; set; }
        public string? ReviewComment { get; set; }
    }
}
