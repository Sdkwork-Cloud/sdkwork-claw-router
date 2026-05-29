using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminChannelEndpointsResponse
    {
        public List<AdminChannelEndpointItem>? Items { get; set; }
    }
}
