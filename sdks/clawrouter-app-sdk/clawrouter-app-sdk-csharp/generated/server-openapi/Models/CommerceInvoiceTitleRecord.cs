using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceInvoiceTitleRecord
    {
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? OwnerUserId { get; set; }
        public string? TaxNo { get; set; }
        public string? TenantId { get; set; }
        public string? TitleType { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
