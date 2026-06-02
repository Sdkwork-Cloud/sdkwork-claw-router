using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceRechargeOrderCreateRequest
    {
        public string? Amount { get; set; }
        public string? ClientRequestNo { get; set; }
        public string? CurrencyCode { get; set; }
        public string? PackageId { get; set; }
        public string? Source { get; set; }
    }
}
