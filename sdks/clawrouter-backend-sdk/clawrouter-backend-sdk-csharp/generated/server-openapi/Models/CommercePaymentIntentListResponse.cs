using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentIntentListResponse
    {
        public List<CommercePaymentIntentItem>? Items { get; set; }
        public string? Page { get; set; }
        public string? PageSize { get; set; }
        public string? Total { get; set; }
    }
}
