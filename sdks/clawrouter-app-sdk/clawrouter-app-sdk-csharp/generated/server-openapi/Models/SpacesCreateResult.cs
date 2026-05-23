using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SpacesCreateResult
    {
        public string? Code { get; set; }
        public MemorySpaceResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
