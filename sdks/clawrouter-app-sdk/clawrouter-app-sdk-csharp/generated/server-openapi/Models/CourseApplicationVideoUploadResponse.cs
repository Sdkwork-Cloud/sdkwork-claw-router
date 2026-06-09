using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseApplicationVideoUploadResponse
    {
        public string ContentType { get; set; }
        public string FileName { get; set; }
        public string Sha256 { get; set; }
        public string SizeBytes { get; set; }
        public string UploadedAt { get; set; }
        public MediaResource Video { get; set; }
    }
}
