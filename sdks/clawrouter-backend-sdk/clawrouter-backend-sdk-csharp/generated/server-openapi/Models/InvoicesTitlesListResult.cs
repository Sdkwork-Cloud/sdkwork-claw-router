using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class InvoicesTitlesListResult
    {
        public string? Code { get; set; }
        public CommerceStandardCollectionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
