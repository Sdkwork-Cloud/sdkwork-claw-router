using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseApplicationReviewRequest
    {
        public string? ReviewNote { get; set; }
        public string Status { get; set; }
    }
}
