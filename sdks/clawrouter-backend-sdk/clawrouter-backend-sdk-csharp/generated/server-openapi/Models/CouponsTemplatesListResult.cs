using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CouponsTemplatesListResult
    {
        public string? Code { get; set; }
        public CommerceStandardCollectionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
