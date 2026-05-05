import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { propertiesApi } from '../api/properties'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react'
import { PropertyTypeLabels } from '../types'
import toast from 'react-hot-toast'

export default function HostPropertiesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [authLoading, user, navigate])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-properties'],
    queryFn: () => propertiesApi.getAll(),
    enabled: !!user,
  })

  if (authLoading || !user) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-28" />
          ))}
        </div>
      </div>
    )
  }

  const properties = (data?.data ?? []).filter((p) => p.ownerId === user.id)

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот объект?')) return
    try {
      await propertiesApi.delete(id)
      toast.success('Объект удалён')
      refetch()
    } catch {
      toast.error('Ошибка удаления')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Мои объекты</h1>
          <p className="text-gray-500 mt-1">Управляйте своей недвижимостью</p>
        </div>
        <Link
          to="/host/create"
          className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-brand-500/25 text-sm"
        >
          <PlusCircle className="w-4 h-4" /> Добавить
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-28" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-lg font-medium text-gray-600 mb-2">У вас пока нет объектов</p>
          <p className="text-sm text-gray-400 mb-6">Добавьте своё первое жильё и начните принимать гостей</p>
          <Link
            to="/host/create"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-semibold hover:from-brand-600 hover:to-brand-700 transition-all shadow-md shadow-brand-500/25 text-sm"
          >
            <PlusCircle className="w-4 h-4" /> Создать первый объект
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-5 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <img
                  src={
                    p.photos.find((ph) => ph.isMain)?.imageUrl ||
                    p.photos[0]?.imageUrl ||
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&auto=format&fit=crop&q=60'
                  }
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate text-base">{p.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {PropertyTypeLabels[p.type]} · <span className="font-semibold text-gray-700">₽{p.pricePerNight.toLocaleString()}</span> / ночь
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      p.isPublished
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}
                  >
                    {p.isPublished ? 'Опубликовано' : 'Черновик'}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      p.isAvailable
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {p.isAvailable ? 'Доступно' : 'Недоступно'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={`/property/${p.id}`}
                  className="p-2.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-xl transition-all"
                  title="Просмотреть"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  to={`/host/edit/${p.id}`}
                  className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                  title="Редактировать"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
