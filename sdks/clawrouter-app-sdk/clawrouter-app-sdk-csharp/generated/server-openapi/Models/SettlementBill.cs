using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SettlementBill
    {
        public SettlementBillBreakdown? Breakdown { get; set; }
        public string? EndDate { get; set; }
        public string? Id { get; set; }
        public string? Period { get; set; }
        public string? StartDate { get; set; }
        public string? Status { get; set; }
        public string? TotalCost { get; set; }
        public string? TotalTokens { get; set; }
    }
}
