import React, { useState } from 'react';
import { CheckIcon, PlusIcon, ShieldIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from '../../components/admin/shared/PageHeader';
import { DataTable, type Column } from '../../components/admin/shared/DataTable';
import { RowActions } from '../../components/admin/shared/RowActions';
import { Thumb } from '../../components/admin/shared/Thumb';
import { Card, CardBody, CardHeader } from '../../components/admin/ui/Card';
import { Button } from '../../components/admin/ui/Button';
import { Badge, StatusBadge } from '../../components/admin/ui/Badge';
import { Tabs } from '../../components/admin/ui/Tabs';
import { useResource } from '../../hooks/admin/useResource';
import { adminUsers, permissionModules, roles } from '../../data/admin/system';
import { relativeTime } from '../../utils/admin/format';
import { cn } from '../../utils/admin/cn';
import type { AdminUser, PermissionAction, Role } from '../../types/admin';

const actions: PermissionAction[] = ['view', 'create', 'edit', 'delete'];

const userColumns: Column<AdminUser>[] = [
{
  key: 'user',
  header: 'User',
  render: (item) =>
  <div className="flex items-center gap-3">
        <Thumb src={item.avatar} alt={item.name} rounded="full" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{item.email}</p>
        </div>
      </div>

},
{ key: 'role', header: 'Role', render: (item) => <Badge tone="primary">{item.roleName}</Badge> },
{
  key: 'lastActive',
  header: 'Last active',
  render: (item) => <span className="text-xs text-muted-foreground">{relativeTime(item.lastActive)}</span>
},
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
{
  key: 'actions',
  header: '',
  align: 'right',
  className: 'w-12',
  render: () => <RowActions onEdit={() => undefined} onDelete={() => undefined} />
}];


export function Roles() {
  const [tab, setTab] = useState('permissions');
  const rolesResource = useResource<Role>({ endpoint: 'roles', seed: roles });
  const usersResource = useResource<AdminUser>({ endpoint: 'adminUsers', seed: adminUsers });
  const [activeRoleId, setActiveRoleId] = useState(roles[0].id);

  const activeRole = rolesResource.items.find((r) => r.id === activeRoleId) ?? rolesResource.items[0];

  const toggle = (module: string, action: PermissionAction) => {
    if (!activeRole) return;
    const current = activeRole.permissions[module] ?? [];
    const next = current.includes(action) ?
    current.filter((a) => a !== action) :
    [...current, action];
    rolesResource.update(activeRole.id, {
      permissions: { ...activeRole.permissions, [module]: next }
    } as Partial<Role>);
  };

  return (
    <>
      <PageHeader
        title="Roles & Permissions"
        description="Module-wise access control for every admin team member."
        actions={
        <Button variant="primary">
            <PlusIcon className="h-3.5 w-3.5" />
            Invite user
          </Button>
        } />
      

      <Tabs
        idPrefix="roles"
        value={tab}
        onChange={setTab}
        items={[
        { key: 'permissions', label: 'Permissions', count: rolesResource.items.length },
        { key: 'users', label: 'Admin users', count: usersResource.items.length }]
        } />
      

      {tab === 'permissions' ?
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <Card className="h-fit">
            <CardBody className="space-y-1 p-2">
              {rolesResource.items.map((role) =>
            <button
              key={role.id}
              type="button"
              onClick={() => setActiveRoleId(role.id)}
              className={cn(
                'flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left transition-colors',
                role.id === activeRoleId ?
                'bg-primary-subtle text-primary' :
                'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}>
              
                  <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{role.name}</span>
                    <span className="block truncate text-[11px] opacity-70">
                      {role.userCount} users
                    </span>
                  </span>
                </button>
            )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
            title={activeRole?.name ?? 'Role'}
            description={activeRole?.description}
            action={
            <Badge tone="info">
                  <UsersIcon className="h-3 w-3" />
                  {activeRole?.userCount} users
                </Badge>
            } />
          
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/60">
                    <th
                    scope="col"
                    className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    
                      Module
                    </th>
                    {actions.map((action) =>
                  <th
                    key={action}
                    scope="col"
                    className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    
                        {action}
                      </th>
                  )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {permissionModules.map((module) =>
                <tr key={module} className="hover:bg-muted/40">
                      <th
                    scope="row"
                    className="px-5 py-2.5 text-left text-xs font-medium text-foreground">
                    
                        {module}
                      </th>
                      {actions.map((action) => {
                    const granted = (activeRole?.permissions[module] ?? []).includes(action);
                    return (
                      <td key={action} className="px-4 py-2.5 text-center">
                            <button
                          type="button"
                          role="checkbox"
                          aria-checked={granted}
                          aria-label={`${action} ${module}`}
                          onClick={() => toggle(module, action)}
                          className={cn(
                            'inline-flex h-5 w-5 items-center justify-center rounded border transition-colors',
                            granted ?
                            'border-primary bg-primary text-primary-foreground' :
                            'border-border bg-surface hover:border-primary/50'
                          )}>
                          
                              {granted ? <CheckIcon className="h-3 w-3" /> : null}
                            </button>
                          </td>);

                  })}
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </Card>
        </div> :

      <DataTable
        columns={userColumns}
        items={usersResource.items}
        isLoading={usersResource.isLoading}
        totalItems={usersResource.items.length}
        emptyTitle="No admin users"
        emptyMessage="Invite a team member to give them access to this console." />

      }
    </>);

}