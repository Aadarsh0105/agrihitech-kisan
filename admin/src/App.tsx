import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { HomeCms } from './pages/HomeCms';
import { Banners } from './pages/Banners';
import { PlatformFeatures } from './pages/PlatformFeatures';
import { Benefits } from './pages/Benefits';
import { Testimonials } from './pages/Testimonials';
import { Categories } from './pages/Categories';
import { SubCategories } from './pages/SubCategories';
import { Brands } from './pages/Brands';
import { Products } from './pages/Products';
import { ProductForm } from './pages/ProductForm';
import { Attributes } from './pages/Attributes';
import { Dealers } from './pages/Dealers';
import { DealerDetail } from './pages/DealerDetail';
import { DealerRequests } from './pages/DealerRequests';
import { Locations } from './pages/Locations';
import { News } from './pages/News';
import { Blogs } from './pages/Blogs';
import { Schemes } from './pages/Schemes';
import { MandiBhav } from './pages/MandiBhav';
import { Faqs } from './pages/Faqs';
import { MediaLibrary } from './pages/MediaLibrary';
import { StaticPages } from './pages/StaticPages';
import { Seo } from './pages/Seo';
import { Languages } from './pages/Languages';
import { Roles } from './pages/Roles';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="home-cms" element={<HomeCms />} />
            <Route path="banners" element={<Banners />} />
            <Route path="platform-features" element={<PlatformFeatures />} />
            <Route path="benefits" element={<Benefits />} />
            <Route path="testimonials" element={<Testimonials />} />

            <Route path="categories" element={<Categories />} />
            <Route path="sub-categories" element={<SubCategories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id" element={<ProductForm />} />
            <Route path="attributes" element={<Attributes />} />

            <Route path="dealers" element={<Dealers />} />
            <Route path="dealers/:id" element={<DealerDetail />} />
            <Route path="dealer-requests" element={<DealerRequests />} />
            <Route path="locations" element={<Locations />} />

            <Route path="news" element={<News />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="schemes" element={<Schemes />} />
            <Route path="mandi-bhav" element={<MandiBhav />} />
            <Route path="faqs" element={<Faqs />} />

            <Route path="media" element={<MediaLibrary />} />
            <Route path="pages" element={<StaticPages />} />
            <Route path="seo" element={<Seo />} />
            <Route path="languages" element={<Languages />} />

            <Route path="roles" element={<Roles />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />

            <Route path="dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>);

}