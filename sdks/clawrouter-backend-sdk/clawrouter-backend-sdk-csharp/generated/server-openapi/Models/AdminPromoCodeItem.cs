using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminPromoCodeItem
    {
        public string? BatchId { get; set; }
        public string? Code { get; set; }
        public string? Id { get; set; }
        public string? Status { get; set; }
        public string? UsedAt { get; set; }
        public string? UsedBy { get; set; }
    }
}
