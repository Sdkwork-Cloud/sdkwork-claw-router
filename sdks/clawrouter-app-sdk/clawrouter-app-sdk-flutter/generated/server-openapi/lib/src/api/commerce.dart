import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class CommerceApi {
  final HttpClient _client;

  CommerceApi(this._client);

  /// Recharges Settings Retrieve
  Future<RechargesSettingsRetrieveResult?> rechargesSettingsRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/recharges/settings'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : RechargesSettingsRetrieveResult.fromJson(map);
    })();
  }
}
