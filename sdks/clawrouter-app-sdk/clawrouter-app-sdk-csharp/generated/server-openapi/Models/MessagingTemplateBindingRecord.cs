using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class MessagingTemplateBindingRecord
    {
        public string? ApprovalStatus { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public string? LastSyncedAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public Dictionary<string, string>? ProviderPayload { get; set; }
        public string? ProviderTemplateCode { get; set; }
        public string? ProviderTemplateVersion { get; set; }
        public string? RejectionReason { get; set; }
        public string? Status { get; set; }
        public string? SyncPayloadHash { get; set; }
        public string? TemplateVariantId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
