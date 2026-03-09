import 'package:flutter/material.dart';
import '../app_theme.dart';
import '../models/fund.dart';
import '../widgets/module_shell.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({
    super.key,
    required this.selectedFundId,
    required this.workspaceCount,
    required this.exportCount,
    required this.onOpenDocumentIntelligence,
    required this.onOpenReports,
  });

  final String selectedFundId;
  final int workspaceCount;
  final int exportCount;
  final VoidCallback onOpenDocumentIntelligence;
  final VoidCallback onOpenReports;

  @override
  Widget build(BuildContext context) {
    return ModuleShell(
      title: 'Dashboard',
      subtitle: 'Overview and quick actions',
      actionLabel: 'Open Document Intelligence',
      onActionTap: onOpenDocumentIntelligence,
      status: 'live',
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 24),
            _QuickActions(
              onOpenDocumentIntelligence: onOpenDocumentIntelligence,
              onOpenReports: onOpenReports,
            ),
            const SizedBox(height: 24),
            _StatCards(
              nav: getMockNav(selectedFundId),
              navAsOf: _formatDate(DateTime.now()),
              workspaceCount: workspaceCount,
              exportCount: exportCount,
            ),
            const SizedBox(height: 24),
            const _ComplianceSection(),
          ],
        ),
      ),
    );
  }

  static String _formatDate(DateTime d) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${months[d.month - 1]} ${d.day}, ${d.year}';
  }
}

class _QuickActions extends StatelessWidget {
  const _QuickActions({
    required this.onOpenDocumentIntelligence,
    required this.onOpenReports,
  });

  final VoidCallback onOpenDocumentIntelligence;
  final VoidCallback onOpenReports;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Quick actions', style: Theme.of(context).textTheme.titleSmall?.copyWith(color: AppTheme.text)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                FilledButton(
                  onPressed: onOpenDocumentIntelligence,
                  child: const Text('Open Document Intelligence'),
                ),
                OutlinedButton(
                  onPressed: onOpenReports,
                  child: const Text('Reports & export history'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCards extends StatelessWidget {
  const _StatCards({
    required this.nav,
    required this.navAsOf,
    required this.workspaceCount,
    required this.exportCount,
  });

  final String nav;
  final String navAsOf;
  final int workspaceCount;
  final int exportCount;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: _StatCard(label: 'NAV', value: nav, sub: navAsOf)),
        const SizedBox(width: 16),
        Expanded(child: _StatCard(label: 'WORKSPACES', value: '$workspaceCount', sub: null)),
        const SizedBox(width: 16),
        Expanded(child: _StatCard(label: 'EXPORTS', value: '$exportCount', sub: null)),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({required this.label, required this.value, this.sub});

  final String label;
  final String value;
  final String? sub;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: Theme.of(context).textTheme.labelSmall?.copyWith(color: AppTheme.muted, letterSpacing: 1.2)),
            const SizedBox(height: 4),
            Text(value, style: Theme.of(context).textTheme.titleLarge),
            if (sub != null) Text(sub!, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.muted)),
          ],
        ),
      ),
    );
  }
}

class _ComplianceSection extends StatefulWidget {
  const _ComplianceSection();

  @override
  State<_ComplianceSection> createState() => _ComplianceSectionState();
}

class _ComplianceSectionState extends State<_ComplianceSection> {
  bool _loading = false;
  bool? _passed;
  String? _message;

  Future<void> _runCheck() async {
    setState(() {
      _loading = true;
      _passed = null;
      _message = null;
    });
    await Future<void>.delayed(const Duration(milliseconds: 1200));
    if (!mounted) return;
    setState(() {
      _loading = false;
      _passed = true;
      _message = 'Pre-trade and mandate checks passed. No breaches detected for the current fund.';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Compliance', style: Theme.of(context).textTheme.titleSmall?.copyWith(color: AppTheme.text)),
            Text('Pre-trade and mandate checks.', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.muted)),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: _loading ? null : _runCheck,
              style: OutlinedButton.styleFrom(backgroundColor: AppTheme.bg),
              child: Text(_loading ? 'Running…' : 'Run check'),
            ),
            if (_passed != null && _message != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Passed', style: Theme.of(context).textTheme.labelMedium?.copyWith(color: const Color(0xFF065F46))),
                    const SizedBox(height: 4),
                    Text(_message!, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: const Color(0xFF047857))),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
