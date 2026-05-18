using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ExchangeRulesUpdateResult
    {
        public string? Code { get; set; }
        public AdminExchangeRuleMutationResponse? Data { get; set; }
        public string? Message { get; set; }
        public string? Msg { get; set; }
    }
}
