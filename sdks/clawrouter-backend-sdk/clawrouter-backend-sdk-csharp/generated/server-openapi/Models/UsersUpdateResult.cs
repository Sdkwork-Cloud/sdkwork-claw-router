using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class UsersUpdateResult
    {
        public string? Code { get; set; }
        public AdminUserMutationResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
