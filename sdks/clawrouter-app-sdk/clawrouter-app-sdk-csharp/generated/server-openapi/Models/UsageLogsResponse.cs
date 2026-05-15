using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class UsageLogsResponse
    {
        public List<UsageLogItem>? Logs { get; set; }
        public int? Page { get; set; }
        public int? PageSize { get; set; }
        public int? Total { get; set; }
    }
}
