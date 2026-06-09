using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAppConfig
    {
        public AdminAppPortalConfig? Portal { get; set; }
        public AdminAppConfigStandard Standard { get; set; }
    }
}
