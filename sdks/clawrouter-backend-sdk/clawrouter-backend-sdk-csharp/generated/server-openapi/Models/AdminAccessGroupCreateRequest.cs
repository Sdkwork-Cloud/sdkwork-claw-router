using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAccessGroupCreateRequest
    {
        public string? BillingType { get; set; }
        public Dictionary<string, object>? Capacity { get; set; }
        public string? Name { get; set; }
        public string? Platform { get; set; }
        public double? RateMultiplier { get; set; }
        public string? Status { get; set; }
        public string? Type { get; set; }
    }
}
