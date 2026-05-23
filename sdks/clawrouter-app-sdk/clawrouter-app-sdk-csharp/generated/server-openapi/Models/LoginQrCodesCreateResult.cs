using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class LoginQrCodesCreateResult
    {
        public string? Code { get; set; }
        public IamLoginQrCodeResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
