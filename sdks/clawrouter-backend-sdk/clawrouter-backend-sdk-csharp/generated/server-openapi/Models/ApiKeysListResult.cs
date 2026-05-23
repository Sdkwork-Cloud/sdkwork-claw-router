using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ApiKeysListResult
    {
        public string? Code { get; set; }
        public AdminApiKeysMapResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
