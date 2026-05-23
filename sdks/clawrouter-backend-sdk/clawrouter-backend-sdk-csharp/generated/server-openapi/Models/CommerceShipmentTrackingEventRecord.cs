using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceShipmentTrackingEventRecord
    {
        public string? CreatedAt { get; set; }
        public string? Description { get; set; }
        public string? EventCode { get; set; }
        public string? EventTime { get; set; }
        public string? Location { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? RawPayloadJson { get; set; }
        public string? ShipmentId { get; set; }
        public string? TenantId { get; set; }
    }
}
