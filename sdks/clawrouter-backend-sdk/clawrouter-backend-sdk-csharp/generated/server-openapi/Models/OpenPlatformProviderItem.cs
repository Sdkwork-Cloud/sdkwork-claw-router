using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformProviderItem
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Provider { get; set; }
        public string? Status { get; set; }
    }
}
