using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformEntryCreateRequest
    {
        public string? Key { get; set; }
        public string? Type { get; set; }
        public string? Url { get; set; }
    }
}
