using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamGatewayApiKeyRecord
    {
        public string? ChannelGroupId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Environment { get; set; }
        public string? ExpireAt { get; set; }
        public string? HashAlg { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? KeyDisplayMasked { get; set; }
        public string? KeyHash { get; set; }
        public string? KeyPrefix { get; set; }
        public string? LastRevealedAt { get; set; }
        public string? LastUsedAt { get; set; }
        public string? LastUsedIpHash { get; set; }
        public string? LastUsedIpMasked { get; set; }
        public string? LastUsedIpRegion { get; set; }
        public string? LegacyApiKeyId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Name { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? PolicyId { get; set; }
        public string? QuotaPolicyId { get; set; }
        public string? RateLimitPolicyId { get; set; }
        public string? RevokedAt { get; set; }
        public string? RevokedBy { get; set; }
        public string? RotatedFromKeyId { get; set; }
        public string? SecretVersion { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
