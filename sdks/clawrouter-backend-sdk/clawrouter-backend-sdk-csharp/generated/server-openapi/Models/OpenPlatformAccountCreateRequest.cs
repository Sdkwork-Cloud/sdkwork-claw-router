using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformAccountCreateRequest
    {
        public string? AppId { get; set; }
        public string? AppSecret { get; set; }
        public string? EncodingAesKey { get; set; }
        public string? Key { get; set; }
        public string? Name { get; set; }
        public string? Provider { get; set; }
        public string? Token { get; set; }
        public string? Type { get; set; }
    }
}
