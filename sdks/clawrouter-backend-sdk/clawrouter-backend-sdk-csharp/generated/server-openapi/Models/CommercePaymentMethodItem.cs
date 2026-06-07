using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentMethodItem
    {
        public List<string>? CheckoutScenes { get; set; }
        public string? CreatedAt { get; set; }
        public string? DisplayName { get; set; }
        public string? Id { get; set; }
        public string? MethodCode { get; set; }
        public string? MethodType { get; set; }
        public string? ProviderCode { get; set; }
        public string? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
