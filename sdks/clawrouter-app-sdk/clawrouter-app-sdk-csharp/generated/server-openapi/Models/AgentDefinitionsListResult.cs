using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentDefinitionsListResult
    {
        public string Code { get; set; }
        public AgentListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
