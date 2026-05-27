using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePaymentProviderAccountRecord
    {
        public string? AccountNo { get; set; }
        public string? CertificateRef { get; set; }
        public string? CountryCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? Environment { get; set; }
        public string? MerchantId { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderCode { get; set; }
        public string? RotatedAt { get; set; }
        public string? SecretRef { get; set; }
        public string? SettlementCurrency { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? WebhookSecretRef { get; set; }
    }
}
