using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceInventoryLedgerItem
    {
        public int? BalanceAfter { get; set; }
        public string? BusinessType { get; set; }
        public string? CreatedAt { get; set; }
        public string? Direction { get; set; }
        public string? Id { get; set; }
        public string? MovementNo { get; set; }
        public int? Quantity { get; set; }
        public string? SkuId { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? WarehouseId { get; set; }
    }
}
