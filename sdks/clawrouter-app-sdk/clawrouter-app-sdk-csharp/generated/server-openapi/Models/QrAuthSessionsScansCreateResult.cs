using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class QrAuthSessionsScansCreateResult
    {
        public string? Code { get; set; }
        public OpenPlatformQrAuthScanResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
