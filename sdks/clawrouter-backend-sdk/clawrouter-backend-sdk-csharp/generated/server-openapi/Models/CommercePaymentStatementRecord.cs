using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentStatementRecord
    {
        public string? CreatedAt { get; set; }
        public string? DownloadStatus { get; set; }
        public string? DownloadedAt { get; set; }
        public string? FeeAmount { get; set; }
        public string? FileDigest { get; set; }
        public string? FileRef { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? NetAmount { get; set; }
        public string? OrganizationId { get; set; }
        public string? ParseStatus { get; set; }
        public string? ParsedAt { get; set; }
        public string? PeriodEnd { get; set; }
        public string? PeriodStart { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderStatementId { get; set; }
        public string? RequestNo { get; set; }
        public string? RowCount { get; set; }
        public string? SettlementCurrency { get; set; }
        public string? StatementNo { get; set; }
        public string? StatementType { get; set; }
        public string? TenantId { get; set; }
        public string? TotalAmount { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
