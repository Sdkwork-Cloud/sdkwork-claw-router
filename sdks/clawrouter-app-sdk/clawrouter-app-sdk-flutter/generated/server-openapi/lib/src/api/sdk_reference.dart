import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class SdkReferenceApi {
  final HttpClient _client;

  SdkReferenceApi(this._client);

  /// Generate SDK archive
  Future<ArchivesCreateResult?> archivesCreate(SdkReferenceArchiveGenerateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/sdk_reference/archives'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : ArchivesCreateResult.fromJson(map);
    })();
  }

  /// Generate SDK reference documentation
  Future<DocumentationCreateResult?> documentationCreate(SdkReferenceDocumentationGenerateRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/sdk_reference/documentation'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : DocumentationCreateResult.fromJson(map);
    })();
  }
}
