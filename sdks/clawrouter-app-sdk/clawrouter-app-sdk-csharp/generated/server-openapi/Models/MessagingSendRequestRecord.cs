using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class MessagingSendRequestRecord
    {
        public string? AcceptedAt { get; set; }
        public string? AppId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DeliveredAt { get; set; }
        public string? ExpiresAt { get; set; }
        public string? FailedAt { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? RequestId { get; set; }
        public string? ResolvedProviderAccountId { get; set; }
        public string? ResolvedRouteRuleId { get; set; }
        public string? ResolvedSenderIdentityId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? ScheduledAt { get; set; }
        public string? SentAt { get; set; }
        public string? Status { get; set; }
        public string? TargetMasked { get; set; }
        public string? TemplateVariantId { get; set; }
        public string? TemplateVersionId { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
