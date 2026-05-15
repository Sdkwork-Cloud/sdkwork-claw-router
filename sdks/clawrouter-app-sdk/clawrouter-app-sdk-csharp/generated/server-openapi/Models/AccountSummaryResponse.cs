using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AccountSummaryResponse
    {
        public double? AvailableCredits { get; set; }
        public List<AccountConsumptionItem>? ConsumptionByService { get; set; }
        public string? Email { get; set; }
        public int? EstDaysRemaining { get; set; }
        public string? Id { get; set; }
        public AccountInvoiceSettings? InvoiceSettings { get; set; }
        public bool? IsVerified { get; set; }
        public List<AccountLoginLog>? LoginLogs { get; set; }
        public double? MonthlyConsumption { get; set; }
        public string? Name { get; set; }
        public string? Organization { get; set; }
        public AccountSecuritySummary? Security { get; set; }
        public string? Tier { get; set; }
    }
}
