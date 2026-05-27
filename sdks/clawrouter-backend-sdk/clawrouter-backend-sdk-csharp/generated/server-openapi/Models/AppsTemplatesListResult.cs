using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AppsTemplatesListResult
    {
        public string? Code { get; set; }
        public AdminAppTemplateListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
