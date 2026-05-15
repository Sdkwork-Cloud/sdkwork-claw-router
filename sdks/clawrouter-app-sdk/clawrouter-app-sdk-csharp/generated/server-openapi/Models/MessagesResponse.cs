using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class MessagesResponse
    {
        public List<Message>? Items { get; set; }
    }
}
