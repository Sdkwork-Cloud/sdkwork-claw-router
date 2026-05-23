using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentProviderItem
    {
        public List<string>? Capabilities { get; set; }
        public string? CreatedAt { get; set; }
        public string? DisplayName { get; set; }
        public string? Id { get; set; }
        public string? ProviderCode { get; set; }
        public string? ProviderType { get; set; }
        public string? SettlementType { get; set; }
        public string? Status { get; set; }
        public List<string>? SupportedCountries { get; set; }
        public List<string>? SupportedCurrencies { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
