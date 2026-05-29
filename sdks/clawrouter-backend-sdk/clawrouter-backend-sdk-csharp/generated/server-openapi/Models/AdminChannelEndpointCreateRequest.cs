using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminChannelEndpointCreateRequest
    {
        public string? ApiEndpointCode { get; set; }
        public string? BaseUrl { get; set; }
        public string? ChannelId { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public int? Priority { get; set; }
        public string? RegionCode { get; set; }
        public string? Status { get; set; }
        public string? VendorCode { get; set; }
        public int? Weight { get; set; }
    }
}
