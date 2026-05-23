using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class RechargesPackagesDeleteResult
    {
        public string? Code { get; set; }
        public AdminDeleteResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
