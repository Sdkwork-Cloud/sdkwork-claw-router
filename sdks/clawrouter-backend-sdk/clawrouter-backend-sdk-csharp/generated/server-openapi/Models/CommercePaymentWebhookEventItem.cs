using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentWebhookEventItem
    {
        public string? EventNo { get; set; }
        public string? EventType { get; set; }
        public string? ExternalEventId { get; set; }
        public string? Id { get; set; }
        public string? ProcessStatus { get; set; }
        public string? ProcessedAt { get; set; }
        public string? ProviderCode { get; set; }
        public string? ReceivedAt { get; set; }
    }
}
