using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformManifestListResponse
    {
        public List<OpenPlatformManifestItem>? Items { get; set; }
    }
}
