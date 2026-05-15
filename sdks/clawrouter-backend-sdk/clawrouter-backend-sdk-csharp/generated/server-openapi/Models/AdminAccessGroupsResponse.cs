using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAccessGroupsResponse
    {
        public List<AdminAccessGroupItem>? Items { get; set; }
    }
}
