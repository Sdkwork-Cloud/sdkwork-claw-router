using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceInvoiceRecord
    {
        public string? CreatedAt { get; set; }
        public string? DocumentUrl { get; set; }
        public string? InvoiceCode { get; set; }
        public string? InvoiceNo { get; set; }
        public string? IssuedAt { get; set; }
        public string? OrderId { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? PaymentId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TitleId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
