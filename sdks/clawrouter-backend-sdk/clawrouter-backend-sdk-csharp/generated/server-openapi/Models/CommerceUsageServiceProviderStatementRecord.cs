using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceUsageServiceProviderStatementRecord
    {
        public string? BuyerProviderId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? DueAt { get; set; }
        public string? GeneratedAt { get; set; }
        public string? Id { get; set; }
        public string? InvoiceId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PaidAt { get; set; }
        public string? PayableAmount { get; set; }
        public string? PaymentStatus { get; set; }
        public string? Period { get; set; }
        public string? PeriodEnd { get; set; }
        public string? PeriodStart { get; set; }
        public string? RebuildVersion { get; set; }
        public string? ReceivableAmount { get; set; }
        public string? SellerProviderId { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? StatementNo { get; set; }
        public string? StatementStatus { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TotalRequests { get; set; }
        public string? TotalTokens { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
    }
}
