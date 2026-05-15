using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class RoutingChannelTestResponse
    {
        public string? ChannelId { get; set; }
        public RoutingChannelItem? Item { get; set; }
        public string? Latency { get; set; }
        public string? Status { get; set; }
        public bool? Success { get; set; }
    }
}
