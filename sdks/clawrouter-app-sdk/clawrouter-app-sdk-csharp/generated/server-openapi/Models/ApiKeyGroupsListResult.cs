using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ApiKeyGroupsListResult
    {
        public string? Code { get; set; }
        public AppApiKeyGroupListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
