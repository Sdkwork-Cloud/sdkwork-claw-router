using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceProductMediaItem
    {
        public string? AltText { get; set; }
        public string? Id { get; set; }
        public string? MediaRole { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public MediaResource? Resource { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
    }
}
