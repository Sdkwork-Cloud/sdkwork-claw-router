using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class GenerationListResult
    {
        public string? Code { get; set; }
        public GenerationHistoryResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
