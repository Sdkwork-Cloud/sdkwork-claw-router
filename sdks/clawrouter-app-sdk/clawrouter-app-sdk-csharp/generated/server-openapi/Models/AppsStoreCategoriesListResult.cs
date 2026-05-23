using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AppsStoreCategoriesListResult
    {
        public string? Code { get; set; }
        public AppCategoriesResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
