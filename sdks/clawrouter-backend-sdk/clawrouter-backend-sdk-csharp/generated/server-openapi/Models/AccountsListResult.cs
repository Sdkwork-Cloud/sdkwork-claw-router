using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AccountsListResult
    {
        public string? Code { get; set; }
        public OpenPlatformAccountListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
