using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceExchangeRuleRecord
    {
        public string? CreatedAt { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? OrganizationId { get; set; }
        public string? Rate { get; set; }
        public string? Remark { get; set; }
        public string? RequestNo { get; set; }
        public string? RuleNo { get; set; }
        public string? SourceAssetType { get; set; }
        public string? Status { get; set; }
        public string? TargetAssetType { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
