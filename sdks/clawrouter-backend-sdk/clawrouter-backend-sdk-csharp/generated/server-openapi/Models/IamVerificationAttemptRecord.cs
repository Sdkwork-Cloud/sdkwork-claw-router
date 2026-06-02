using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamVerificationAttemptRecord
    {
        public string? ChallengeId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DeviceHash { get; set; }
        public string? FailureReason { get; set; }
        public string? Id { get; set; }
        public string? IpHash { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OccurredAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? RequestId { get; set; }
        public string? Result { get; set; }
        public string? RetentionUntil { get; set; }
        public Dictionary<string, string>? RiskSnapshot { get; set; }
        public string? SceneCode { get; set; }
        public string? Status { get; set; }
        public string? TargetHash { get; set; }
        public string? TargetType { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
