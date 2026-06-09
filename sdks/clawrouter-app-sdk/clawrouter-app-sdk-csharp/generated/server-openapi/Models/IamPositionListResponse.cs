using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamPositionListResponse
    {
        public List<IamPositionItem> Items { get; set; }
    }
}
