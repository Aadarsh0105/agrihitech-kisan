import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Navbar />
      <main key={pathname} className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>);

}