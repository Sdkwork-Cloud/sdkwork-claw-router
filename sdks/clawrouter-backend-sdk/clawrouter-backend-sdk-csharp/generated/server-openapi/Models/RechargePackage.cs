using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class RechargePackage
    {
        public int? Bonus { get; set; }
        public string? Id { get; set; }
        public int? Points { get; set; }
        public string? Rmb { get; set; }
    }
}
