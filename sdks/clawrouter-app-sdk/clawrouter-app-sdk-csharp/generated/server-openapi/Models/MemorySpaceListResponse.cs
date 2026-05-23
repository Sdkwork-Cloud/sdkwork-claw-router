using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class MemorySpaceListResponse
    {
        public List<MemorySpaceItem>? Items { get; set; }
    }
}
