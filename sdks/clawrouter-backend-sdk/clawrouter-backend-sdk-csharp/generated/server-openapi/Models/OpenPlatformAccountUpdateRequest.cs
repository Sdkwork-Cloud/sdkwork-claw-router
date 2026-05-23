using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformAccountUpdateRequest
    {
        public string? AesKeyRef { get; set; }
        public string? AppId { get; set; }
        public string? DefaultEntryId { get; set; }
        public string? Name { get; set; }
        public bool? QrDefault { get; set; }
        public string? SecretRef { get; set; }
        public string? Status { get; set; }
        public string? TokenRef { get; set; }
    }
}
