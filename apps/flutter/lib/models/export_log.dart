class ExportLogEntry {
  const ExportLogEntry({
    required this.id,
    required this.label,
    required this.workspaceId,
    this.exportedBy,
    required this.at,
  });
  final String id;
  final String label;
  final String workspaceId;
  final String? exportedBy;
  final String at;
}
