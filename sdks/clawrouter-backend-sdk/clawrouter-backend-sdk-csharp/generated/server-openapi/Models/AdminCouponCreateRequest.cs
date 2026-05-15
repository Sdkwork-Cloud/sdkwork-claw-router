using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCouponCreateRequest
    {
        public string? Name { get; set; }
        public string? Status { get; set; }
        public string? Type { get; set; }
        public string? Value { get; set; }
    }
}
