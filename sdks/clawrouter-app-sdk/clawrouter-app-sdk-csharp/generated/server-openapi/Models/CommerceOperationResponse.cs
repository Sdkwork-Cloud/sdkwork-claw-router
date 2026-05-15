using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceOperationResponse
    {
        public string? RequestNo { get; set; }
        public string? Status { get; set; }
        public bool? Success { get; set; }
    }
}
