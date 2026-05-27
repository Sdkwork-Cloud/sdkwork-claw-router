using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IntegrationServiceProviderFinanceProfileRecord
    {
        public string? BillingCycle { get; set; }
        public string? CreatedAt { get; set; }
        public string? CreditLimitAmount { get; set; }
        public string? Currency { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public string? InvoiceTitleId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public int? PaymentTermsDays { get; set; }
        public string? ServiceProviderId { get; set; }
        public int? SettlementDay { get; set; }
        public string? SettlementMode { get; set; }
        public string? Status { get; set; }
        public string? SuspendThresholdAmount { get; set; }
        public string? TaxProfileRef { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? WarningThresholdAmount { get; set; }
    }
}
