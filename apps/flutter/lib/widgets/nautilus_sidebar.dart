import 'package:flutter/material.dart';
import '../app_theme.dart';
import '../models/workspace.dart';

class NavItem {
  const NavItem({required this.route, required this.label, required this.icon});
  final String route;
  final String label;
  final IconData icon;
}

const List<NavItem> kNavItems = [
  NavItem(route: '/dashboard', label: 'Dashboard', icon: Icons.dashboard_outlined),
  NavItem(route: '/workspace', label: 'Document Intelligence', icon: Icons.grid_view_outlined),
  NavItem(route: '/reports', label: 'Reports', icon: Icons.description_outlined),
  NavItem(route: '/settings', label: 'Settings', icon: Icons.settings_outlined),
];

class NautilusSidebar extends StatelessWidget {
  const NautilusSidebar({
    super.key,
    required this.currentRoute,
    required this.onNavigate,
    this.workspaces = const [],
    this.activeWorkspaceId,
    this.onSelectWorkspace,
    this.onNewWorkspace,
  });

  final String currentRoute;
  final void Function(String route) onNavigate;
  final List<Workspace> workspaces;
  final String? activeWorkspaceId;
  final void Function(String id)? onSelectWorkspace;
  final VoidCallback? onNewWorkspace;

  @override
  Widget build(BuildContext context) {
    final onWorkspace = currentRoute == '/workspace';
    return Container(
      width: 256,
      decoration: const BoxDecoration(
        color: AppTheme.surface,
        border: Border(right: BorderSide(color: AppTheme.border)),
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 2, offset: Offset(-1, 0))],
      ),
      child: Column(
        children: [
          _Header(onTap: () => onNavigate('/dashboard')),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              children: [
                for (final item in kNavItems)
                  _NavTile(
                    item: item,
                    selected: currentRoute == item.route ||
                        (item.route != '/dashboard' && currentRoute.startsWith('${item.route}/')),
                    onTap: () => onNavigate(item.route),
                  ),
                if (onWorkspace && (workspaces.isNotEmpty || onNewWorkspace != null)) ...[
                  const SizedBox(height: 16),
                  const Divider(height: 1),
                  const SizedBox(height: 8),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'PROJECTS / WORKSPACES',
                          style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                color: AppTheme.muted,
                                letterSpacing: 1.2,
                              ),
                        ),
                        if (onNewWorkspace != null)
                          TextButton(
                            onPressed: onNewWorkspace,
                            style: TextButton.styleFrom(
                              padding: const EdgeInsets.symmetric(horizontal: 8),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            child: const Text('+ New', style: TextStyle(color: Color(0xFF0D9488), fontSize: 12)),
                          ),
                      ],
                    ),
                  ),
                  ..._groupWorkspacesByProject(workspaces).entries.expand((e) => [
                        Padding(
                          padding: const EdgeInsets.only(left: 12, top: 4),
                          child: Text(
                            e.key,
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppTheme.muted),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        ...e.value.map((ws) => _WorkspaceTile(
                              name: ws.name,
                              selected: activeWorkspaceId == ws.id,
                              onTap: () => onSelectWorkspace?.call(ws.id),
                            )),
                      ]),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Map<String, List<Workspace>> _groupWorkspacesByProject(List<Workspace> list) {
    final map = <String, List<Workspace>>{};
    for (final ws in list) {
      final key = ws.projectName ?? 'No project';
      map.putIfAbsent(key, () => []).add(ws);
    }
    final nullKey = map.remove('No project');
    if (nullKey != null) {
      final ordered = <String, List<Workspace>>{'No project': nullKey};
      ordered.addAll(map);
      return ordered;
    }
    return map;
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppTheme.slate800,
                borderRadius: BorderRadius.circular(8),
              ),
              alignment: Alignment.center,
              child: const Text('N', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            ),
            const SizedBox(width: 10),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text('Nautilus', style: TextStyle(fontWeight: FontWeight.w600, color: AppTheme.text, fontSize: 14)),
                  Text('Cordros', style: TextStyle(fontSize: 10, color: AppTheme.muted, letterSpacing: 1.2)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NavTile extends StatelessWidget {
  const _NavTile({required this.item, required this.selected, required this.onTap});

  final NavItem item;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Material(
        color: selected ? AppTheme.accentMuted : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              border: Border(
                left: BorderSide(
                  color: selected ? AppTheme.accent : Colors.transparent,
                  width: 2,
                ),
              ),
            ),
            child: Row(
              children: [
                Icon(item.icon, size: 20, color: selected ? AppTheme.text : AppTheme.muted),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    item.label,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: selected ? FontWeight.w500 : FontWeight.normal,
                      color: AppTheme.text,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _WorkspaceTile extends StatelessWidget {
  const _WorkspaceTile({required this.name, required this.selected, required this.onTap});

  final String name;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 2),
      child: Material(
        color: selected ? const Color(0xFFF0FDFA) : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(8),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Text(
              name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 14,
                color: selected ? const Color(0xFF0F766E) : AppTheme.text,
                fontWeight: selected ? FontWeight.w500 : FontWeight.normal,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
