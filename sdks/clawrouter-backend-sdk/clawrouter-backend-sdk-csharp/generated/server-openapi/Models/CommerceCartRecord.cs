using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceCartRecord
    {
        public string? CartNo { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerUserId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
