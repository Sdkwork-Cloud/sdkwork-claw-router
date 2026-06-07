using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PaymentsWebhookEventsListResult
    {
        public string? Code { get; set; }
        public CommercePaymentWebhookEventListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
