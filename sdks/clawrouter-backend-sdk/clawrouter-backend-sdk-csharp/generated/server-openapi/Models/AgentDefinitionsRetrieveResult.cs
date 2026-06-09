using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AgentDefinitionsRetrieveResult
    {
        public string Code { get; set; }
        public AdminAgentItem? Data { get; set; }
        public string? Msg { get; set; }
    }
}
