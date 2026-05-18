using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminPaymentAttemptItem
    {
        public string? Amount { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? OrderNo { get; set; }
        public string? Provider { get; set; }
        public string? Status { get; set; }
    }
}
