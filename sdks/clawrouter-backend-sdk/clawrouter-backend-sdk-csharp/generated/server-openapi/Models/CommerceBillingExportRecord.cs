using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceBillingExportRecord
    {
        public string? ApprovedBy { get; set; }
        public string? AuditLogId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? DownloadCount { get; set; }
        public string? ExpireAt { get; set; }
        public string? ExportNo { get; set; }
        public string? ExportType { get; set; }
        public string? FileHash { get; set; }
        public Dictionary<string, string>? FileManifest { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? PeriodEnd { get; set; }
        public string? PeriodStart { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? StatementId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
