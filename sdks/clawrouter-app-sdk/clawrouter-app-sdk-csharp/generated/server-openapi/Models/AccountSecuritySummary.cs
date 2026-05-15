using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AccountSecuritySummary
    {
        public int? IpWhitelistCount { get; set; }
        public bool? MfaEnabled { get; set; }
        public int? QpsLimit { get; set; }
    }
}
