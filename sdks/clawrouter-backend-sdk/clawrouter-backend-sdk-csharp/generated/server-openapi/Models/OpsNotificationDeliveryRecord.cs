using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpsNotificationDeliveryRecord
    {
        public string? AppId { get; set; }
        public string? ArchivedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeliveredAt { get; set; }
        public string? DeliveryChannel { get; set; }
        public string? DeliveryStatus { get; set; }
        public string? FailureCode { get; set; }
        public string? Id { get; set; }
        public string? MessageId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? PopupSeenAt { get; set; }
        public string? ReadAt { get; set; }
        public int? RetryCount { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
