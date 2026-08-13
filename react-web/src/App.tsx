
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Brands } from './pages/Brands';
import { BrandDetail } from './pages/BrandDetail';
import { Categories } from './pages/Categories';
import { CategoryDetail } from './pages/CategoryDetail';
import { RegisterBrand } from './pages/RegisterBrand';
import { AddProduct } from './pages/AddProduct';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { News } from './pages/News';
import { PrivacyPolicy, Terms } from './pages/LegalPage';
import { NotFound } from './pages/NotFound';
import { LocationProvider } from './context/LocationContext';
import MandiBhav from './pages/MandiBhav';
import { AdminRoot } from "./components/admin/AdminRoot";
import { ProtectedRoute as AdminProtectedRoute } from "./components/admin/auth/ProtectedRoute";
import { AdminLayout } from "./components/admin/layout/AdminLayout";
import { Dashboard as AdminDashboard } from "./pages/admin/Dashboard";
import { Banners as AdminBanners } from "./pages/admin/Banners";
import { Categories as AdminCategories } from "./pages/admin/Categories";
import { Brands as AdminBrands } from "./pages/admin/Brands";
import { Products as AdminProducts } from "./pages/admin/Products";
import { Subscriptions as AdminSubscriptions } from "./pages/admin/Subscriptions";

export function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin" element={<AdminRoot />}>
                <Route path="login" element={<Navigate to="/login" replace />} />
                <Route element={<AdminProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="banners" element={<AdminBanners />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="brands" element={<AdminBrands />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="subscriptions" element={<AdminSubscriptions />} />
                  </Route>
                </Route>
              </Route>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/mandi-bhav" element={<MandiBhav />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetails />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/brands/:slug" element={<BrandDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:slug" element={<CategoryDetail />} />
                <Route path="/register-brand" element={<RegisterBrand />} />
                <Route path="/brand" element={<Profile />} />
                <Route path="/brand/products" element={<Products />} />
                <Route path="/brand/add-product" element={<AddProduct />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/news" element={<News />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </LocationProvider>
    </ThemeProvider>);

}
