using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamUserLoginEventRecord
    {
        public string? AuthMethod { get; set; }
        public string? AuthProvider { get; set; }
        public string? ClientIpHash { get; set; }
        public string? ClientIpMasked { get; set; }
        public string? ClientIpRegion { get; set; }
        public string? CreatedAt { get; set; }
        public string? DeviceFingerprintHash { get; set; }
        public string? DeviceLabel { get; set; }
        public string? FailureReasonCode { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public string? LoginResult { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public bool? MfaVerified { get; set; }
        public string? OccurredAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RiskLevel { get; set; }
        public string? SessionIdHash { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserAgentHash { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
