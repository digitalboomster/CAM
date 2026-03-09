import 'package:flutter/material.dart';
import '../app_theme.dart';

class ModuleShell extends StatelessWidget {
  const ModuleShell({
    super.key,
    required this.title,
    this.subtitle,
    this.actionLabel,
    this.actionRoute,
    this.onActionTap,
    this.status,
    required this.child,
  });

  final String title;
  final String? subtitle;
  final String? actionLabel;
  final String? actionRoute;
  final VoidCallback? onActionTap;
  final String? status; // 'live' | 'partial' | 'coming_soon'
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          height: 56,
          padding: const EdgeInsets.symmetric(horizontal: 24),
          decoration: const BoxDecoration(
            color: AppTheme.surface,
            border: Border(bottom: BorderSide(color: AppTheme.border)),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(title, style: Theme.of(context).textTheme.titleMedium),
                        if (status != null) ...[
                          const SizedBox(width: 8),
                          _StatusChip(status: status!),
                        ],
                      ],
                    ),
                    if (subtitle != null)
                      Text(subtitle!, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.muted)),
                  ],
                ),
              ),
              if (actionLabel != null && (actionRoute != null || onActionTap != null))
                TextButton(
                  onPressed: () {
                    if (onActionTap != null) {
                      onActionTap!();
                    } else if (actionRoute != null) {
                      Navigator.of(context).pushNamed(actionRoute!);
                    }
                  },
                  style: TextButton.styleFrom(
                    backgroundColor: AppTheme.accent,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: Text(actionLabel!),
                ),
            ],
          ),
        ),
        Expanded(
          child: Container(
            color: AppTheme.bg,
            padding: const EdgeInsets.all(24),
            child: child,
          ),
        ),
      ],
    );
  }
}

class _StatusChip extends StatelessWidget {
  const _StatusChip({required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    switch (status) {
      case 'live':
        bg = const Color(0xFFDCFCE7);
        fg = const Color(0xFF166534);
        break;
      case 'partial':
        bg = const Color(0xFFFEF9C3);
        fg = const Color(0xFF854D0E);
        break;
      case 'coming_soon':
        bg = const Color(0xFFE0E7FF);
        fg = const Color(0xFF3730A3);
        break;
      default:
        bg = AppTheme.border;
        fg = AppTheme.muted;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
      child: Text(status.toUpperCase(), style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: fg)),
    );
  }
}
