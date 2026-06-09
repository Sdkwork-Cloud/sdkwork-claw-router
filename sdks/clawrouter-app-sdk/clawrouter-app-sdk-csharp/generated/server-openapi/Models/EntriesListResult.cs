using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class EntriesListResult
    {
        public string Code { get; set; }
        public MemoryEntryListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
