using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceCheckoutLineRecord
    {
        public string? CheckoutSessionId { get; set; }
        public string? CreatedAt { get; set; }
        public string? FulfillmentType { get; set; }
        public string? InventoryReservationId { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? PriceSnapshotJson { get; set; }
        public Dictionary<string, string>? PromotionSnapshotJson { get; set; }
        public string? PurchaseType { get; set; }
        public string? SkuId { get; set; }
        public string? TenantId { get; set; }
    }
}
