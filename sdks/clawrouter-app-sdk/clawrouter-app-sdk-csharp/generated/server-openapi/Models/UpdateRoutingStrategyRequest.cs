using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class UpdateRoutingStrategyRequest
    {
        public List<Dictionary<string, object>>? MappingRules { get; set; }
        public string? Strategy { get; set; }
    }
}
