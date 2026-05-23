using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceOrderRecord
    {
        public string? CancelledAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? ExpiredAt { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? OrderNo { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? PaidAt { get; set; }
        public string? RequestNo { get; set; }
        public string? Status { get; set; }
        public string? Subject { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
