using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformManifestItem
    {
        public string? Id { get; set; }
        public string? Key { get; set; }
        public string? Provider { get; set; }
        public string? Status { get; set; }
        public string? Type { get; set; }
        public string? Version { get; set; }
    }
}
