using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AccountLoginLog
    {
        public string? Device { get; set; }
        public string? Ip { get; set; }
        public string? Location { get; set; }
        public string? Status { get; set; }
        public string? Time { get; set; }
    }
}
