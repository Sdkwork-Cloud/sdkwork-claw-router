using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentChannelItem
    {
        public string? ChannelNo { get; set; }
        public string? CountryCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? Id { get; set; }
        public string? MethodCode { get; set; }
        public int? Priority { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? SceneCode { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
