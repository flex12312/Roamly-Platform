import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SearchPage from './pages/SearchPage'
import PropertyPage from './pages/PropertyPage'
import MyBookingsPage from './pages/MyBookingsPage'
import HostPropertiesPage from './pages/HostPropertiesPage'
import CreatePropertyPage from './pages/CreatePropertyPage'
import FavoritesPage from './pages/FavoritesPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/property/:id" element={<PropertyPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/host/properties" element={<HostPropertiesPage />} />
                <Route path="/host/create" element={<CreatePropertyPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '12px',
                background: '#1f2937',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 500,
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              },
            }}
          />
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
