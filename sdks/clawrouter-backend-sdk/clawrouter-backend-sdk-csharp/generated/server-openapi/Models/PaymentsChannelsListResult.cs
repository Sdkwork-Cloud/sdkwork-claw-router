using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PaymentsChannelsListResult
    {
        public string? Code { get; set; }
        public CommercePaymentChannelListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
