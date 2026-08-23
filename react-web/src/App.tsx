
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Brands } from './pages/Brands';
import { Categories } from './pages/Categories';
import { RegisterBrand } from './pages/RegisterDealer';
import { RegisterCompany } from './pages/RegisterCompany';
import { AddProduct } from './pages/AddProduct';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
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
import { MandiBhav as AdminMandiBhav } from './pages/admin/MandiBhav';
import { Schemes as AdminSchemes } from './pages/admin/Schemes';
import { News as AdminNews } from './pages/admin/News';
import { HomeCms as AdminHomeCms } from './pages/admin/HomeCms';
import { SubCategories as AdminSubCategories } from './pages/admin/SubCategories';
import { ProductForm as AdminProductForm } from './pages/admin/ProductForm';
import { Dealers as AdminDealers } from './pages/admin/Dealers';
import { DealerDetail as AdminDealerDetail } from './pages/admin/DealerDetail';
import { DealerRequests as AdminDealerRequests } from './pages/admin/DealerRequests';
import { Locations as AdminLocations } from './pages/admin/Locations';
import { Languages as AdminLanguages } from './pages/admin/Languages';
import { Notifications as AdminNotifications } from './pages/admin/Notifications';
import { Settings as AdminSettings } from './pages/admin/Settings';
import { Users as AdminUsers } from './pages/admin/Users';
import { Companies as AdminCompanies } from './pages/admin/Companies';
import { CompanyDetail as AdminCompanyDetail } from './pages/admin/CompanyDetail';
import { UserDetail as AdminUserDetail } from './pages/admin/UserDetail';
import { Payments as AdminPayments } from './pages/admin/Payments';
import { Reports as AdminReports } from './pages/admin/Reports';
import { NotFound as AdminNotFound } from './pages/admin/NotFound';
import { Attributes as AdminAttributes } from './pages/admin/Attributes';
import { Benefits as AdminBenefits } from './pages/admin/Benefits';
import { Blogs as AdminBlogs } from './pages/admin/Blogs';
import { Faqs as AdminFaqs } from './pages/admin/Faqs';
import { MediaLibrary as AdminMediaLibrary } from './pages/admin/MediaLibrary';
import { PlatformFeatures as AdminPlatformFeatures } from './pages/admin/PlatformFeatures';
import { Roles as AdminRoles } from './pages/admin/Roles';
import { Seo as AdminSeo } from './pages/admin/Seo';
import { StaticPages as AdminStaticPages } from './pages/admin/StaticPages';
import { Testimonials as AdminTestimonials } from './pages/admin/Testimonials';
import { BusinessProtectedRoute } from './components/business/BusinessProtectedRoute';
import { BusinessLayout } from './components/business/BusinessLayout';
import { BusinessDashboard } from './pages/business/Dashboard';
import { BusinessBrands } from './pages/business/Brands';
import { BusinessProducts } from './pages/business/Products';
import { BusinessSettings } from './pages/business/Settings';
import { BusinessMarketplace } from './pages/business/Marketplace';
import { BusinessSubscription } from './pages/business/Subscription';
import { CompanyProtectedRoute } from './components/company/CompanyProtectedRoute';
import { CompanyLayout } from './components/company/CompanyLayout';
import { CompanyDashboard } from './pages/company/Dashboard';
import { CompanyProducts } from './pages/company/Products';
import { CompanyDealers } from './pages/company/Dealers';
import { CompanySettings } from './pages/company/Settings';
import { CompanyBrands } from './pages/company/Brands';
import { CompanySubscription } from './pages/company/Subscription';
import { UserProtectedRoute } from './components/user/UserProtectedRoute';
import { UserProfile } from './pages/user/Profile';
import { UserFavourites } from './pages/user/Favourites';
import { UserEnquiries } from './pages/user/Enquiries';
import { AnudanYojana } from './pages/user/AnudanYojana';
import { AnudanYojanaDetail } from './pages/user/AnudanYojanaDetail';
import { UserProductDetails } from './pages/user/ProductDetails';
import { UserCategoryDetail } from './pages/user/CategoryDetail';
import { UserBrandDetail } from './pages/user/BrandDetail';

