using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamPolicyRecord
    {
        public string? Code { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public Dictionary<string, string>? PolicyJson { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
