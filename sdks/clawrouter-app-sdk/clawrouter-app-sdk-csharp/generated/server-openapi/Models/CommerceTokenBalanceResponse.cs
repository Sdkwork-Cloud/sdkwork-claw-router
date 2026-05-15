using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceTokenBalanceResponse
    {
        public int? AvailableTokens { get; set; }
        public int? FrozenTokens { get; set; }
    }
}
