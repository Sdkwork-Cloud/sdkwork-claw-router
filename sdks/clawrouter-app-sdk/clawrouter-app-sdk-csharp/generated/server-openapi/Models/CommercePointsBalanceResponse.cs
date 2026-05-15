using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommercePointsBalanceResponse
    {
        public int? AvailablePoints { get; set; }
        public int? FrozenPoints { get; set; }
    }
}
