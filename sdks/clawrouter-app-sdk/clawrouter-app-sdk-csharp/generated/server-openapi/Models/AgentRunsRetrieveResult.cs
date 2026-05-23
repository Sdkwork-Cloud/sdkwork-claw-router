using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunsRetrieveResult
    {
        public string? Code { get; set; }
        public AgentRunItem? Data { get; set; }
        public string? Msg { get; set; }
    }
}
