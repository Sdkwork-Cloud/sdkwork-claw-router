using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceInventoryReservationRecord
    {
        public string? CheckoutSessionId { get; set; }
        public string? CreatedAt { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? OrderId { get; set; }
        public string? OrganizationId { get; set; }
        public string? Quantity { get; set; }
        public string? ReservationNo { get; set; }
        public string? SkuId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? WarehouseId { get; set; }
    }
}
