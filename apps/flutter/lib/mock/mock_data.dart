import '../models/export_log.dart';
import '../models/workspace.dart';

/// In-memory mock data for MVP (no backend).
class MockData {
  static final List<Workspace> workspaces = [
    const Workspace(id: 'ws-1', name: 'Workspace 1', projectId: 'p1', projectName: 'Project Alpha'),
    const Workspace(id: 'ws-2', name: 'Workspace 2', projectId: 'p1', projectName: 'Project Alpha'),
    const Workspace(id: 'ws-3', name: 'Workspace 3', projectId: null, projectName: 'No project'),
  ];

  static final List<ExportLogEntry> exportLog = [
    ExportLogEntry(
      id: 'exp-001',
      label: 'IC Memo Q1',
      workspaceId: 'ws-1',
      exportedBy: 'Demo User',
      at: '3/1/2025, 10:30 AM',
    ),
    ExportLogEntry(
      id: 'exp-002',
      label: 'DD Summary',
      workspaceId: 'ws-2',
      exportedBy: 'Demo User',
      at: '2/28/2025, 4:00 PM',
    ),
  ];
}
