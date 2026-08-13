import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Moon, Sun, User, Home, Boxes, Package, Newspaper, Phone, Info, Building2, ChevronRight, ChevronDown, LogOut, CircleHelp, FileText, ShieldCheck, Pencil } from "lucide-react";
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { LanguageSwitch } from './LanguageSwitch';
import type { TranslationKey } from '../../i18n/translations';
import { LocationPicker } from './LocationPicker';
import { AUTH_CHANGED_EVENT, clearSession, getSessionUser, sessionUserName } from '../../services/auth-session';
import { EditUserProfileModal } from './EditUserProfileModal';

const NAV: { key: TranslationKey; to: string }[] = [
  { key: "nav.home", to: "/" },
  { key: "nav.categories", to: "/categories" },
  { key: "nav.brands", to: "/brands" },
  { key: "nav.products", to: "/products" },
  { key: "nav.news", to: "/news" },
  { key: "nav.about", to: "/about" },
  { key: "nav.contact", to: "/contact" },
];

const NAV_ICONS = {
  "/": Home,
  "/categories": Boxes,
  "/brands": Building2,
  "/products": Package,
  "/news": Newspaper,
  "/about": Info,
  "/contact": Phone,
};

export function Navbar() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState(getSessionUser);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncSession = () => setSessionUser(getSessionUser());
    window.addEventListener(AUTH_CHANGED_EVENT, syncSession);
    window.addEventListener('storage', syncSession);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  const logout = () => {
    clearSession();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setMobileOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-background border-b border-border shadow-md' : 'bg-background'}`}>
      <div className="container flex h-20 items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="AgriMandi home">
          <img src="/logo.png" className="w-12 h-12" alt="Agri Hi Tech" />
          <span className={`font-display font-bold text-xl tracking-tight text-gray-900`}> Agri HiTech{' '}
            <span className="text-primary-600">Kisan</span>
          </span>
        </Link>
        {/* Location */}
        <div className="hidden lg:block w-[210px]">
          <LocationPicker />
        </div>
        {/* Search */}
        <form onSubmit={submitSearch} className="hidden lg:flex flex-1">
          <div className="relative w-full">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("nav.searchPlaceholder")}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm shadow-sm
        transition placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"/>
          </div>
        </form>
        {/* Right */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden lg:block">
            <LanguageSwitch />
          </div>
          {/* Theme */}
          <button onClick={toggleTheme} className="hidden lg:grid h-11 w-11 place-items-center rounded-lg border border-gray-200 hover:bg-secondary transition">
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {sessionUser ? (
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex h-11 items-center gap-2 rounded-xl bg-primary px-3 font-semibold text-white shadow-md transition hover:bg-primary-700 hover:shadow-lg"
              >
                {sessionUser.profileimage ? (
                  <img src={sessionUser.profileimage} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20"><User size={16} /></span>
                )}
                <span className="max-w-28 truncate">{sessionUserName(sessionUser)}</span>
                <ChevronDown size={15} />
              </button>
              <AnimatePresence>
                {profileOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                  >
                    <div className="border-b border-gray-100 px-3 py-2">
                      <p className="truncate text-sm font-bold text-gray-900">{sessionUserName(sessionUser)}</p>
                      <p className="text-xs text-gray-500">{sessionUser.mobile}</p>
                    </div>
                    {sessionUser.role === 'B2C' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          setEditProfileOpen(true);
                        }}
                        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil size={18} className="text-primary" /> Edit profile
                        <ChevronRight size={16} className="ml-auto text-gray-400" />
                      </button>
                    ) : null}
                    <Link to="/contact" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <CircleHelp size={18} className="text-primary" /> Help & Support
                      <ChevronRight size={16} className="ml-auto text-gray-400" />
                    </Link>
                    <Link to="/terms" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <FileText size={18} className="text-primary" /> Terms & Conditions
                      <ChevronRight size={16} className="ml-auto text-gray-400" />
                    </Link>
                    <Link to="/privacy-policy" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <ShieldCheck size={18} className="text-primary" /> Privacy Policy
                      <ChevronRight size={16} className="ml-auto text-gray-400" />
                    </Link>
                    <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                      <LogOut size={18} /> Logout
                      <ChevronRight size={16} className="ml-auto text-red-300" />
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="hidden lg:flex items-center gap-2 rounded-xl bg-primary px-4 h-11 text-white font-semibold shadow-md
        hover:shadow-lg hover:bg-primary-700 transition">
              <User size={18} />
              {t("nav.login")}
            </Link>
          )}
          {/* Mobile */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden h-11 w-11 rounded-xl border border-gray-200 grid place-items-center">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

      </div>
      {/* Mobile Search */}

      <div className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
        <form onSubmit={submitSearch}>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("nav.searchPlaceholder")}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm shadow-sm
          placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"/>
          </div>
        </form>
      </div>
      {/* desktop nav row */}
      <nav className="hidden lg:block border-t border-gray-100">
        <div className="container">
          <div className="flex justify-center gap-8 h-12 items-center">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `relative text-[15px] font-semibold transition hover:text-primary
             ${isActive ? "text-primary" : "text-gray-600"}`}>
                {({ isActive }) => (
                  <>
                    {t(item.key)}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-[8px] left-0 h-[3px] w-full rounded-full bg-primary"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.25 }} className="fixed inset-0 z-[100] bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)}>
            {/* Drawer */}
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between border-b px-3 py-4">
                <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="AgriMandi home">
                  <img src="/logo.png" className="w-12 h-12" alt="Agri Hi Tech" />
                  <span className={`font-display font-bold text-xl tracking-tight text-gray-900`}> Agri HiTech{' '}
                    <span className="text-primary-600">Kisan</span>
                  </span>
                </Link>

                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 hover:bg-gray-100">
                  <X />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-5 overflow-y-auto py-4 px-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <LocationPicker />
                  </div>
                  <div className="shrink-0">
                    <LanguageSwitch />
                  </div>
                </div>

                {/* <form onSubmit={submitSearch}>
                  <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("nav.searchPlaceholder")}
                      className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10" />
                  </div>
                </form> */}
                {/* Navigation */}
                <div className="space-y-1">
                  {NAV.map((item) => {
                    const Icon = NAV_ICONS[item.to as keyof typeof NAV_ICONS];
                    return (
                      <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center 
                      justify-between rounded-xl px-4 py-3 transition ${isActive ? "bg-primary text-white" : "hover:bg-gray-100"}`}>
                        <div className="flex items-center gap-3">
                          <Icon size={20} />
                          <span className="font-medium">
                            {t(item.key)}
                          </span>
                        </div>
                        <ChevronRight size={18} />
                      </NavLink>
                    );
                  })}
                </div>
                {sessionUser ? (
                  <div className="space-y-1 border-t border-gray-100 pt-4">
                    <div className="mb-2 rounded-xl bg-emerald-50 px-4 py-3">
                      <p className="truncate font-bold text-gray-900">{sessionUserName(sessionUser)}</p>
                      <p className="text-sm text-gray-500">{sessionUser.mobile}</p>
                    </div>
                    {sessionUser.role === 'B2C' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          setEditProfileOpen(true);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <Pencil size={19} className="text-primary" /> Edit profile <ChevronRight size={17} className="ml-auto" />
                      </button>
                    ) : null}
                    <Link to="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100">
                      <CircleHelp size={19} className="text-primary" /> Help & Support <ChevronRight size={17} className="ml-auto" />
                    </Link>
                    <Link to="/terms" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100">
                      <FileText size={19} className="text-primary" /> Terms & Conditions <ChevronRight size={17} className="ml-auto" />
                    </Link>
                    <Link to="/privacy-policy" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-100">
                      <ShieldCheck size={19} className="text-primary" /> Privacy Policy <ChevronRight size={17} className="ml-auto" />
                    </Link>
                    <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-600 hover:bg-red-50">
                      <LogOut size={19} /> Logout <ChevronRight size={17} className="ml-auto" />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex h-12 items-center 
                  justify-center gap-2 rounded-xl bg-primary font-semibold text-white shadow-md">
                    <User size={18} />
                    {t("nav.login")}
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {sessionUser ? (
        <EditUserProfileModal
          open={editProfileOpen}
          user={sessionUser}
          onClose={() => setEditProfileOpen(false)}
          onUpdated={setSessionUser}
        />
      ) : null}
    </header>);
}
