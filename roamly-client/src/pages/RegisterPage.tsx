import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Home } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }
    setLoading(true)
    try {
      await authApi.register(form)
      toast.success('Регистрация успешна! Войдите в аккаунт.')
      navigate('/login')
    } catch {
      toast.error('Ошибка регистрации. Попробуйте другой email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-500 via-brand-500 to-brand-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-32 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-brand-300/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Home className="w-7 h-7" />
            </div>
            <span className="text-3xl font-extrabold">Roamly</span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Присоединяйтесь<br />к Roamly
          </h2>
          <p className="text-lg text-white/70 leading-relaxed max-w-md">
            Создайте аккаунт и откройте доступ к тысячам уникальных вариантов жилья.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
            <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-brand-500">Roamly</span>
            </div>

            <h1 className="text-2xl font-extrabold text-center mb-1">Регистрация</h1>
            <p className="text-sm text-gray-500 text-center mb-8">
              Создайте аккаунт в Roamly
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Имя</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                    placeholder="Иван"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Фамилия</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                    placeholder="Иванов"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Дата рождения</label>
                <input
                  type="date"
                  required
                  value={form.birthDate}
                  onChange={(e) => update('birthDate', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Пароль</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none pr-10 transition-shadow"
                    placeholder="Минимум 6 символов"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Подтвердите пароль
                </label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="Повторите пароль"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-brand-500/25 hover:shadow-brand-500/40"
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="text-brand-500 font-semibold hover:text-brand-600 transition-colors">
                  Войти
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
