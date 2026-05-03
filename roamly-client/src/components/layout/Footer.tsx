import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-rose-500">Roamly</span>
            </div>
            <p className="text-sm text-gray-500">
              Платформа для аренды жилья по всему миру.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Навигация</h3>
            <div className="space-y-2">
              <Link to="/search" className="block text-sm text-gray-500 hover:text-gray-700">Поиск жилья</Link>
              <Link to="/host/properties" className="block text-sm text-gray-500 hover:text-gray-700">Сдать жильё</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Поддержка</h3>
            <div className="space-y-2">
              <span className="block text-sm text-gray-500">help@roamly.com</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Roamly. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
