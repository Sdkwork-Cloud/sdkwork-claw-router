using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceOrderCancellationRecord
    {
        public string? ApprovedBy { get; set; }
        public string? CancellationNo { get; set; }
        public string? CompletedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? OrderId { get; set; }
        public string? OrganizationId { get; set; }
        public string? ReasonCode { get; set; }
        public string? ReasonMessage { get; set; }
        public string? RequestedBy { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
    }
}
