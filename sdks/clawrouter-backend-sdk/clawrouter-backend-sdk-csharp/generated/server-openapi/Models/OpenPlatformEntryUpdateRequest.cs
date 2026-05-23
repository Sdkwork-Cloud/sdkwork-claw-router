using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformEntryUpdateRequest
    {
        public string? Key { get; set; }
        public string? Status { get; set; }
        public string? Type { get; set; }
        public string? Url { get; set; }
    }
}
