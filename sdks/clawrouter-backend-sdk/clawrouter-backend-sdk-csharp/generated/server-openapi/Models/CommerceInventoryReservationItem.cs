using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceInventoryReservationItem
    {
        public string? CheckoutSessionId { get; set; }
        public string? CreatedAt { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public string? OrderId { get; set; }
        public int? Quantity { get; set; }
        public string? ReservationNo { get; set; }
        public string? SkuId { get; set; }
        public string? Status { get; set; }
    }
}
