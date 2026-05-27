using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamRuntimeRetrieveResult
    {
        public string? Code { get; set; }
        public AuthRuntimeSettingsResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
