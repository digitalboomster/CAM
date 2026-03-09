import 'package:flutter/material.dart';
import '../app_theme.dart';
import '../models/fund.dart';

class FundHeader extends StatelessWidget {
  const FundHeader({
    super.key,
    required this.selectedFundId,
    required this.onFundChanged,
    this.onLogoTap,
  });

  final String selectedFundId;
  final void Function(String fundId) onFundChanged;
  final VoidCallback? onLogoTap;

  @override
  Widget build(BuildContext context) {
    final fund = kFunds.firstWhere((f) => f.id == selectedFundId, orElse: () => kFunds.first);
    return Container(
      height: 48,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        border: const Border(bottom: BorderSide(color: AppTheme.border)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 2, offset: const Offset(0, 1))],
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: onLogoTap,
            child: Row(
              children: [
                Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: AppTheme.slate800,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  alignment: Alignment.center,
                  child: const Text('N', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                ),
                const SizedBox(width: 8),
                const Text('Nautilus', style: TextStyle(fontWeight: FontWeight.w600, color: AppTheme.text, fontSize: 14)),
                const SizedBox(width: 4),
                const Text('·', style: TextStyle(color: AppTheme.muted)),
                const SizedBox(width: 4),
                Text('Cordros Asset Management', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.text)),
              ],
            ),
          ),
          const Spacer(),
          Text('FUND', style: Theme.of(context).textTheme.labelSmall?.copyWith(color: AppTheme.muted, letterSpacing: 1.2)),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.bg,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.border),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: fund.id,
                isDense: true,
                items: kFunds.map((f) => DropdownMenuItem(value: f.id, child: Text(f.name, style: const TextStyle(fontSize: 14)))).toList(),
                onChanged: (id) => id != null ? onFundChanged(id) : null,
              ),
            ),
          ),
        ],
      ),
    );
  }

}
