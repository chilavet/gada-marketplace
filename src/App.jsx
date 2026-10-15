import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import VendorPage from './components/VendorPage';
import ItemModal from './components/ItemModal';
import MarketRunPage from './components/MarketRunPage';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TrackOrderPage from './components/TrackOrderPage';
import UserProfilePage from './components/UserProfilePage';
import AuthModal from './components/AuthModal';
import LocationModal from './components/LocationModal';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import CookieSettingsModal from './components/CookieSettingsModal';
import PartnerRegistrationModal from './components/PartnerRegistrationModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import CartPage from './components/CartPage';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { locationService } from './services/locationService';
import { orderApi, vendorApi, catalogApi } from './api';
import { VENDORS, POPULAR_ITEMS } from './data/marketplaceData';

export default function App() {
  const { currentUser, logout, updateProfile } = useAuth();
  const { cartItems, cartCount, addToCart, clearCart } = useCart();

  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalDoc, setLegalModalDoc] = useState('terms');
  const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerModalTab, setPartnerModalTab] = useState('vendor');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Orders State
  const [currentOrder, setCurrentOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Location State
  const [currentLocation, setCurrentLocation] = useState(() => locationService.getCurrentLocation());

  // Auto GPS Location
  useEffect(() => {
    if (!locationService.hasAutoRequestedGPS()) {
      locationService.detectGPSLocation()
        .then((detected) => {
          setCurrentLocation(detected);
        })
        .catch(() => {
          locationService.setAutoRequestedGPS();
        });
    }
  }, []);

  // Sync URL hash routing (e.g. #store-v1, #orders-GADA-8291)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('store-')) {
        const slug = hash.replace('store-', '');
        const found = VENDORS.find(v => v.id === slug || v.slug === slug);
        if (found) {
          setSelectedVendor(found);
          setActiveTab('vendor');
          document.title = `${found.name} | Gada Marketplace`;
        }
      } else if (hash.startsWith('orders-')) {
        const orderId = hash.replace('orders-', '');
        orderApi.getOrderById(orderId).then(ord => {
          if (ord) {
            setCurrentOrder(ord);
            setActiveTab('track-order');
            document.title = `Track Order #${orderId} | Gada Marketplace`;
          }
        });
      } else if (hash === 'market-run') {
        setActiveTab('market-run');
        document.title = 'Market Run Errand Service | Gada Marketplace';
      } else if (hash === 'profile') {
        setActiveTab('profile');
      } else if (hash === 'cart') {
        setActiveTab('cart');
        document.title = 'Shopping Cart | Gada Marketplace';
      } else {
        document.title = 'Gada Marketplace - Hyperlocal Food & Grocery Network';
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSelectLocation = (loc, message) => {
    setCurrentLocation(loc);
    locationService.setCurrentLocation(loc);
    showToast(message || `Location set to ${loc.name}. Items re-sorted! 📍`);
  };

  const handleOpenAuth = (mode = 'login', message = '') => {
    setAuthMode(mode);
    setAuthPromptMessage(message);
    setIsAuthModalOpen(true);
  };

  const handleOpenLegal = (doc = 'terms') => {
    setLegalModalDoc(doc);
    setIsLegalModalOpen(true);
  };

  const handleOpenPartner = (tab = 'vendor') => {
    setPartnerModalTab(tab);
    setIsPartnerModalOpen(true);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    if (!currentUser) {
      handleOpenAuth('register', 'Please create an account or sign in to complete checkout.');
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleConfirmOrder = async (orderDetails) => {
    try {
      const createdOrder = await orderApi.createOrder({
        customerName: orderDetails.customerName,
        customerPhone: orderDetails.customerPhone,
        items: cartItems,
        vendorGroups: orderDetails.vendorGroups,
        total: orderDetails.totalPaid,
        address: orderDetails.address,
        deliveryNotes: orderDetails.deliveryNotes,
        paymentMethod: orderDetails.paymentMethod,
        paymentReference: orderDetails.paymentReference,
        riderTip: orderDetails.riderTip,
        storeName: cartItems[0]?.vendor || 'Bodija Market Hub',
        storeLocation: cartItems[0]?.locationName || 'Bodija Central Hub'
      });

      setConfirmedOrder(createdOrder);
      setCurrentOrder(createdOrder);
      clearCart();
      setIsCheckoutOpen(false);
      setIsConfirmationOpen(true);
      showToast(`Order #${createdOrder.id} confirmed and dispatched! 🚀`);
    } catch (err) {
      alert('Order creation failed: ' + err.message);
    }
  };

  return (
    <div className="app-viewport" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'home') {
            setSelectedVendor(null);
            window.location.hash = '';
          }
        }}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={() => {
          logout();
          showToast('Signed out successfully.');
          if (activeTab === 'profile') setActiveTab('home');
        }}
        currentLocation={currentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0F172A',
            color: '#FFF',
            padding: '14px 22px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '700',
            boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Routed Views */}
      {activeTab === 'home' && !selectedVendor && (
        <HomePage
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onSelectItem={(item) => setSelectedItem(item)}
          onSelectVendor={(vendor) => {
            setSelectedVendor(vendor);
            setActiveTab('vendor');
            window.location.hash = `store-${vendor.slug || vendor.id}`;
          }}
          onNavigateToMarketRun={() => {
            setActiveTab('market-run');
            window.location.hash = 'market-run';
          }}
          onAddToCart={(item) => {
            addToCart(item);
            showToast(`Added "${item.name}" to basket! 🛒`);
          }}
          currentLocation={currentLocation}
          onSelectLocation={handleSelectLocation}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />
      )}

      {activeTab === 'vendor' && selectedVendor && (
        <VendorPage
          vendor={selectedVendor}
          onBack={() => {
            setSelectedVendor(null);
            setActiveTab('home');
            window.location.hash = '';
          }}
          onSelectItem={(item) => setSelectedItem(item)}
          onAddToCart={(item) => {
            addToCart(item);
            showToast(`Added "${item.name}" to basket! 🛒`);
          }}
          cartItems={cartItems}
        />
      )}

      {activeTab === 'market-run' && (
        <MarketRunPage
          onBack={() => {
            setActiveTab('home');
            window.location.hash = '';
          }}
          onSubmitMarketRun={() => {
            if (!currentUser) {
              handleOpenAuth('register', 'Please sign in or register to dispatch your Market Run errand request.');
            } else {
              showToast('Market Run Request Dispatched to Bodija Market Agent! 🛍️');
            }
          }}
        />
      )}

      {activeTab === 'track-order' && (
        <TrackOrderPage
          order={currentOrder}
          onBack={() => {
            setActiveTab('home');
            window.location.hash = '';
          }}
        />
      )}

      {activeTab === 'profile' && (
        <UserProfilePage
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={() => {
            logout();
            showToast('Signed out successfully.');
            setActiveTab('home');
          }}
          onUpdateUser={updateProfile}
          onTrackOrder={(order) => {
            setCurrentOrder(order);
            setActiveTab('track-order');
            window.location.hash = `orders-${order.id}`;
          }}
        />
      )}

      {activeTab === 'cart' && (
        <CartPage />
      )}

      {/* Footer */}
      <Footer
        onOpenLegal={handleOpenLegal}
        onOpenCookieSettings={() => setIsCookieSettingsOpen(true)}
        onOpenPartnerRegistration={handleOpenPartner}
        onNavigateToMarketRun={() => {
          setActiveTab('market-run');
          window.location.hash = 'market-run';
        }}
      />

      {/* Product Detail Page (PDP) Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(item) => {
            addToCart(item);
            showToast(`Added "${item.name}" to cart! 🛒`);
          }}
          currentLocation={currentLocation}
          onSelectVendor={(vendor) => {
            setSelectedVendor(vendor);
            setActiveTab('vendor');
            window.location.hash = `store-${vendor.slug || vendor.id}`;
          }}
          onSelectItem={(item) => setSelectedItem(item)}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Multi-Vendor Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOpenAuth={handleOpenAuth}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        order={confirmedOrder}
        onTrackOrder={(order) => {
          setIsConfirmationOpen(false);
          setActiveTab('track-order');
          window.location.hash = `orders-${order.id}`;
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        message={authPromptMessage}
      />

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* Legal & Compliance Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialDocument={legalModalDoc}
      />

      {/* Cookie Preferences Modal */}
      <CookieSettingsModal
        isOpen={isCookieSettingsOpen}
        onClose={() => setIsCookieSettingsOpen(false)}
        onSave={() => showToast('Cookie preferences saved! 🍪')}
      />

      {/* Partner Registration Modal (Vendors & Agents) */}
      <PartnerRegistrationModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        initialTab={partnerModalTab}
        onSuccess={(msg) => showToast(msg)}
      />
    </div>
  );
}
