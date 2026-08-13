import React, { useState } from 'react';
import { CameraIcon, KeyRoundIcon, SaveIcon, ShieldCheckIcon } from 'lucide-react';
import { PageHeader } from '../../components/admin/shared/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/admin/ui/Card';
import { Button } from '../../components/admin/ui/Button';
import { Badge } from '../../components/admin/ui/Badge';
import { Field, Input } from '../../components/admin/ui/Input';
import { useAppDispatch, useAppSelector } from '../../redux/admin';
import { updateProfile } from '../../redux/admin/authSlice';
import { relativeTime } from '../../utils/admin/format';

export function Profile() {
  const user = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  const mismatch = passwords.next.length > 0 && passwords.next !== passwords.confirm;

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your account details, photo and sign-in credentials."
        actions={
        <Button variant="primary" onClick={() => dispatch(updateProfile(form))}>
            <SaveIcon className="h-3.5 w-3.5" />
            Save changes
          </Button>
        } />
      

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardBody className="flex flex-col items-center py-8 text-center">
            <div className="relative">
              <img
                src={user.avatar}
                alt=""
                className="h-24 w-24 rounded-full object-cover ring-2 ring-border" />
              
              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface shadow-card transition-colors hover:bg-muted"
                aria-label="Change profile photo">
                
                <CameraIcon className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <p className="mt-4 text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <div className="mt-3">
              <Badge tone="primary">
                <ShieldCheckIcon className="h-3 w-3" />
                {user.roleName}
              </Badge>
            </div>
            <p className="mt-4 text-[11px] text-muted-foreground">
              Last signed in {relativeTime(new Date(Date.now() - 3600_000).toISOString())}
            </p>
          </CardBody>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Account details" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Email address" required>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
                
              </Field>
              <Field label="Phone number">
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </Field>
              <Field label="Role" hint="Only a Super Admin can change roles">
                <Input value={user.roleName} disabled />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Change password"
              description="Use at least 12 characters with a mix of letters, numbers and symbols." />
            
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Field label="Current password" className="sm:col-span-2">
                <Input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                
              </Field>
              <Field label="New password">
                <Input
                  type="password"
                  value={passwords.next}
                  onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} />
                
              </Field>
              <Field
                label="Confirm new password"
                hint={mismatch ? 'Passwords do not match' : undefined}>
                
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className={mismatch ? 'border-danger focus:border-danger focus:ring-danger/30' : ''} />
                
              </Field>
              <div className="sm:col-span-2">
                <Button
                  variant="secondary"
                  disabled={mismatch || passwords.next.length === 0}
                  onClick={() => setPasswords({ current: '', next: '', confirm: '' })}>
                  
                  <KeyRoundIcon className="h-3.5 w-3.5" />
                  Update password
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>);

}