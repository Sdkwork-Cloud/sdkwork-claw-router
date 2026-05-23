using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductSpuMutationRequest
    {
        public string? Brand { get; set; }
        public string? CategoryId { get; set; }
        public string? Description { get; set; }
        public string? ProductType { get; set; }
        public string? SpuNo { get; set; }
        public string? Status { get; set; }
        public string? Subtitle { get; set; }
        public string? Title { get; set; }
    }
}
