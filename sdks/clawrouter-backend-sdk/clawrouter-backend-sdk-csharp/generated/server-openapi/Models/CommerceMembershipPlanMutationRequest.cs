using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceMembershipPlanMutationRequest
    {
        public List<CommerceMembershipBenefitMutationRequest>? Benefits { get; set; }
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Rank { get; set; }
        public string? Status { get; set; }
    }
}
