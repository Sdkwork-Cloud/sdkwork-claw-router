using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductMediaItem
    {
        public string? AltText { get; set; }
        public string? Id { get; set; }
        public string? MediaType { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? Url { get; set; }
    }
}
