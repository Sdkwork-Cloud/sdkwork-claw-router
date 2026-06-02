using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceInventoryLedgerRecord
    {
        public string? BalanceAfter { get; set; }
        public string? BusinessType { get; set; }
        public string? CreatedAt { get; set; }
        public string? Direction { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? MovementNo { get; set; }
        public string? OrganizationId { get; set; }
        public string? Quantity { get; set; }
        public string? SkuId { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? TenantId { get; set; }
        public string? WarehouseId { get; set; }
    }
}
