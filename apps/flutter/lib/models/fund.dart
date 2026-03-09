class Fund {
  const Fund({required this.id, required this.name});
  final String id;
  final String name;
}

const List<Fund> kFunds = [
  Fund(id: 'milestone-2023', name: 'Cordros Milestone Fund 2023'),
  Fund(id: 'growth', name: 'Cordros Growth Fund'),
  Fund(id: 'fixed-income', name: 'Cordros Fixed Income Fund'),
];

String getMockNav(String fundId) {
  switch (fundId) {
    case 'milestone-2023':
      return '124.52';
    case 'growth':
      return '18.76';
    case 'fixed-income':
      return '9.31';
    default:
      return '—';
  }
}
