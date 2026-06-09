using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class RoleBindingsListResult
    {
        public string Code { get; set; }
        public IamRoleBindingListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
