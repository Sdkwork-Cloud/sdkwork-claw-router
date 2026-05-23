using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceProductCategoryMutationRequest
    {
        public string? CategoryNo { get; set; }
        public string? Name { get; set; }
        public string? ParentId { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
    }
}
