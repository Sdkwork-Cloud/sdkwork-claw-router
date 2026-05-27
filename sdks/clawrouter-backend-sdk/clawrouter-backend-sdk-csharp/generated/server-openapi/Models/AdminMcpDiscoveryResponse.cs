using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminMcpDiscoveryResponse
    {
        public string? CheckedAt { get; set; }
        public int? DiscoveredCount { get; set; }
        public int? ServerId { get; set; }
        public List<AdminMcpToolItem>? Tools { get; set; }
    }
}
