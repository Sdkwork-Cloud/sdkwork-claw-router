using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PlusFavoriteRecord
    {
        public string? FolderId { get; set; }
        public Dictionary<string, string>? Image { get; set; }
        public string? LastViewedAt { get; set; }
        public string? Remark { get; set; }
        public string? Tags { get; set; }
        public string? Title { get; set; }
        public string? UserId { get; set; }
    }
}
