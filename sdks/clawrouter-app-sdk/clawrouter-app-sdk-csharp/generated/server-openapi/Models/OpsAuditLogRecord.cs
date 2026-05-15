using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class OpsAuditLogRecord
    {
        public string? Action { get; set; }
        public string? AfterHash { get; set; }
        public string? ApprovalId { get; set; }
        public string? BeforeHash { get; set; }
        public Dictionary<string, string>? ChangeSummary { get; set; }
        public string? ClientIpHash { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OperatorId { get; set; }
        public string? OperatorNameSnapshot { get; set; }
        public string? OperatorType { get; set; }
        public string? OrganizationId { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RiskLevel { get; set; }
        public string? TargetId { get; set; }
        public string? TargetType { get; set; }
        public string? TargetUuid { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserAgentHash { get; set; }
        public string? Uuid { get; set; }
    }
}
