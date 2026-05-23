using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class RoutingStrategyUpdateResult
    {
        public string? Code { get; set; }
        public UpdateRoutingStrategyResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
