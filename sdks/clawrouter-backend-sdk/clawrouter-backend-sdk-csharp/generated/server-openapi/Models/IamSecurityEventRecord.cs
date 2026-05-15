using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamSecurityEventRecord
    {
        public string? CreatedAt { get; set; }
        public Dictionary<string, string>? DetailJson { get; set; }
        public string? EventType { get; set; }
        public string? Id { get; set; }
        public string? SessionId { get; set; }
        public string? Severity { get; set; }
        public string? TenantId { get; set; }
        public string? UserId { get; set; }
    }
}
