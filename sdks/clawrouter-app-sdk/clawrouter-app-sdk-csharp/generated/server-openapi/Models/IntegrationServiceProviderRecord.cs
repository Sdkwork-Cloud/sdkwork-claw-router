using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IntegrationServiceProviderRecord
    {
        public string? ActivatedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultCurrency { get; set; }
        public string? DefaultTimezone { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DisplayName { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerOrganizationId { get; set; }
        public string? OwnerTenantId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? ProviderNo { get; set; }
        public string? ProviderType { get; set; }
        public string? RiskLevel { get; set; }
        public string? Status { get; set; }
        public string? SuspendedAt { get; set; }
        public string? SuspendedReasonCode { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
