using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminBillingRecordsResponse
    {
        public List<AdminBillingRecordItem>? Items { get; set; }
    }
}
