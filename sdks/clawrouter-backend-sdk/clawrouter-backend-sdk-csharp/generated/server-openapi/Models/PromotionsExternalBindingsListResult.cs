using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PromotionsExternalBindingsListResult
    {
        public string? Code { get; set; }
        public PromotionCollectionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