export function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <LanguageProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
                    <Route path="products/new" element={<AdminProductForm />} />
                    <Route path="products/:id/edit" element={<AdminProductForm />} />
                    <Route path="subscriptions" element={<AdminSubscriptions />} />
                    <Route path="mandi-bhav" element={<AdminMandiBhav />} />
                    <Route path="schemes" element={<AdminSchemes />} />
                    <Route path="news" element={<AdminNews />} />
                    <Route path="home-cms" element={<AdminHomeCms />} />
                    <Route path="subcategories" element={<AdminSubCategories />} />
                    <Route path="attributes" element={<AdminAttributes />} />
                    <Route path="benefits" element={<AdminBenefits />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                    <Route path="faqs" element={<AdminFaqs />} />
                    <Route path="testimonials" element={<AdminTestimonials />} />
                    <Route path="dealers" element={<AdminDealers />} />
                    <Route path="dealers/:id" element={<AdminDealerDetail />} />
                    <Route path="dealer-requests" element={<AdminDealerRequests />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="users/:id" element={<AdminUserDetail />} />
                    <Route path="companies" element={<AdminCompanies />} />
                    <Route path="companies/:id" element={<AdminCompanyDetail />} />
                    <Route path="payments" element={<AdminPayments />} />
                    <Route path="locations" element={<AdminLocations />} />
                    <Route path="languages" element={<AdminLanguages />} />
                    <Route path="media" element={<AdminMediaLibrary />} />
                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="static-pages" element={<AdminStaticPages />} />
                    <Route path="platform-features" element={<AdminPlatformFeatures />} />
                    <Route path="roles" element={<AdminRoles />} />
                    <Route path="seo" element={<AdminSeo />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="*" element={<AdminNotFound />} />
                  </Route>
                </Route>
              </Route>
              <Route path="/business" element={<BusinessProtectedRoute />}>
                <Route element={<BusinessLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<BusinessDashboard />} />
                  <Route path="brands" element={<BusinessBrands />} />
                  <Route path="products" element={<BusinessProducts />} />
                  <Route path="marketplace" element={<BusinessMarketplace />} />
                  <Route path="marketplace/buy" element={<Navigate to="/business/marketplace" replace />} />
                  <Route path="marketplace/sell" element={<Navigate to="/business/marketplace" replace />} />
                  <Route path="subscription" element={<BusinessSubscription />} />
                  <Route path="settings" element={<BusinessSettings />} />
                </Route>
              </Route>
              <Route path="/company" element={<CompanyProtectedRoute />}>
                <Route element={<CompanyLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<CompanyDashboard />} />
                  <Route path="brands" element={<CompanyBrands />} />
                  <Route path="products" element={<CompanyProducts />} />
                  <Route path="dealers" element={<CompanyDealers />} />
                  <Route path="subscription" element={<CompanySubscription />} />
                  <Route path="settings" element={<CompanySettings />} />
                </Route>
              </Route>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/mandi-bhav" element={<MandiBhav />} />
                <Route path="/products" element={<Products />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/anudan-yojana" element={<AnudanYojana />} />
                <Route path="/anudan-yojana/:slug" element={<AnudanYojanaDetail />} />
                <Route path="/anudan-yojna" element={<Navigate to="/anudan-yojana" replace />} />
                <Route path="/register-brand" element={<RegisterBrand />} />
                <Route path="/register-company" element={<RegisterCompany />} />
                <Route path="/brand" element={<Navigate to="/user/profile" replace />} />
                <Route path="/brand/products" element={<Products />} />
                <Route path="/brand/add-product" element={<AddProduct />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:slug" element={<NewsDetail />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route element={<UserProtectedRoute />}>
                  <Route path="/products/:slug" element={<UserProductDetails />} />
                  <Route path="/brands/:slug" element={<UserBrandDetail />} />
                  <Route path="/categories/:slug" element={<UserCategoryDetail />} />
                  <Route path="/user/profile" element={<UserProfile />} />
                  <Route path="/user/favourites" element={<UserFavourites />} />
                  <Route path="/user/enquiries" element={<UserEnquiries />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </LocationProvider>
    </ThemeProvider>);

}
