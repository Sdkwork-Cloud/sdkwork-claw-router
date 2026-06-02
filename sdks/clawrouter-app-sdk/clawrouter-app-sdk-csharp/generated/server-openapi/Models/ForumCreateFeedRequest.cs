using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ForumCreateFeedRequest
    {
        public int? CategoryId { get; set; }
        public string? Content { get; set; }
        public List<MediaResource>? Images { get; set; }
        public string? Source { get; set; }
        public string? SourceUrl { get; set; }
        public List<string>? Tags { get; set; }
        public string? Title { get; set; }
    }
}
