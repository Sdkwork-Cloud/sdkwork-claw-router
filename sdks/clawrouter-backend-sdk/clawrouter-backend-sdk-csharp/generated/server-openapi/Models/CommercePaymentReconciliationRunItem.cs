using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentReconciliationRunItem
    {
        public string? BusinessDate { get; set; }
        public string? CreatedAt { get; set; }
        public string? FinishedAt { get; set; }
        public string? Id { get; set; }
        public string? ProviderCode { get; set; }
        public string? RunNo { get; set; }
        public string? Status { get; set; }
    }
}
