using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentDefinitionsRetrieveResult
    {
        public string? Code { get; set; }
        public AgentItem? Data { get; set; }
        public string? Msg { get; set; }
    }
}
