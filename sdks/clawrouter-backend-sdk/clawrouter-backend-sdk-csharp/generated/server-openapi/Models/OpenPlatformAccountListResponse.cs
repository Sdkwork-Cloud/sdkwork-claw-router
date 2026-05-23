using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpenPlatformAccountListResponse
    {
        public List<OpenPlatformAccountItem>? Items { get; set; }
    }
}
