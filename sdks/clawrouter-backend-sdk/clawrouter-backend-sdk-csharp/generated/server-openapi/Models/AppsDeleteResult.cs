using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AppsDeleteResult
    {
        public string? Code { get; set; }
        public AdminAppDeleteResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
