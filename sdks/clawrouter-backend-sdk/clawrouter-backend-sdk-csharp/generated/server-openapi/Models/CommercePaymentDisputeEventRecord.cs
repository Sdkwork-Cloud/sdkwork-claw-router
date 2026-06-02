using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentDisputeEventRecord
    {
        public string? ActorId { get; set; }
        public string? ActorType { get; set; }
        public string? CreatedAt { get; set; }
        public string? DisputeId { get; set; }
        public string? EventNo { get; set; }
        public string? EventType { get; set; }
        public string? FromStatus { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? PayloadJson { get; set; }
        public string? TenantId { get; set; }
        public string? ToStatus { get; set; }
    }
}
