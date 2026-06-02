using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceIdempotencyKeyRecord
    {
        public string? CreatedAt { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? LockedUntil { get; set; }
        public string? OrganizationId { get; set; }
        public string? RequestHash { get; set; }
        public string? ResponseJson { get; set; }
        public string? Scope { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
