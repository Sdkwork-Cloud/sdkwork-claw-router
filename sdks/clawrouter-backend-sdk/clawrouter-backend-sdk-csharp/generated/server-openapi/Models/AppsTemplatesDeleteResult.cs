using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AppsTemplatesDeleteResult
    {
        public string? Code { get; set; }
        public AdminAppTemplateDeleteResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
