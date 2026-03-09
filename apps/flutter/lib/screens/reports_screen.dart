import 'package:flutter/material.dart';
import '../app_theme.dart';
import '../models/export_log.dart';
import '../models/report_template.dart';
import '../models/workspace.dart';
import '../widgets/module_shell.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({
    super.key,
    required this.workspaces,
    required this.exports,
    required this.onOpenWorkspace,
  });

  final List<Workspace> workspaces;
  final List<ExportLogEntry> exports;
  final void Function(String? workspaceId) onOpenWorkspace;

  @override
  Widget build(BuildContext context) {
    return ModuleShell(
      title: 'Reports',
      subtitle: 'Report templates, generation, and export history',
      actionLabel: 'Open Workspace',
      onActionTap: () => onOpenWorkspace(workspaces.isEmpty ? null : workspaces.first.id),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 24),
            _TemplatesSection(),
            const SizedBox(height: 24),
            _GenerateSection(workspaces: workspaces, onOpenWorkspace: onOpenWorkspace),
            const SizedBox(height: 24),
            _ExportAuditSection(
              exports: exports,
              workspaces: workspaces,
              onOpenWorkspace: onOpenWorkspace,
            ),
          ],
        ),
      ),
    );
  }
}

class _TemplatesSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Report templates', style: Theme.of(context).textTheme.titleSmall?.copyWith(color: AppTheme.text)),
        const SizedBox(height: 12),
        Card(
          child: Column(
            children: [
              for (final t in kReportTemplates)
                ListTile(
                  title: Text(t.label),
                  subtitle: Text(t.description, style: Theme.of(context).textTheme.bodySmall),
                  trailing: Text('Use in Generate report below', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.muted)),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _GenerateSection extends StatelessWidget {
  const _GenerateSection({
    required this.workspaces,
    required this.onOpenWorkspace,
  });

  final List<Workspace> workspaces;
  final void Function(String? workspaceId) onOpenWorkspace;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Generate report', style: Theme.of(context).textTheme.titleSmall?.copyWith(color: AppTheme.text)),
        const SizedBox(height: 12),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('Template'),
                DropdownButton<ReportTemplate>(
                  value: kReportTemplates.first,
                  items: kReportTemplates.map((t) => DropdownMenuItem(value: t, child: Text(t.label))).toList(),
                  onChanged: (_) {},
                ),
                const SizedBox(height: 16),
                const Text('Workspace'),
                DropdownButton<Workspace?>(
                  value: workspaces.isEmpty ? null : workspaces.first,
                  items: [
                    if (workspaces.isEmpty)
                      const DropdownMenuItem(value: null, child: Text('No workspaces — create one in Document Intelligence'))
                    else
                      ...workspaces.map((w) => DropdownMenuItem(value: w, child: Text(w.name))),
                  ],
                  onChanged: (w) {},
                ),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: () => onOpenWorkspace(workspaces.isEmpty ? null : workspaces.first.id),
                  child: const Text('Open workspace to generate'),
                ),
                const SizedBox(height: 8),
                Text(
                  'Opens Document Intelligence with the chosen workspace. Export as PDF to add to history.',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.muted),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _ExportAuditSection extends StatelessWidget {
  const _ExportAuditSection({
    required this.exports,
    required this.workspaces,
    required this.onOpenWorkspace,
  });

  final List<ExportLogEntry> exports;
  final List<Workspace> workspaces;
  final void Function(String? workspaceId) onOpenWorkspace;

  String _workspaceName(String id) {
    final w = workspaces.cast<Workspace?>().firstWhere(
          (x) => x?.id == id,
          orElse: () => null,
        );
    return w?.name ?? (id.length > 8 ? '${id.substring(0, 8)}…' : id);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Export audit', style: Theme.of(context).textTheme.titleSmall?.copyWith(color: AppTheme.text)),
        const SizedBox(height: 4),
        Text(
          'Each export is logged with a unique ID for audit and compliance.',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.muted),
        ),
        const SizedBox(height: 12),
        if (exports.isEmpty)
          Text('No exports yet. Export a memo from a workspace to see it here.', style: Theme.of(context).textTheme.bodySmall)
        else
          Card(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                columns: const [
                  DataColumn(label: Text('Date')),
                  DataColumn(label: Text('Label')),
                  DataColumn(label: Text('Workspace')),
                  DataColumn(label: Text('Exported by')),
                  DataColumn(label: Text('Audit ID')),
                  DataColumn(label: Text('Action')),
                ],
                rows: exports.map((e) {
                  return DataRow(
                    cells: [
                      DataCell(Text(e.at, style: Theme.of(context).textTheme.bodySmall)),
                      DataCell(Text(e.label)),
                      DataCell(Text(_workspaceName(e.workspaceId))),
                      DataCell(Text(e.exportedBy ?? '—')),
                      DataCell(Text('${e.id.substring(0, 8)}…', style: Theme.of(context).textTheme.bodySmall?.copyWith(fontFamily: 'monospace'))),
                      DataCell(TextButton(
                        onPressed: () => onOpenWorkspace(e.workspaceId),
                        child: const Text('Open workspace'),
                      )),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
      ],
    );
  }
}
