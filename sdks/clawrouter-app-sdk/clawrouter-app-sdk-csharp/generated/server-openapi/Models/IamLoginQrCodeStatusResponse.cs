using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamLoginQrCodeStatusResponse
    {
        public IamSessionResponse? Session { get; set; }
        public string? Status { get; set; }
        public IamSessionResponse? Token { get; set; }
        public IamUserResponse? UserInfo { get; set; }
    }
}
