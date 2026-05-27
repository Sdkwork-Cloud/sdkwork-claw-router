using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sdkwork.ClawRouter.App.Models;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;

namespace Sdkwork.ClawRouter.App.Api
{
    public class SdkReferenceApi
    {
        private readonly SdkHttpClient _client;

        public SdkReferenceApi(SdkHttpClient client)
        {
            _client = client;
        }

        /// <summary>
        /// Generate SDK archive
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.ArchivesCreateResult?> ArchivesCreateAsync(Sdkwork.ClawRouter.App.Models.SdkReferenceArchiveGenerateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.ArchivesCreateResult>(ApiPaths.AppPath("/sdk_reference/archives"), body, null, null, "application/json");
        }

        /// <summary>
        /// Generate SDK reference documentation
        /// </summary>
        public async Task<Sdkwork.ClawRouter.App.Models.DocumentationCreateResult?> DocumentationCreateAsync(Sdkwork.ClawRouter.App.Models.SdkReferenceDocumentationGenerateRequest body)
        {
            return await _client.PostAsync<Sdkwork.ClawRouter.App.Models.DocumentationCreateResult>(ApiPaths.AppPath("/sdk_reference/documentation"), body, null, null, "application/json");
        }



    }
}
