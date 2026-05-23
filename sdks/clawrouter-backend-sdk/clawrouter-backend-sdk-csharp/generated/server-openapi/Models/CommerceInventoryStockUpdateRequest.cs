using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceInventoryStockUpdateRequest
    {
        public int? AvailableQuantity { get; set; }
        public string? ReasonCode { get; set; }
        public int? ReservedQuantity { get; set; }
        public string? Status { get; set; }
        public int? Version { get; set; }
    }
}
