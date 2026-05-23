using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentSessionsListResult
    {
        public string? Code { get; set; }
        public AgentSessionListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
