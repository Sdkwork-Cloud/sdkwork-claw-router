using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformProviderListResponse
    {
        public List<OpenPlatformProviderItem>? Items { get; set; }
    }
}
