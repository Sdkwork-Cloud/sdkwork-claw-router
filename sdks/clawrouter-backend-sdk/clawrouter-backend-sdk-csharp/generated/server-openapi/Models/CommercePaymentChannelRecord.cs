using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentChannelRecord
    {
        public string? ChannelNo { get; set; }
        public string? CountryCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? MethodId { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? SceneCode { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
