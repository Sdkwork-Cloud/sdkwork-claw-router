using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ProvidersResponse
    {
        public List<ProviderConfig>? Items { get; set; }
    }
}
