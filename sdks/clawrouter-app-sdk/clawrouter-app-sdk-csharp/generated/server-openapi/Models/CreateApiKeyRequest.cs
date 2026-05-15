using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CreateApiKeyRequest
    {
        public string? Expires { get; set; }
        public string? Group { get; set; }
        public string? IpLimit { get; set; }
        public bool? IsUnlimitedQuota { get; set; }
        public List<string>? Modalities { get; set; }
        public string? Name { get; set; }
        public string? Quota { get; set; }
    }
}
