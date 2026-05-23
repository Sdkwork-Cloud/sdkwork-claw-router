using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunsListResult
    {
        public string? Code { get; set; }
        public AgentRunListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
