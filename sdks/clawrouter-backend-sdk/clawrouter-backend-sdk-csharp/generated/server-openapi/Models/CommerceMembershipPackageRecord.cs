using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceMembershipPackageRecord
    {
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? DurationDays { get; set; }
        public string? EndsAt { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public string? PackageGroupId { get; set; }
        public string? PackageNo { get; set; }
        public string? PlanId { get; set; }
        public string? PriceAmount { get; set; }
        public string? RecurrenceCycle { get; set; }
        public string? SkuId { get; set; }
        public string? SortOrder { get; set; }
        public string? StartsAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
