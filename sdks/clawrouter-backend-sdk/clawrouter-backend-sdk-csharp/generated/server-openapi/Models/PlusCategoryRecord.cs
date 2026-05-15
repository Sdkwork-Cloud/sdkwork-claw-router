using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PlusCategoryRecord
    {
        public string? Code { get; set; }
        public string? Description { get; set; }
        public string? GroupName { get; set; }
        public string? Icon { get; set; }
        public string? ParentId { get; set; }
        public string? Path { get; set; }
        public string? ShopId { get; set; }
    }
}
