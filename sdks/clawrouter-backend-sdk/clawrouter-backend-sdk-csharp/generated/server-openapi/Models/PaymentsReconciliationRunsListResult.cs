using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PaymentsReconciliationRunsListResult
    {
        public string? Code { get; set; }
        public CommercePaymentReconciliationRunListResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
