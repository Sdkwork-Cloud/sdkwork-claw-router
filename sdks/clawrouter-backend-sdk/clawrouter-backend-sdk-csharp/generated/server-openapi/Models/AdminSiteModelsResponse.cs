using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSiteModelsResponse
    {
        public List<AdminSiteModelItem>? Items { get; set; }
    }
}
