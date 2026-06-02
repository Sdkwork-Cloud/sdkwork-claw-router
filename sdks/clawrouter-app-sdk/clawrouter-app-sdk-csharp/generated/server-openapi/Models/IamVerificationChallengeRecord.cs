using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamVerificationChallengeRecord
    {
        public string? ChallengeStatus { get; set; }
        public string? Channel { get; set; }
        public string? CodeHash { get; set; }
        public string? CodeId { get; set; }
        public string? ConsumedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeliveryRequestId { get; set; }
        public string? ExpiresAt { get; set; }
        public string? HashAlgorithm { get; set; }
        public string? Id { get; set; }
        public string? LockedUntil { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? PolicySnapshot { get; set; }
        public string? SaltRef { get; set; }
        public string? SceneCode { get; set; }
        public string? Status { get; set; }
        public string? TargetHash { get; set; }
        public string? TargetMasked { get; set; }
        public string? TargetType { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? VerifiedAt { get; set; }
        public int? VerifyAttempts { get; set; }
        public string? Version { get; set; }
    }
}
