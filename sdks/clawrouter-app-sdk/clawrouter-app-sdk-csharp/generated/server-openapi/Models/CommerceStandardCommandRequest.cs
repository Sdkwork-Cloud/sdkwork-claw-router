using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceStandardCommandRequest
    {
        public string? ClientRequestNo { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Note { get; set; }
    }
}
