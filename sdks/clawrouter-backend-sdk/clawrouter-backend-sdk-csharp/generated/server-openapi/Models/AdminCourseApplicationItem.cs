using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCourseApplicationItem
    {
        public string? Id { get; set; }
        public string? ReviewedAt { get; set; }
        public string? Status { get; set; }
    }
}
