using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class EntriesCreateResult
    {
        public string? Code { get; set; }
        public MemoryEntryResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
