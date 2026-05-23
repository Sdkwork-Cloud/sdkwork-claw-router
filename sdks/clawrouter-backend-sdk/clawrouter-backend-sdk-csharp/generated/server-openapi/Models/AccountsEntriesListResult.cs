using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AccountsEntriesListResult
    {
        public string? Code { get; set; }
        public OpenPlatformEntryListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
