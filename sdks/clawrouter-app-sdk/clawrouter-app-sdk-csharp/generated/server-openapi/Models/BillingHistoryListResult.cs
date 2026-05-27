using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class BillingHistoryListResult
    {
        public string? Code { get; set; }
        public BillingHistoryCollectionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
