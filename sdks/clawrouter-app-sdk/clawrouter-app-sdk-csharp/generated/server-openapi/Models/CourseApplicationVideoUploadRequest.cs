using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseApplicationVideoUploadRequest
    {
        public string? File { get; set; }
        public string? FileName { get; set; }
    }
}
