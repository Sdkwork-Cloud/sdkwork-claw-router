using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAccessGroupChannelBindingsReplaceRequest
    {
        public List<AdminAccessGroupChannelBindingInput>? Items { get; set; }
    }
}
