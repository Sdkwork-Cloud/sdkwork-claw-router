using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AppsListResult
    {
        public string Code { get; set; }
        public AdminAppListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
