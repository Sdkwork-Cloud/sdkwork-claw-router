using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AccountConsumptionItem
    {
        public string? Color { get; set; }
        public string? Name { get; set; }
        public double? Percentage { get; set; }
        public double? Value { get; set; }
    }
}
