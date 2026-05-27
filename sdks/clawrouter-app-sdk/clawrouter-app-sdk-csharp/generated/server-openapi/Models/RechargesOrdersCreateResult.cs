using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class RechargesOrdersCreateResult
    {
        public string? Code { get; set; }
        public CommerceOperationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
