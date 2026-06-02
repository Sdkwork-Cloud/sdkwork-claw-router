using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceRefundItemRecord
    {
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? OrderItemId { get; set; }
        public string? OrganizationId { get; set; }
        public string? Quantity { get; set; }
        public string? RefundAmount { get; set; }
        public string? RefundId { get; set; }
        public string? ShippingRefundAmount { get; set; }
        public string? TaxRefundAmount { get; set; }
        public string? TenantId { get; set; }
    }
}
