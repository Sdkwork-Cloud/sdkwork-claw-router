using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PromotionOfferAudienceRuleRecord
    {
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? OfferVersionId { get; set; }
        public string? OrganizationId { get; set; }
        public int? Priority { get; set; }
        public string? RuleOperator { get; set; }
        public string? RuleType { get; set; }
        public string? RuleValue { get; set; }
        public Dictionary<string, string>? RuleValueJson { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
