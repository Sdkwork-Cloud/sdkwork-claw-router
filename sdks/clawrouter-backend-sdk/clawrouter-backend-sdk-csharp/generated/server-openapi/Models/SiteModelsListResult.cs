using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SiteModelsListResult
    {
        public string? Code { get; set; }
        public AdminSiteModelsResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
