using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceCategorySeedInitializeRequest
    {
        public List<string>? Datasets { get; set; }
        public string? Mode { get; set; }
    }
}
