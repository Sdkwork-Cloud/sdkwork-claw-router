using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class GenerationHistoryItem
    {
        public string? AspectRatio { get; set; }
        public string? CreatedAt { get; set; }
        public string? Date { get; set; }
        public int? DurationSeconds { get; set; }
        public string? Id { get; set; }
        public List<string>? Images { get; set; }
        public string? ModelCatalogKey { get; set; }
        public string? ModelInfo { get; set; }
        public string? OutputText { get; set; }
        public string? Prompt { get; set; }
        public string? Status { get; set; }
        public string? Type { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Url { get; set; }
        public List<GenerationHistoryMediaItem>? Videos { get; set; }
    }
}
