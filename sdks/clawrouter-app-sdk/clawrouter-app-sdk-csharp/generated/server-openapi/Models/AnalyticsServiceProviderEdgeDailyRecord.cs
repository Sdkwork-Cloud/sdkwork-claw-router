using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AnalyticsServiceProviderEdgeDailyRecord
    {
        public string? BillingMeterCode { get; set; }
        public string? BuyerProviderId { get; set; }
        public string? CatalogKey { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? EdgeId { get; set; }
        public string? ExpenseAmount { get; set; }
        public string? Id { get; set; }
        public string? IncomeAmount { get; set; }
        public string? MarginAmount { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Model { get; set; }
        public string? OrganizationId { get; set; }
        public string? RebuildVersion { get; set; }
        public string? ReportDate { get; set; }
        public string? RequestCount { get; set; }
        public string? SellerProviderId { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TokenCount { get; set; }
        public string? TokenKind { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
    }
}
