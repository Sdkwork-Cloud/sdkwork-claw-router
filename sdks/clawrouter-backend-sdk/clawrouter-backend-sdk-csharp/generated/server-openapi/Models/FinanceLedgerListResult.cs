using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class FinanceLedgerListResult
    {
        public string? Code { get; set; }
        public AdminTransactionsResponse? Data { get; set; }
        public string? Message { get; set; }
        public string? Msg { get; set; }
    }
}
