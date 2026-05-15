using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AccountInvoiceSettings
    {
        public string? InvoiceType { get; set; }
        public string? OrgFull { get; set; }
        public string? PaymentMethod { get; set; }
        public string? TaxId { get; set; }
    }
}
