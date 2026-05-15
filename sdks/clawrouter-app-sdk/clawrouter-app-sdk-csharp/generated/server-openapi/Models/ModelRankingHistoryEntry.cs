using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ModelRankingHistoryEntry
    {
        public string? CatalogKey { get; set; }
        public string? Color { get; set; }
        public string? Model { get; set; }
        public int? Rank { get; set; }
        public int? Volume { get; set; }
    }
}
