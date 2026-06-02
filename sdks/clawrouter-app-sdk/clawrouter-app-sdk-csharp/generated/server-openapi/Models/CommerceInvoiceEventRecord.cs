using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceInvoiceEventRecord
    {
        public string? ActorId { get; set; }
        public string? ActorType { get; set; }
        public string? CreatedAt { get; set; }
        public string? EventNo { get; set; }
        public string? EventType { get; set; }
        public string? FromStatus { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? InvoiceId { get; set; }
        public string? Message { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? PayloadJson { get; set; }
        public string? ReasonCode { get; set; }
        public string? RequestId { get; set; }
        public string? TenantId { get; set; }
        public string? ToStatus { get; set; }
    }
}
