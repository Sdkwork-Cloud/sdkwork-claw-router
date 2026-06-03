using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class SiteModelsDeleteResult
    {
        public string? Code { get; set; }
        public AdminSiteDeleteResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
