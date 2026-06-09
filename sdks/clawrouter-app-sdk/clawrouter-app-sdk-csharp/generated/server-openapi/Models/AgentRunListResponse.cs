using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunListResponse
    {
        public List<AgentRunItem> Items { get; set; }
    }
}
