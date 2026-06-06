using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.App.Models;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;

namespace Sdkwork.ClawRouter.App.Api
{
    public class CommerceApi
    {
        private readonly SdkHttpClient _client;

        public CommerceApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// Recharges Settings Retrieve
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.RechargesSettingsRetrieveResult?> RechargesSettingsRetrieveAsync()
        {
            return await _client.GetAsync<Sdkwork.ClawRouter.App.Models.RechargesSettingsRetrieveResult>(ApiPaths.AppPath("/recharges/settings"));
        }



    }
}
