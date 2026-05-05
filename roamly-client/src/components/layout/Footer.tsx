import { Home, Instagram, Send, Github } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">Roamly</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Платформа для аренды жилья по всему миру. Находите уникальные места и создавайте незабываемые впечатления.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Навигация</h3>
            <div className="space-y-3">
              <Link to="/search" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Поиск жилья
              </Link>
              <Link to="/favorites" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Избранное
              </Link>
              <Link to="/host/properties" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Сдать жильё
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Путешественникам</h3>
            <div className="space-y-3">
              <Link to="/search?propertyType=0" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Квартиры
              </Link>
              <Link to="/search?propertyType=1" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Дома
              </Link>
              <Link to="/search?propertyType=2" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Виллы
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Поддержка</h3>
            <div className="space-y-3">
              <span className="block text-sm text-gray-400">help@roamly.com</span>
              <span className="block text-sm text-gray-400">+7 (800) 123-45-67</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Roamly. Все права защищены.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Конфиденциальность</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Условия</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
