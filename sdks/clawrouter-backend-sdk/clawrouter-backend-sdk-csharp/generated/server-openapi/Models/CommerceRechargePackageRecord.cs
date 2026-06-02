using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceRechargePackageRecord
    {
        public string? BonusPoints { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? ExternalId { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? PackageNo { get; set; }
        public string? PriceAmount { get; set; }
        public string? RequestNo { get; set; }
        public string? SkuId { get; set; }
        public string? SortWeight { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? ValidFrom { get; set; }
        public string? ValidTo { get; set; }
    }
}
