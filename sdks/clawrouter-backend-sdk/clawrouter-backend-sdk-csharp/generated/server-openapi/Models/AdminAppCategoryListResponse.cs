using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAppCategoryListResponse
    {
        public List<AdminAppCategoryItem> Items { get; set; }
    }
}
