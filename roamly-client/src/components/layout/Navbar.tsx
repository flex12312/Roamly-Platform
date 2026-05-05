import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut, Home, PlusCircle, CalendarCheck, Heart, Search, Globe } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../context/FavoritesContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count: favCount } = useFavorites()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setProfileOpen(false)
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              Roamly
            </span>
          </Link>

          {/* Center nav links */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center bg-gray-100/80 rounded-full px-1 py-1">
              <Link
                to="/search"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  location.pathname === '/search'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Search className="w-4 h-4" />
                Поиск
              </Link>
              <Link
                to="/favorites"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all relative ${
                  location.pathname === '/favorites'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${favCount > 0 ? 'fill-brand-500 text-brand-500' : ''}`} />
                Избранное
                {favCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favCount > 9 ? '9+' : favCount}
                  </span>
                )}
              </Link>
              {user && (
                <Link
                  to="/host/properties"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    location.pathname.startsWith('/host')
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Сдать жильё
                </Link>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 border border-gray-300 rounded-full py-1.5 px-3 hover:shadow-md transition-all bg-white"
                >
                  <Menu className="w-4 h-4 text-gray-500" />
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-scale-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/my-bookings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <CalendarCheck className="w-4 h-4 text-gray-400" /> Мои бронирования
                        </Link>
                        <Link
                          to="/host/properties"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-gray-400" /> Мои объекты
                        </Link>
                        <Link
                          to="/favorites"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-gray-400" /> Избранное
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-gray-400" /> Выйти
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-full transition-all shadow-md shadow-brand-500/25 hover:shadow-brand-500/40"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4 space-y-1 animate-slide-up">
            <Link
              to="/search"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              <Search className="w-4 h-4 text-gray-400" /> Поиск жилья
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              <Heart className="w-4 h-4 text-gray-400" /> Избранное
              {favCount > 0 && (
                <span className="ml-auto w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
                >
                  <CalendarCheck className="w-4 h-4 text-gray-400" /> Мои бронирования
                </Link>
                <Link
                  to="/host/properties"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
                >
                  <Globe className="w-4 h-4 text-gray-400" /> Сдать жильё
                </Link>
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false) }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    <LogOut className="w-4 h-4 text-gray-400" /> Выйти
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2 pt-3 px-4">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
