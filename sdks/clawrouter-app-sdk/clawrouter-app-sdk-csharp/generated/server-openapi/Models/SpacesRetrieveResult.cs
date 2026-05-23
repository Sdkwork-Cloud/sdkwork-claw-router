using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SpacesRetrieveResult
    {
        public string? Code { get; set; }
        public MemorySpaceItem? Data { get; set; }
        public string? Msg { get; set; }
    }
}
