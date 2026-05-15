import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class CommunicationApi {
  final HttpClient _client;

  CommunicationApi(this._client);

  /// List messages
  Future<NotificationsListResult?> notificationsList() async {
    final response = await _client.get(ApiPaths.appPath('/communication/notifications'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : NotificationsListResult.fromJson(map);
    })();
  }
}
