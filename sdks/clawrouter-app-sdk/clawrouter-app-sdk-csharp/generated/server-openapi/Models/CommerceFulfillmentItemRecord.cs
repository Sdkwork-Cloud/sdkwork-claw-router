using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceFulfillmentItemRecord
    {
        public string? CreatedAt { get; set; }
        public string? FulfillmentId { get; set; }
        public string? OrderItemId { get; set; }
        public string? OrganizationId { get; set; }
        public string? SkuId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
