using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceAccountLedgerEntryRecord
    {
        public string? AccountId { get; set; }
        public string? Amount { get; set; }
        public string? AssetType { get; set; }
        public string? BalanceAfter { get; set; }
        public string? BusinessType { get; set; }
        public string? CreatedAt { get; set; }
        public string? Direction { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? Remark { get; set; }
        public string? RequestNo { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? TenantId { get; set; }
        public string? TransactionNo { get; set; }
    }
}
