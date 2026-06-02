using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceMembershipPlanRecord
    {
        public Dictionary<string, string>? BenefitsJson { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? LevelCode { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? PlanNo { get; set; }
        public string? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
