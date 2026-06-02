using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceInvoiceItemRecord
    {
        public string? Amount { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? InvoiceId { get; set; }
        public string? OrderItemId { get; set; }
        public string? TaxAmount { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
    }
}
