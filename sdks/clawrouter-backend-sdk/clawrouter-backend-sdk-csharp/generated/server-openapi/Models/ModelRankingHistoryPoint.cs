using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ModelRankingHistoryPoint
    {
        public string? Date { get; set; }
        public List<ModelRankingHistoryEntry>? Entries { get; set; }
        public int? Index { get; set; }
    }
}
