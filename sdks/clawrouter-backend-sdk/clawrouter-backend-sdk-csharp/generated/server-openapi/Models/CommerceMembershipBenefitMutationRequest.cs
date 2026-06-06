using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceMembershipBenefitMutationRequest
    {
        public string? BenefitKey { get; set; }
        public bool? Claimed { get; set; }
        public string? Description { get; set; }
        public MediaResource? Icon { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? UsageLimit { get; set; }
        public string? UsedCount { get; set; }
    }
}
