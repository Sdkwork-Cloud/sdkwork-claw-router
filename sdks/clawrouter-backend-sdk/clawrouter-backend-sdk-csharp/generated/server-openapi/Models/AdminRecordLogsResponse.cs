using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminRecordLogsResponse
    {
        public List<AdminRecordLogItem>? Logs { get; set; }
        public int? Page { get; set; }
        public int? PageSize { get; set; }
        public int? Total { get; set; }
    }
}
