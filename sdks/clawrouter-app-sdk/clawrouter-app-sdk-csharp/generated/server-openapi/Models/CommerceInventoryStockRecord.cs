using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceInventoryStockRecord
    {
        public string? CreatedAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? SkuId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? WarehouseId { get; set; }
    }
}
