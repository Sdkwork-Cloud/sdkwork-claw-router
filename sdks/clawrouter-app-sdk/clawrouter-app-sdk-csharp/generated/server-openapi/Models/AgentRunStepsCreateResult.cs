using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunStepsCreateResult
    {
        public string Code { get; set; }
        public AgentRunStepResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
