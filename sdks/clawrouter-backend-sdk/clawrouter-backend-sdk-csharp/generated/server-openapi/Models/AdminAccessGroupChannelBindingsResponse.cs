using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAccessGroupChannelBindingsResponse
    {
        public List<AdminAccessGroupChannelBindingItem>? Items { get; set; }
    }
}
