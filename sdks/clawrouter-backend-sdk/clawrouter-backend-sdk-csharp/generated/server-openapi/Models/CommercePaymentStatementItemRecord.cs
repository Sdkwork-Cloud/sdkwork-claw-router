using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentStatementItemRecord
    {
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? FeeAmount { get; set; }
        public string? GrossAmount { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? MetadataJson { get; set; }
        public string? NativeOrderNo { get; set; }
        public string? NativeRefundId { get; set; }
        public string? NativeTradeId { get; set; }
        public string? NetAmount { get; set; }
        public string? OccurredAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderStatus { get; set; }
        public string? RawRowDigest { get; set; }
        public string? RowNo { get; set; }
        public string? SdkworkOutRefundNo { get; set; }
        public string? SdkworkOutTradeNo { get; set; }
        public string? SettledAt { get; set; }
        public string? StatementId { get; set; }
        public string? TenantId { get; set; }
        public string? TransactionType { get; set; }
    }
}
