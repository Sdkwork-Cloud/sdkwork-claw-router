using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminPromoCodesResponse
    {
        public List<AdminPromoCodeItem>? Items { get; set; }
    }
}
