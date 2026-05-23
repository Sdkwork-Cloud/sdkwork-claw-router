using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class MemorySpaceItem
    {
        public bool? AutoExtractEnabled { get; set; }
        public bool? AutoRecallEnabled { get; set; }
        public string? CreatedAt { get; set; }
        public int? EntryCount { get; set; }
        public string? Id { get; set; }
        public int? MaxInjectedTokens { get; set; }
        public bool? MemoryEnabled { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public bool? ReviewRequired { get; set; }
        public string? SpaceType { get; set; }
        public string? Status { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
