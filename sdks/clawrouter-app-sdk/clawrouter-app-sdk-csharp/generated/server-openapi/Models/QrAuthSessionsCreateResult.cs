using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class QrAuthSessionsCreateResult
    {
        public string? Code { get; set; }
        public OpenPlatformQrAuthSessionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
