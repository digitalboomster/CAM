import 'package:flutter/material.dart';
import '../app_theme.dart';
import '../models/workspace.dart';

class WorkspaceScreen extends StatefulWidget {
  const WorkspaceScreen({
    super.key,
    required this.workspaces,
    required this.activeWorkspaceId,
    required this.onSelectWorkspace,
    required this.onNewWorkspace,
  });

  final List<Workspace> workspaces;
  final String? activeWorkspaceId;
  final void Function(String id) onSelectWorkspace;
  final VoidCallback onNewWorkspace;

  @override
  State<WorkspaceScreen> createState() => _WorkspaceScreenState();
}

class _WorkspaceScreenState extends State<WorkspaceScreen> {
  @override
  void initState() {
    super.initState();
    if (widget.workspaces.isNotEmpty && widget.activeWorkspaceId == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        widget.onSelectWorkspace(widget.workspaces.first.id);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final workspaces = widget.workspaces;
    final activeId = widget.activeWorkspaceId ?? (workspaces.isNotEmpty ? workspaces.first.id : null);
    Workspace? active;
    if (workspaces.isNotEmpty) {
      active = workspaces.firstWhere((w) => w.id == activeId, orElse: () => workspaces.first);
    }

    if (workspaces.isEmpty) {
      return Center(
        child: Card(
          margin: const EdgeInsets.all(24),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('No workspaces', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                Text(
                  'MVP uses mock data. Add a workspace in code (MockData.workspaces) or tap + New if your shell supports it.',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          height: 48,
          padding: const EdgeInsets.symmetric(horizontal: 24),
          decoration: const BoxDecoration(
            color: AppTheme.surface,
            border: Border(bottom: BorderSide(color: AppTheme.border)),
          ),
          child: Row(
            children: [
              Text(active?.name ?? 'Workspace', style: Theme.of(context).textTheme.titleMedium),
              const Spacer(),
              IconButton(icon: const Icon(Icons.chat_bubble_outline), onPressed: () {}),
              IconButton(icon: const Icon(Icons.upload_file), onPressed: () {}),
              FilledButton(onPressed: () {}, child: const Text('Export memo')),
            ],
          ),
        ),
        Expanded(
          child: Container(
            color: AppTheme.bg,
            padding: const EdgeInsets.all(24),
            child: _MockGrid(workspaceName: active?.name ?? 'Workspace'),
          ),
        ),
      ],
    );
  }
}

class _MockGrid extends StatelessWidget {
  const _MockGrid({required this.workspaceName});

  final String workspaceName;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.upload_file, size: 18),
                label: const Text('Upload'),
              ),
              const SizedBox(width: 8),
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.add, size: 18),
                label: const Text('Add field'),
              ),
              const SizedBox(width: 8),
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.add_circle_outline, size: 18),
                label: const Text('Add source'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Document Intelligence grid (MVP placeholder)', style: Theme.of(context).textTheme.titleSmall),
                  const SizedBox(height: 8),
                  Text(
                    'Workspace: $workspaceName. No backend — grid and Co-Pilot would connect to APIs in a full build.',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.muted),
                  ),
                  const SizedBox(height: 24),
                  Table(
                    border: TableBorder.all(color: AppTheme.border),
                    columnWidths: const {
                      0: FlexColumnWidth(2),
                      1: FlexColumnWidth(2),
                      2: FlexColumnWidth(1),
                    },
                    children: [
                      TableRow(
                        decoration: const BoxDecoration(color: AppTheme.bg),
                        children: [
                          _cell('Document', bold: true),
                          _cell('Extraction field', bold: true),
                          _cell('Status', bold: true),
                        ],
                      ),
                      TableRow(children: [_cell('Sample doc 1'), _cell('Counterparty'), _cell('Snippet')]),
                      TableRow(children: [_cell('Sample doc 2'), _cell('Valuation'), _cell('Pending')]),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _cell(String text, {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Text(text, style: TextStyle(fontWeight: bold ? FontWeight.w600 : FontWeight.normal, fontSize: 14)),
    );
  }
}
