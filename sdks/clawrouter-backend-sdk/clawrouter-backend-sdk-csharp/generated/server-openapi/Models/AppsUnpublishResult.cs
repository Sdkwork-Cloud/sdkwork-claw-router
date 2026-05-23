using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AppsUnpublishResult
    {
        public string? Code { get; set; }
        public AdminAppMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
