using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceMembershipPackageGroupMutationRequest
    {
        public string? BillingCycle { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public int? DurationDays { get; set; }
        public string? Name { get; set; }
        public int? SortWeight { get; set; }
        public string? Status { get; set; }
    }
}
