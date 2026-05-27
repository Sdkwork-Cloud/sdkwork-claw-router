using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceProductSpuDetailResponse
    {
        public CommerceProductSpuItem? Item { get; set; }
        public List<CommerceProductSkuItem>? Skus { get; set; }
    }
}
