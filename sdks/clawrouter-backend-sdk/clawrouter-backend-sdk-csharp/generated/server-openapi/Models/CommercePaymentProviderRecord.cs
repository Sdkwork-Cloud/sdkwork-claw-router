using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentProviderRecord
    {
        public string? CreatedAt { get; set; }
        public string? DisplayName { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderType { get; set; }
        public string? SortOrder { get; set; }
        public string? Status { get; set; }
        public Dictionary<string, string>? SupportedCountries { get; set; }
        public Dictionary<string, string>? SupportedCurrencies { get; set; }
        public Dictionary<string, string>? SupportedMethods { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
