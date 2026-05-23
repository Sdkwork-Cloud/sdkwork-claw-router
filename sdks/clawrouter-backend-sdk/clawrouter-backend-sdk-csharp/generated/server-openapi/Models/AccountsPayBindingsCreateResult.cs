using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AccountsPayBindingsCreateResult
    {
        public string? Code { get; set; }
        public OpenPlatformPayBindingResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
