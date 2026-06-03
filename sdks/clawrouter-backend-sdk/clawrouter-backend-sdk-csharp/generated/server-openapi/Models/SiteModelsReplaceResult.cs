using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SiteModelsReplaceResult
    {
        public string? Code { get; set; }
        public AdminSiteModelsReplaceResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
