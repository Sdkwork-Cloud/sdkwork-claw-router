using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class GenerationHistoryResponse
    {
        public List<GenerationHistoryItem>? Items { get; set; }
    }
}
