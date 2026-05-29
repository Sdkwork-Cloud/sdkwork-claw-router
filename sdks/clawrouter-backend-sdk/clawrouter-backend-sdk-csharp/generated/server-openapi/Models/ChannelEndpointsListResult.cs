using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ChannelEndpointsListResult
    {
        public string? Code { get; set; }
        public AdminChannelEndpointsResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
