import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/shared/PrivateRoute';
import MainLayout from './components/shared/MainLayout';
import DashboardLayout from './components/shared/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';           // ← Corrected
import AllPetsPage from './pages/AllPetsPage';
import PetDetailPage from './pages/PetDetailPage';
import PetCarePage from './pages/PetCarePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboard pages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import AddPetPage from './pages/dashboard/AddPetPage';
import MyListingsPage from './pages/dashboard/MyListingsPage';
import EditPetPage from './pages/dashboard/EditPetPage';
import MyRequestsPage from './pages/MyRequestsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1208',
              color: '#FFF8F0',
              borderRadius: '12px',
              padding: '14px 18px',
              fontSize: '14px',
              fontFamily: "'DM Sans', sans-serif",
            },
            success: { iconTheme: { primary: '#2A7E4F', secondary: '#fff' } },
            error: { iconTheme: { primary: '#E53E3E', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* Main layout routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />           {/* ← Corrected */}
            <Route path="/pets" element={<AllPetsPage />} />
            <Route path="/pets/:id" element={<PrivateRoute><PetDetailPage /></PrivateRoute>} />
            <Route path="/pet-care" element={<PetCarePage />} />
            <Route path="/my-requests" element={<PrivateRoute><MyRequestsPage /></PrivateRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Dashboard layout routes */}
          <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/dashboard/add-pet" element={<AddPetPage />} />
            <Route path="/dashboard/my-listings" element={<MyListingsPage />} />
            <Route path="/dashboard/edit-pet/:id" element={<EditPetPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;