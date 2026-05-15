using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SubmitRechargeRequest
    {
        public string? Amount { get; set; }
        public string? Method { get; set; }
    }
}
