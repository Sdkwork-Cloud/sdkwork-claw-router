using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class InvoicesRetrieveResult
    {
        public string? Code { get; set; }
        public CommerceStandardResourceResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
