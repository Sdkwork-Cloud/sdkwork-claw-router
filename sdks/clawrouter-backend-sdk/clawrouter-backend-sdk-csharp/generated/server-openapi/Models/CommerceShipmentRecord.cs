using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceShipmentRecord
    {
        public string? CarrierCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? DeliveredAt { get; set; }
        public string? FulfillmentId { get; set; }
        public string? OrganizationId { get; set; }
        public string? ShipmentNo { get; set; }
        public string? ShippedAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TrackingNo { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
