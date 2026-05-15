using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SettlementBillBreakdownItem
    {
        public string? Cost { get; set; }
        public List<string>? Models { get; set; }
        public string? Usage { get; set; }
    }
}
