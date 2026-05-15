using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceWalletCommandRequest
    {
        public string? Amount { get; set; }
        public string? AssetType { get; set; }
        public string? Remarks { get; set; }
        public string? RequestNo { get; set; }
    }
}
