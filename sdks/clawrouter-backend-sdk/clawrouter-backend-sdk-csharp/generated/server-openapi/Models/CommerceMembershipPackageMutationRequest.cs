using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceMembershipPackageMutationRequest
    {
        public string? Code { get; set; }
        public string? CurrencyCode { get; set; }
        public int? DurationDays { get; set; }
        public string? Name { get; set; }
        public string? PackageGroupId { get; set; }
        public string? PlanId { get; set; }
        public string? PriceAmount { get; set; }
        public string? Status { get; set; }
    }
}
