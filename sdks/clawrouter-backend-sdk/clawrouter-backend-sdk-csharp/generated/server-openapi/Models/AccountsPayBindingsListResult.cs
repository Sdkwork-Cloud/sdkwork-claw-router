using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AccountsPayBindingsListResult
    {
        public string? Code { get; set; }
        public OpenPlatformPayBindingListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
