using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AccountsUpdateResult
    {
        public string? Code { get; set; }
        public OpenPlatformAccountResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
