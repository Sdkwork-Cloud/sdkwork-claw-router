using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class MessagingRouteRuleRecord
    {
        public string? AppId { get; set; }
        public string? Channel { get; set; }
        public string? CountryCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeliveryPurpose { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public Dictionary<string, string>? FailoverPolicy { get; set; }
        public string? Id { get; set; }
        public string? Locale { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public int? Priority { get; set; }
        public string? RuleCode { get; set; }
        public string? SceneCode { get; set; }
        public Dictionary<string, string>? SelectionPolicy { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserSegment { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public int? Weight { get; set; }
    }
}
