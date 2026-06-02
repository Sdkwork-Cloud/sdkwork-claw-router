using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceCategorySeedInitializeResponse
    {
        public List<CommerceCategorySeedInitializeSummary>? Items { get; set; }
    }
}
