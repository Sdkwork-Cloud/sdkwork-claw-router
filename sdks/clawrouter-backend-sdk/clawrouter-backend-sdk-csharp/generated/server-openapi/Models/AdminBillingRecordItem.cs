using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminBillingRecordItem
    {
        public string? DueDate { get; set; }
        public string? Id { get; set; }
        public string? Period { get; set; }
        public string? Status { get; set; }
        public string? TotalCost { get; set; }
        public int? TotalTokens { get; set; }
        public string? UserId { get; set; }
    }
}
