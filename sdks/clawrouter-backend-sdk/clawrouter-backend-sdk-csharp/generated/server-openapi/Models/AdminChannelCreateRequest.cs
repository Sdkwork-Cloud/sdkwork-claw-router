using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminChannelCreateRequest
    {
        public string? AccessType { get; set; }
        public string? ApiKey { get; set; }
        public string? BaseUrl { get; set; }
        public List<string>? Capabilities { get; set; }
        public string? ChannelType { get; set; }
        public ProviderCircuitBreakerPolicy? CircuitBreakerPolicy { get; set; }
        public string? ExpiresAt { get; set; }
        public List<string>? Models { get; set; }
        public string? Name { get; set; }
        public string? Protocol { get; set; }
        public List<string>? ResourceCodes { get; set; }
        public ProviderRetryPolicy? RetryPolicy { get; set; }
        public string? SecretRef { get; set; }
        public string? Status { get; set; }
        public int? TimeoutMs { get; set; }
        public string? Vendor { get; set; }
        public int? Weight { get; set; }
    }
}
