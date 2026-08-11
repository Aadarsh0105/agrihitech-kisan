import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  ExternalLinkIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  UserIcon } from
'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { GlobalSearch } from './GlobalSearch';
import { Button } from '../ui/Button';
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '../ui/Dropdown';
import { useAppDispatch, useAppSelector } from '../../store';
import { setMobileDrawer, toggleTheme } from '../../store/uiSlice';
import { headerNotifications } from '../../data/notifications';
import { relativeTime } from '../../utils/format';
import { cn } from '../../utils/cn';

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useAppSelector((s) => s.ui.theme);
  const user = useAppSelector((s) => s.auth);
  const [searchOpen, setSearchOpen] = useState(false);
  const unread = headerNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="iconSm"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={() => dispatch(setMobileDrawer(true))}>
          
          <MenuIcon className="h-4 w-4" />
        </Button>

        <Breadcrumbs />

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-md border border-border bg-muted/60 px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted md:flex"
            aria-label="Open global search">
            
            <SearchIcon className="h-3.5 w-3.5" />
            <span className="pr-8">Search…</span>
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>
          <Button
            variant="ghost"
            size="iconSm"
            className="md:hidden"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}>
            
            <SearchIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="iconSm"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => dispatch(toggleTheme())}>
            
            {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </Button>

          <Dropdown
            trigger={({ toggle }) =>
            <Button variant="ghost" size="iconSm" aria-label="Notifications" onClick={toggle}>
                <span className="relative">
                  <BellIcon className="h-4 w-4" />
                  {unread > 0 ?
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger ring-2 ring-surface" /> :
                null}
                </span>
              </Button>
            }
            className="w-80">
            
            {({ close }) =>
            <>
                <DropdownLabel>Notifications · {unread} unread</DropdownLabel>
                <DropdownSeparator />
                <div className="max-h-72 overflow-y-auto">
                  {headerNotifications.map((item) =>
                <div
                  key={item.id}
                  className={cn(
                    'rounded-md px-2.5 py-2 transition-colors hover:bg-muted',
                    !item.read && 'bg-primary-subtle/40'
                  )}>
                  
                      <p className="text-xs font-medium text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                        {item.message}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground/80">
                        {relativeTime(item.createdAt)}
                      </p>
                    </div>
                )}
                </div>
                <DropdownSeparator />
                <DropdownItem
                onClick={() => {
                  navigate('/notifications');
                  close();
                }}>
                
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                  Manage notifications
                </DropdownItem>
              </>
            }
          </Dropdown>

          <Dropdown
            trigger={({ toggle }) =>
            <button
              type="button"
              onClick={toggle}
              className="flex items-center gap-2 rounded-md py-1 pl-1 pr-1.5 transition-colors hover:bg-muted"
              aria-label="Account menu">
              
                <img
                src={user.avatar}
                alt=""
                className="h-7 w-7 rounded-full object-cover ring-1 ring-border" />
              
                <span className="hidden text-left sm:block">
                  <span className="block text-xs font-medium leading-tight text-foreground">
                    {user.name}
                  </span>
                  <span className="block text-[10px] leading-tight text-muted-foreground">
                    {user.roleName}
                  </span>
                </span>
              </button>
            }>
            
            {({ close }) =>
            <>
                <DropdownLabel>{user.email}</DropdownLabel>
                <DropdownSeparator />
                <DropdownItem
                onClick={() => {
                  navigate('/profile');
                  close();
                }}>
                
                  <UserIcon className="h-3.5 w-3.5" />
                  Profile
                </DropdownItem>
                <DropdownItem
                onClick={() => {
                  navigate('/settings');
                  close();
                }}>
                
                  <SettingsIcon className="h-3.5 w-3.5" />
                  Site settings
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem danger onClick={close}>
                  <LogOutIcon className="h-3.5 w-3.5" />
                  Sign out
                </DropdownItem>
              </>
            }
          </Dropdown>
        </div>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>);

}