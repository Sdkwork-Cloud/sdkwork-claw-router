using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceDigitalDeliveryRecord
    {
        public string? CreatedAt { get; set; }
        public string? DeliveredAt { get; set; }
        public string? DeliveryNo { get; set; }
        public string? DeliveryRef { get; set; }
        public string? DeliveryType { get; set; }
        public string? FulfillmentId { get; set; }
        public string? Id { get; set; }
        public string? OrderItemId { get; set; }
        public string? OrganizationId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
