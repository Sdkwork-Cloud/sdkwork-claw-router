using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AccountPointsExchangeRateRetrieveResult
    {
        public string? Code { get; set; }
        public CommercePointsExchangeRateResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
