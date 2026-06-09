using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class NotificationsResponse
    {
        public List<NotificationItem> Items { get; set; }
    }
}
