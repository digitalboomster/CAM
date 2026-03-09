import 'package:flutter/material.dart';
import 'app_theme.dart';
import 'models/fund.dart';
import 'models/workspace.dart';
import 'mock/mock_data.dart';
import 'widgets/nautilus_sidebar.dart';
import 'widgets/fund_header.dart';
import 'screens/dashboard_screen.dart';
import 'screens/workspace_screen.dart';
import 'screens/reports_screen.dart';
import 'screens/settings_screen.dart';

void main() {
  runApp(const CamApp());
}

class CamApp extends StatelessWidget {
  const CamApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CAM',
      theme: AppTheme.light,
      debugShowCheckedModeBanner: false,
      home: const DashboardShell(),
    );
  }
}

class DashboardShell extends StatefulWidget {
  const DashboardShell({super.key});

  @override
  State<DashboardShell> createState() => _DashboardShellState();
}

class _DashboardShellState extends State<DashboardShell> {
  String _route = '/dashboard';
  String _fundId = kFunds.first.id;
  List<Workspace> _workspaces = List.from(MockData.workspaces);
  String? _activeWorkspaceId;

  void _navigate(String route) {
    setState(() => _route = route);
  }

  void _selectWorkspace(String id) {
    setState(() => _activeWorkspaceId = id);
  }

  void _newWorkspace() {
    setState(() {
      final n = _workspaces.length + 1;
      _workspaces = [..._workspaces, Workspace(id: 'ws-$n', name: 'Workspace $n')];
      _activeWorkspaceId = _workspaces.last.id;
    });
  }

  Widget _body() {
    switch (_route) {
      case '/dashboard':
        return DashboardScreen(
          selectedFundId: _fundId,
          workspaceCount: _workspaces.length,
          exportCount: MockData.exportLog.length,
          onOpenDocumentIntelligence: () => _navigate('/workspace'),
          onOpenReports: () => _navigate('/reports'),
        );
      case '/workspace':
        return WorkspaceScreen(
          workspaces: _workspaces,
          activeWorkspaceId: _activeWorkspaceId,
          onSelectWorkspace: _selectWorkspace,
          onNewWorkspace: _newWorkspace,
        );
      case '/reports':
        return ReportsScreen(
          workspaces: _workspaces,
          exports: MockData.exportLog,
          onOpenWorkspace: (id) {
            if (id != null) _selectWorkspace(id);
            _navigate('/workspace');
          },
        );
      case '/settings':
        return const SettingsScreen();
      default:
        return DashboardScreen(
          selectedFundId: _fundId,
          workspaceCount: _workspaces.length,
          exportCount: MockData.exportLog.length,
          onOpenDocumentIntelligence: () => _navigate('/workspace'),
          onOpenReports: () => _navigate('/reports'),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bg,
      body: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          NautilusSidebar(
            currentRoute: _route,
            onNavigate: _navigate,
            workspaces: _route == '/workspace' ? _workspaces : [],
            activeWorkspaceId: _activeWorkspaceId,
            onSelectWorkspace: _selectWorkspace,
            onNewWorkspace: _route == '/workspace' ? _newWorkspace : null,
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                FundHeader(
                  selectedFundId: _fundId,
                  onFundChanged: (id) => setState(() => _fundId = id),
                  onLogoTap: () => _navigate('/dashboard'),
                ),
                Expanded(child: _body()),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
