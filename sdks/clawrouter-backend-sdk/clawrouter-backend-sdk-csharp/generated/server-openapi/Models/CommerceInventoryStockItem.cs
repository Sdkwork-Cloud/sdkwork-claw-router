using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceInventoryStockItem
    {
        public int? AvailableQuantity { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public int? ReservedQuantity { get; set; }
        public string? SkuId { get; set; }
        public int? SoldQuantity { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
        public int? Version { get; set; }
        public string? WarehouseId { get; set; }
    }
}
