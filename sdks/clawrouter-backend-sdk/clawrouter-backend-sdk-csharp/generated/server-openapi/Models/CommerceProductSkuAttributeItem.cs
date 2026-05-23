using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductSkuAttributeItem
    {
        public string? AttributeId { get; set; }
        public string? AttributeName { get; set; }
        public string? AttributeValueId { get; set; }
        public string? CustomValue { get; set; }
        public string? DisplayValue { get; set; }
        public string? ValueCode { get; set; }
    }
}
