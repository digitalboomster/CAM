import 'package:flutter/material.dart';
import '../app_theme.dart';
import '../models/app_settings.dart';
import '../services/settings_service.dart';
import '../widgets/module_shell.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  AppSettings? _settings;
  bool _saved = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final s = await loadSettings();
    if (mounted) setState(() => _settings = s);
  }

  Future<void> _save() async {
    if (_settings == null) return;
    await saveSettings(_settings!);
    if (mounted) {
      setState(() => _saved = true);
      Future<void>.delayed(const Duration(seconds: 2), () {
        if (mounted) setState(() => _saved = false);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_settings == null) {
      return const ModuleShell(
        title: 'Settings',
        subtitle: 'Workspace and compliance preferences',
        child: Center(child: Text('Loading…')),
      );
    }

    final s = _settings!;
    return ModuleShell(
      title: 'Settings',
      subtitle: 'Workspace and compliance preferences',
      child: SingleChildScrollView(
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Default export format', style: Theme.of(context).textTheme.titleSmall),
                const SizedBox(height: 4),
                Text(
                  'Choose how reports are shared with committee members.',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.muted),
                ),
                const SizedBox(height: 8),
                DropdownButton<DefaultExportFormat>(
                  value: s.defaultExportFormat,
                  items: const [
                    DropdownMenuItem(value: DefaultExportFormat.pdf, child: Text('PDF with citations')),
                    DropdownMenuItem(value: DefaultExportFormat.excel, child: Text('Excel + source index')),
                  ],
                  onChanged: (v) => v != null ? setState(() => _settings = s.copyWith(defaultExportFormat: v)) : null,
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Require citations on exports', style: Theme.of(context).textTheme.titleSmall),
                          const SizedBox(height: 4),
                          Text(
                            'Warn or block export if unresolved cells are uncited.',
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.muted),
                          ),
                        ],
                      ),
                    ),
                    Switch(
                      value: s.requireCitationsOnExport,
                      onChanged: (v) => setState(() => _settings = s.copyWith(requireCitationsOnExport: v)),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    FilledButton(
                      onPressed: _save,
                      style: FilledButton.styleFrom(backgroundColor: const Color(0xFF0D9488)),
                      child: const Text('Save settings'),
                    ),
                    if (_saved) ...[
                      const SizedBox(width: 12),
                      Text('Saved.', style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: const Color(0xFF059669))),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
