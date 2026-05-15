using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAccessGroupItem
    {
        public AdminCountPair? AccountCount { get; set; }
        public string? BillingType { get; set; }
        public AdminCapacityPair? Capacity { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Platform { get; set; }
        public double? RateMultiplier { get; set; }
        public string? Status { get; set; }
        public string? Type { get; set; }
        public AdminUsagePair? Usage { get; set; }
    }
}
