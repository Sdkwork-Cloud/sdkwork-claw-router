using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ChannelEndpointsUpdateResult
    {
        public string? Code { get; set; }
        public AdminChannelEndpointMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
