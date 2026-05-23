using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ProvidersListResult
    {
        public string? Code { get; set; }
        public OpenPlatformProviderListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
