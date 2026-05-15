using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class VipPackGroupsRetrieveResult
    {
        public string? Code { get; set; }
        public CommerceVipPackGroupItem? Data { get; set; }
        public string? Message { get; set; }
        public string? Msg { get; set; }
    }
}
