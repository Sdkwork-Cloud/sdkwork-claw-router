using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceMembershipEntitlementRecord
    {
        public string? CreatedAt { get; set; }
        public string? EntitlementCode { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? PlanId { get; set; }
        public string? QuotaAmount { get; set; }
        public string? QuotaPeriod { get; set; }
        public string? ResetPolicy { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
