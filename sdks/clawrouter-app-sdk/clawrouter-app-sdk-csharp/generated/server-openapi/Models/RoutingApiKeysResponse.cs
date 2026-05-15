using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class RoutingApiKeysResponse
    {
        public List<Dictionary<string, object>>? Items { get; set; }
    }
}
