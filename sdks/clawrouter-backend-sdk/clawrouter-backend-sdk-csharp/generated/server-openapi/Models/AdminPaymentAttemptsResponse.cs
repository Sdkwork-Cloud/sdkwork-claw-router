using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminPaymentAttemptsResponse
    {
        public List<AdminPaymentAttemptItem>? Items { get; set; }
    }
}
