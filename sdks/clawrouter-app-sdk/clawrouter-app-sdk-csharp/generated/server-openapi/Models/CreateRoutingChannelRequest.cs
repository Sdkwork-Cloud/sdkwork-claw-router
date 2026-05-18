using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CreateRoutingChannelRequest
    {
        public string? AccessType { get; set; }
        public string? BaseUrl { get; set; }
        public List<string>? Capabilities { get; set; }
        public List<string>? Models { get; set; }
        public string? Name { get; set; }
        public string? Protocol { get; set; }
        public ProviderRetryPolicy? RetryPolicy { get; set; }
        public string? SecretRef { get; set; }
        public string? Status { get; set; }
        public int? TimeoutMs { get; set; }
        public string? Vendor { get; set; }
        public int? Weight { get; set; }
    }
}
