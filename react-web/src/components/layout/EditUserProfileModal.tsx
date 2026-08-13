import { useEffect, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../ui/Button';
import { Input, Label } from '../ui/Input';
import {
  notifyAuthChanged,
  type SessionUser,
} from '../../services/auth-session';

interface UserLocation {
  state?: string;
  district?: string;
  village?: string;
  pincode?: string;
}

interface EditableUser extends SessionUser {
  location?: UserLocation;
}

interface ProfileResponse {
  success: boolean;
  user: EditableUser;
}

interface Props {
  open: boolean;
  user: SessionUser;
  onClose: () => void;
  onUpdated: (user: SessionUser) => void;
}

const emptyLocation: Required<UserLocation> = {
  state: '',
  district: '',
  village: '',
  pincode: '',
};

function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? error.message;
  }
  return error instanceof Error ? error.message : 'Failed to update profile';
}

export function EditUserProfileModal({ open, user, onClose, onUpdated }: Props) {
  const [profile, setProfile] = useState<EditableUser>(user);
  const [name, setName] = useState('');
  const [location, setLocation] = useState(emptyLocation);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setError('');
    api.get<ProfileResponse>('/auth/me')
      .then(({ data }) => {
        setProfile(data.user);
        setName(data.user.proprietorName ?? '');
        setLocation({ ...emptyLocation, ...data.user.location });
      })
      .catch((requestError) => setError(errorMessage(requestError)))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose, open]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('proprietorName', name.trim());
      formData.append('location', JSON.stringify(location));
      const { data } = await api.put<ProfileResponse>('/auth/me/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      notifyAuthChanged();
      onUpdated(data.user);
      onClose();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto p-4">
          <motion.button
            type="button"
            aria-label="Close edit profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="relative w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="edit-profile-title" className="font-display text-xl font-extrabold text-gray-900">Edit farmer profile</h2>
                <p className="mt-1 text-sm text-gray-500">Update your name and delivery location.</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                <X size={18} />
              </button>
            </div>

            {loading ? (
              <p className="py-12 text-center text-sm text-gray-500">Loading profile...</p>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter farmer name" required />
                </div>
                <div>
                  <Label>Mobile number</Label>
                  <Input value={profile.mobile} disabled className="cursor-not-allowed bg-gray-100" />
                  <p className="mt-1 text-xs text-gray-500">Mobile number cannot be changed.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>State</Label>
                    <Input value={location.state} onChange={(event) => setLocation((current) => ({ ...current, state: event.target.value }))} required />
                  </div>
                  <div>
                    <Label>District</Label>
                    <Input value={location.district} onChange={(event) => setLocation((current) => ({ ...current, district: event.target.value }))} required />
                  </div>
                  <div>
                    <Label>City / Village</Label>
                    <Input value={location.village} onChange={(event) => setLocation((current) => ({ ...current, village: event.target.value }))} required />
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input
                      inputMode="numeric"
                      value={location.pincode}
                      onChange={(event) => setLocation((current) => ({ ...current, pincode: event.target.value.replace(/\D/g, '').slice(0, 6) }))}
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                  <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
