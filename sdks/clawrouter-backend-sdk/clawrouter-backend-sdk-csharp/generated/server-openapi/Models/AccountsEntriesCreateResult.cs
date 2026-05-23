using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AccountsEntriesCreateResult
    {
        public string? Code { get; set; }
        public OpenPlatformEntryResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
