using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class IamDeviceRecord
    {
        public string? CreatedAt { get; set; }
        public string? DeviceFingerprint { get; set; }
        public string? Id { get; set; }
        public string? LastSeenAt { get; set; }
        public string? Name { get; set; }
        public string? TenantId { get; set; }
        public bool? Trusted { get; set; }
        public string? UserId { get; set; }
    }
}
