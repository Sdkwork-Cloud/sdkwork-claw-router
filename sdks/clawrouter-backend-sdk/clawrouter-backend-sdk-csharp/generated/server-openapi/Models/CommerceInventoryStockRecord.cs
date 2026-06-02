using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceInventoryStockRecord
    {
        public string? AvailableQuantity { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public string? ReservedQuantity { get; set; }
        public string? SkuId { get; set; }
        public string? SoldQuantity { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Version { get; set; }
        public string? WarehouseId { get; set; }
    }
}
