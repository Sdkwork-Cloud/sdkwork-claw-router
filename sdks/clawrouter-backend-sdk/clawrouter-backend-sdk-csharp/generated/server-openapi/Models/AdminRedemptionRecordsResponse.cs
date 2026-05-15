using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminRedemptionRecordsResponse
    {
        public List<AdminRedemptionRecordItem>? Items { get; set; }
    }
}
