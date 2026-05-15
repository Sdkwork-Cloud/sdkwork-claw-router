using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PlusCommentsRecord
    {
        public Dictionary<string, string>? Author { get; set; }
        public string? DeviceInfo { get; set; }
        public string? IpAddress { get; set; }
        public string? ParentId { get; set; }
        public string? Path { get; set; }
        public string? UserId { get; set; }
    }
}
