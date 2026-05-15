using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamPasswordResetCreateRequest
    {
        public string? Account { get; set; }
        public string? Code { get; set; }
        public string? ConfirmPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}
