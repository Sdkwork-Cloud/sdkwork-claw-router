using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AppsTemplatesCreateResult
    {
        public string? Code { get; set; }
        public AdminAppTemplateMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
