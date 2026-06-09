using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamRoleBindingListResponse
    {
        public List<IamRoleBindingItem> Items { get; set; }
    }
}
