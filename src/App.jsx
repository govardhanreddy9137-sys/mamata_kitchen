import { useState, useEffect } from 'react';
import { BillingProvider } from './context/BillingContext';
import Navigation from './components/Navigation';
import Billing from './components/Billing';
import MenuManagement from './components/MenuManagement';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('authUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('billing');

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveTab('billing');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authUser');
    setCurrentUser(null);
    setActiveTab('billing');
  };

  // Enforce role guard: Cashiers can only access billing
  useEffect(() => {
    if (currentUser?.role === 'cashier' && activeTab !== 'billing') {
      setActiveTab('billing');
    }
  }, [currentUser, activeTab]);

  return (
    <BillingProvider>
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
        {currentUser ? (
          <>
            <Navigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
            <main className="container mx-auto px-4 py-6 max-w-7xl">
              {activeTab === 'billing' && (
                <Billing
                  currentUser={currentUser}
                  onNavigateToAdmin={() => setActiveTab('admin')}
                />
              )}
              {activeTab === 'menu' && currentUser.role === 'admin' && (
                <MenuManagement />
              )}
              {activeTab === 'admin' && currentUser.role === 'admin' && (
                <AdminDashboard />
              )}
            </main>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </BillingProvider>
  );
}

export default App;
