using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformAccountUpdateRequest
    {
        public string? AppId { get; set; }
        public string? AppSecret { get; set; }
        public string? DefaultEntryId { get; set; }
        public string? EncodingAesKey { get; set; }
        public string? Name { get; set; }
        public bool? QrDefault { get; set; }
        public string? Status { get; set; }
        public string? Token { get; set; }
    }
}
