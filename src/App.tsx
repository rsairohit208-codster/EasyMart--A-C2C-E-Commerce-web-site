/**
 * EasyMart - Premier C2C Everyday Essentials Marketplace (India)
 * Built with full Escrow protection, UPI settlements, and <5kg lightweight compliance
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { PaymentModal } from './components/common/PaymentModal';
import { ReportModal } from './components/common/ReportModal';

// Pages
import { HomePage } from './components/pages/HomePage';
import { ProductsCatalogPage } from './components/pages/ProductsCatalogPage';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { SellerProfilePage } from './components/pages/SellerProfilePage';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { ForgotPasswordPage } from './components/pages/ForgotPasswordPage';
import { MyProfilePage } from './components/pages/MyProfilePage';
import { MyListingsPage } from './components/pages/MyListingsPage';
import { PostItemPage } from './components/pages/PostItemPage';
import { EditListingPage } from './components/pages/EditListingPage';
import { WishlistPage } from './components/pages/WishlistPage';
import { ChatPage } from './components/pages/ChatPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { OrdersPage } from './components/pages/OrdersPage';
import { SalesPage } from './components/pages/SalesPage';
import { ReviewsPage } from './components/pages/ReviewsPage';
import { HelpPage } from './components/pages/HelpPage';
import { TermsPage } from './components/pages/TermsPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { AdminPanelPage } from './components/pages/AdminPanelPage';

// Toast Banner Component
const GlobalToast: React.FC = () => {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
      <div className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 ${
        toast.type === 'error' 
          ? 'bg-rose-600 text-white border-rose-700' 
          : toast.type === 'info'
          ? 'bg-neutral-900 text-white border-neutral-800'
          : 'bg-emerald-700 text-white border-emerald-800'
      }`}>
        <span>{toast.type === 'error' ? '⚠️' : '✓'}</span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

// Main Routing View
const AppContent: React.FC = () => {
  const { activePage } = useApp();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsCatalogPage />;
      case 'product-details':
        return <ProductDetailPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'seller-profile':
        return <SellerProfilePage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'my-profile':
        return <MyProfilePage />;
      case 'my-listings':
        return <MyListingsPage />;
      case 'post-item':
        return <PostItemPage />;
      case 'edit-listing':
        return <EditListingPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'chat':
        return <ChatPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'sales':
        return <SalesPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'help':
        return <HelpPage />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'admin':
        return <AdminPanelPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/60 text-neutral-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
      <PaymentModal />
      <ReportModal />
      <GlobalToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
