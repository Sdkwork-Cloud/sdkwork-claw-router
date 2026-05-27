using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAccessGroupChannelBindingInput
    {
        public List<string>? Capabilities { get; set; }
        public string? ChannelId { get; set; }
        public List<string>? ModelScope { get; set; }
        public int? Priority { get; set; }
        public string? Status { get; set; }
        public int? Weight { get; set; }
    }
}
