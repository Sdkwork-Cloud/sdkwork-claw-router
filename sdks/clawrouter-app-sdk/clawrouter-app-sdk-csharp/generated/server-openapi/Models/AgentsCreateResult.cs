using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentsCreateResult
    {
        public string? Code { get; set; }
        public AgentItemResponse? Data { get; set; }
        public string? Message { get; set; }
        public string? Msg { get; set; }
    }
}
