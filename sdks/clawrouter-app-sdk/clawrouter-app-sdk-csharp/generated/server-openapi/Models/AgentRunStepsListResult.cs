using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunStepsListResult
    {
        public string? Code { get; set; }
        public AgentRunStepListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
