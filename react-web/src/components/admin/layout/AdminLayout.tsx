import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { MobileDrawer, Sidebar } from './Sidebar';
import { useAppSelector } from '../../../redux/admin';
import { dealerRequests } from '../../../data/admin/dealers';

export function AdminLayout() {
  const theme = useAppSelector((s) => s.ui.theme);
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const badges = { dealerRequests: dealerRequests.length };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar badges={badges} />
      <MobileDrawer badges={badges} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-[1400px] space-y-6">
            
            <Outlet />
          </motion.div>
        </main>
        <footer className="border-t border-border px-4 py-4 text-center text-[11px] text-muted-foreground sm:px-6">
          © 2026 Agri HiTech Kisan · Admin Console v2.4.0
        </footer>
      </div>
    </div>);

}