using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ManifestsListResult
    {
        public string? Code { get; set; }
        public OpenPlatformManifestListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
