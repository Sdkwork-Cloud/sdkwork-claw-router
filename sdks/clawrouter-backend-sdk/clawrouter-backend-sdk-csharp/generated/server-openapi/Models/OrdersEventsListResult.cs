using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OrdersEventsListResult
    {
        public string? Code { get; set; }
        public CommerceStandardCollectionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
