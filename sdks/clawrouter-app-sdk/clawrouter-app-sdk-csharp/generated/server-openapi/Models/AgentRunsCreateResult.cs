using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunsCreateResult
    {
        public string? Code { get; set; }
        public AgentRunResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
