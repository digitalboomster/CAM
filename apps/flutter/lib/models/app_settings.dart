enum DefaultExportFormat { pdf, excel }

class AppSettings {
  const AppSettings({
    this.defaultExportFormat = DefaultExportFormat.pdf,
    this.requireCitationsOnExport = true,
  });
  final DefaultExportFormat defaultExportFormat;
  final bool requireCitationsOnExport;

  AppSettings copyWith({
    DefaultExportFormat? defaultExportFormat,
    bool? requireCitationsOnExport,
  }) {
    return AppSettings(
      defaultExportFormat: defaultExportFormat ?? this.defaultExportFormat,
      requireCitationsOnExport: requireCitationsOnExport ?? this.requireCitationsOnExport,
    );
  }
}
