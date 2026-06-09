using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamSessionResponse
    {
        public string AccessToken { get; set; }
        public string AuthToken { get; set; }
        public IamAppContext Context { get; set; }
        public string? ExpiresAt { get; set; }
        public string? RefreshToken { get; set; }
        public string? SessionId { get; set; }
        public IamUserResponse User { get; set; }
    }
}
