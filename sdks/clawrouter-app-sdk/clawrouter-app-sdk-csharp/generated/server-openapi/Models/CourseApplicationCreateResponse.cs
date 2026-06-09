using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseApplicationCreateResponse
    {
        public string ApplicationId { get; set; }
        public string Category { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactName { get; set; }
        public string Description { get; set; }
        public string? ExternalBvid { get; set; }
        public string Id { get; set; }
        public string SourceProvider { get; set; }
        public string Status { get; set; }
        public string SubmittedAt { get; set; }
        public string Title { get; set; }
        public MediaResource? Video { get; set; }
    }
}
