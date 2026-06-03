using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SiteModelsUpdateResult
    {
        public string? Code { get; set; }
        public AdminSiteModelMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
