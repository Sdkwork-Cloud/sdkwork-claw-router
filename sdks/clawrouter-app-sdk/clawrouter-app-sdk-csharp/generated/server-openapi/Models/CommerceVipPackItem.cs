using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceVipPackItem
    {
        public string? Code { get; set; }
        public string? CurrencyCode { get; set; }
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? PriceAmount { get; set; }
        public string? Status { get; set; }
    }
}
