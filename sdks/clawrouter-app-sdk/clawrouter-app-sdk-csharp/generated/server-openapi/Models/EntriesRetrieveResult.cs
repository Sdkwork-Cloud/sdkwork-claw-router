using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class EntriesRetrieveResult
    {
        public string Code { get; set; }
        public MemoryEntryItem? Data { get; set; }
        public string? Msg { get; set; }
    }
}
