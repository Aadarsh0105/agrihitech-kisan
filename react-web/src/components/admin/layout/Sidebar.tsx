import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LeafIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import { cn } from '../../../utils/admin/cn';
import { navigation } from '../../../config/admin/navigation';
import { useAppDispatch, useAppSelector } from '../../../redux/admin';
import { setMobileDrawer, toggleSidebar } from '../../../redux/admin/uiSlice';

export function SidebarContent({
  collapsed,
  onNavigate,
  badges




}: {collapsed: boolean;onNavigate?: () => void;badges: Record<string, number>;}) {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Main navigation" className="flex h-full flex-col">
      <div
        className={cn(
          'flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-4',
          collapsed && 'justify-center px-0'
        )}>
        
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary">
          <LeafIcon className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
        </div>
        {!collapsed ?
        <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-foreground">
              Agri HiTech Kisan
            </p>
            <p className="truncate text-[11px] leading-tight text-muted-foreground">Admin Console</p>
          </div> :
        null}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navigation.map((group) =>
        <div key={group.label}>
            {!collapsed ?
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {group.label}
              </p> :

          <div className="mx-auto mb-2 h-px w-6 bg-border" />
          }
            <ul className="space-y-0.5">
              {group.items.map((item) => {
              const active =
              item.path === '/admin/dashboard' ?
              pathname === '/admin' || pathname === '/admin/dashboard' :
              pathname.startsWith(item.path);
              const badge = item.badgeKey ? badges[item.badgeKey] : undefined;
              return (
                <li key={item.path}>
                    <NavLink
                    to={item.path}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      collapsed && 'justify-center px-0',
                      active ?
                      'bg-primary-subtle font-medium text-primary' :
                      'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}>
                    
                      {active ?
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }} /> :

                    null}
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {!collapsed ? <span className="truncate">{item.label}</span> : null}
                      {!collapsed && badge ?
                    <span className="ml-auto rounded-full bg-warning-subtle px-1.5 py-0.5 text-[10px] font-semibold text-warning">
                          {badge}
                        </span> :
                    null}
                    </NavLink>
                  </li>);

            })}
            </ul>
          </div>
        )}
      </div>
    </nav>);

}

export function Sidebar({ badges }: {badges: Record<string, number>;}) {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const dispatch = useAppDispatch();

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 border-r border-border bg-surface transition-[width] duration-200 lg:flex lg:flex-col',
        collapsed ? 'w-[68px]' : 'w-64'
      )}>
      
      <SidebarContent collapsed={collapsed} badges={badges} />
      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            collapsed && 'justify-center'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          
          {collapsed ?
          <PanelLeftOpenIcon className="h-4 w-4" /> :

          <>
              <PanelLeftCloseIcon className="h-4 w-4" />
              Collapse
            </>
          }
        </button>
      </div>
    </aside>);

}

export function MobileDrawer({ badges }: {badges: Record<string, number>;}) {
  const open = useAppSelector((s) => s.ui.mobileDrawerOpen);
  const dispatch = useAppDispatch();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => dispatch(setMobileDrawer(false))}
        aria-hidden="true" />
      
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 left-0 w-64 border-r border-border bg-surface">
        
        <SidebarContent
          collapsed={false}
          badges={badges}
          onNavigate={() => dispatch(setMobileDrawer(false))} />
        
      </motion.div>
    </div>);

}
