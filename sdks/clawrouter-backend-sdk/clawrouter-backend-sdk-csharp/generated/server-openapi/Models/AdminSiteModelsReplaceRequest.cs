using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSiteModelsReplaceRequest
    {
        public List<AdminSiteModelCreateRequest>? Items { get; set; }
    }
}
