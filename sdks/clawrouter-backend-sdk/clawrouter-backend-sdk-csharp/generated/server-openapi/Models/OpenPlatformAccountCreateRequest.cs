using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformAccountCreateRequest
    {
        public string? AesKeyRef { get; set; }
        public string? AppId { get; set; }
        public string? Key { get; set; }
        public string? Name { get; set; }
        public string? Provider { get; set; }
        public string? SecretRef { get; set; }
        public string? TokenRef { get; set; }
        public string? Type { get; set; }
    }
}
