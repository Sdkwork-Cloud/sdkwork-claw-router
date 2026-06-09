using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AppModelCatalogResponse
    {
        public List<AppModelCatalogGroupOption> Groups { get; set; }
        public List<AppModelCatalogItem> Items { get; set; }
    }
}
