using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentDefinitionsCreateResult
    {
        public string? Code { get; set; }
        public AgentItemResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
