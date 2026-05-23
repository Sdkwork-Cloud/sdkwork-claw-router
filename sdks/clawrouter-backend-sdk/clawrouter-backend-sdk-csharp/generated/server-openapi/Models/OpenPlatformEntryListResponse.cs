using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformEntryListResponse
    {
        public List<OpenPlatformEntryItem>? Items { get; set; }
    }
}
