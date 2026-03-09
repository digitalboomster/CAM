class ReportTemplate {
  const ReportTemplate({
    required this.id,
    required this.label,
    required this.description,
  });
  final String id;
  final String label;
  final String description;
}

const List<ReportTemplate> kReportTemplates = [
  ReportTemplate(
    id: 'ic-memo',
    label: 'IC Memo',
    description: 'Investment committee memo with sources and citations',
  ),
  ReportTemplate(
    id: 'dd-summary',
    label: 'DD Summary',
    description: 'Due diligence summary for a deal or project',
  ),
  ReportTemplate(
    id: 'committee-pack',
    label: 'Committee Pack',
    description: 'Pack for committee review with key extracts',
  ),
];
