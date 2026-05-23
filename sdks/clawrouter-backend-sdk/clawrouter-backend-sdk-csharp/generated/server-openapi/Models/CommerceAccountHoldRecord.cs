using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceAccountHoldRecord
    {
        public string? AccountId { get; set; }
        public string? Amount { get; set; }
        public string? AssetType { get; set; }
        public string? CreatedAt { get; set; }
        public string? ExpiresAt { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? PreholdNo { get; set; }
        public string? ReleasedAt { get; set; }
        public string? RequestNo { get; set; }
        public string? SettledAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
