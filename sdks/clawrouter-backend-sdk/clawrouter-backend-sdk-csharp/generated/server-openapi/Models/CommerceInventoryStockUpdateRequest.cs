using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceInventoryStockUpdateRequest
    {
        public string? AvailableQuantity { get; set; }
        public string? ReasonCode { get; set; }
        public string? ReservedQuantity { get; set; }
        public string? Status { get; set; }
        public string? Version { get; set; }
    }
}
