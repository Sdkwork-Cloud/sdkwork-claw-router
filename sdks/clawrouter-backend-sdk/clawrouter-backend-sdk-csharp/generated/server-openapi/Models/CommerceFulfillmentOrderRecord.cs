using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceFulfillmentOrderRecord
    {
        public string? AddressSnapshotId { get; set; }
        public string? CompletedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? FulfillmentNo { get; set; }
        public string? FulfillmentType { get; set; }
        public string? Id { get; set; }
        public string? OrderId { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderCode { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? WarehouseId { get; set; }
    }
}
