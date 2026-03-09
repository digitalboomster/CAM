import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/app_settings.dart';

const String _key = 'nautilus.settings.v1';

Future<AppSettings> loadSettings() async {
  final prefs = await SharedPreferences.getInstance();
  final raw = prefs.getString(_key);
  if (raw == null) return const AppSettings();
  try {
    final map = jsonDecode(raw) as Map<String, dynamic>?;
    if (map == null) return const AppSettings();
    return AppSettings(
      defaultExportFormat: map['defaultExportFormat'] == 'excel'
          ? DefaultExportFormat.excel
          : DefaultExportFormat.pdf,
      requireCitationsOnExport: map['requireCitationsOnExport'] as bool? ?? true,
    );
  } catch (_) {
    return const AppSettings();
  }
}

Future<void> saveSettings(AppSettings s) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString(_key, jsonEncode({
    'defaultExportFormat': s.defaultExportFormat == DefaultExportFormat.excel ? 'excel' : 'pdf',
    'requireCitationsOnExport': s.requireCitationsOnExport,
  }));
}
