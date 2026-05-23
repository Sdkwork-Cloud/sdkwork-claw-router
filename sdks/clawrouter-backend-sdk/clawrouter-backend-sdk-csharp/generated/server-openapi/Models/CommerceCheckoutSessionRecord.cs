using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceCheckoutSessionRecord
    {
        public string? CheckoutSessionNo { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? ExpiresAt { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? RequestHash { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
