using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AppsStoreListResult
    {
        public string Code { get; set; }
        public AppCatalogResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
