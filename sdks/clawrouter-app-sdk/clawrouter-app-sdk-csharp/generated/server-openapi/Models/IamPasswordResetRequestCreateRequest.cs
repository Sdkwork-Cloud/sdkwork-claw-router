using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamPasswordResetRequestCreateRequest
    {
        public string Account { get; set; }
        public string Channel { get; set; }
    }
}
