using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IntegrationProviderInvoiceImportRecord
    {
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? Id { get; set; }
        public string? ImportNo { get; set; }
        public string? ImportStatus { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? PeriodEnd { get; set; }
        public string? PeriodStart { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? SourceFileRef { get; set; }
        public string? SourceHash { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TotalAmount { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
