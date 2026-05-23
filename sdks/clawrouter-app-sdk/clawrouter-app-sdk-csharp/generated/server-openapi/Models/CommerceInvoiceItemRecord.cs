using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceInvoiceItemRecord
    {
        public string? Amount { get; set; }
        public string? CreatedAt { get; set; }
        public string? InvoiceId { get; set; }
        public string? OrderItemId { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
    }
}
