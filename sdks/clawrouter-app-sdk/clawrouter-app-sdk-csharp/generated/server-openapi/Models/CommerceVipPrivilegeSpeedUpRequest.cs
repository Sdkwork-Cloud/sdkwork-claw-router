using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceVipPrivilegeSpeedUpRequest
    {
        public string? PrivilegeCode { get; set; }
        public string? Remarks { get; set; }
        public string? RequestNo { get; set; }
    }
}
