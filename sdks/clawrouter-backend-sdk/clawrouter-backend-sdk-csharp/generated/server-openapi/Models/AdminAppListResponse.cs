using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAppListResponse
    {
        public bool? HasNextPage { get; set; }
        public List<AdminAppItemResponse>? Items { get; set; }
        public string? Page { get; set; }
        public string? PageSize { get; set; }
        public string? Total { get; set; }
    }
}
