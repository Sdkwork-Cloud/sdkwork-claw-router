using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.App.Models;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;

namespace Sdkwork.ClawRouter.App.Api
{
    public class CommunicationApi
    {
        private readonly SdkHttpClient _client;

        public CommunicationApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// List messages
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.NotificationsListResult?> NotificationsListAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.NotificationsListResult>(ApiPaths.AppPath("/communication/notifications"));
        }



    }
}
