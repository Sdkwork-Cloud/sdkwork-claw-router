using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AppsCategoriesListResult
    {
        public string? Code { get; set; }
        public AdminAppCategoryListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
