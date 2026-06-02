using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceProductSpuItem
    {
        public string? Brand { get; set; }
        public List<string>? CategoryIds { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? DefaultSkuId { get; set; }
        public string? Description { get; set; }
        public string? Id { get; set; }
        public List<CommerceProductMediaItem>? Media { get; set; }
        public string? MinPriceAmount { get; set; }
        public string? ProductType { get; set; }
        public string? PublishedAt { get; set; }
        public string? SpuNo { get; set; }
        public string? Status { get; set; }
        public string? Subtitle { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
