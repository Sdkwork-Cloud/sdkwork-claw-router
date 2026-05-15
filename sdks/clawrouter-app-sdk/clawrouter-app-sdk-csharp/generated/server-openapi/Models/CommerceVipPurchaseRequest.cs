using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceVipPurchaseRequest
    {
        public string? PackId { get; set; }
        public string? Remarks { get; set; }
        public string? RequestNo { get; set; }
    }
}
