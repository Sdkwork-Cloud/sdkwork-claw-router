using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AccessGroupsChannelBindingsListResult
    {
        public string? Code { get; set; }
        public AdminAccessGroupChannelBindingsResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
