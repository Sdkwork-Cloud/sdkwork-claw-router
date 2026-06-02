using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceProductSkuAttributeRecord
    {
        public string? AttributeId { get; set; }
        public string? AttributeValueId { get; set; }
        public string? CreatedAt { get; set; }
        public string? CustomValue { get; set; }
        public string? Id { get; set; }
        public string? OrganizationId { get; set; }
        public string? SkuId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
