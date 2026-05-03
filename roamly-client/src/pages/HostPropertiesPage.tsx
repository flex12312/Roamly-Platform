import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { propertiesApi } from '../api/properties'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
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
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-24" />
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Мои объекты</h1>
        <Link
          to="/host/create"
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 px-5 rounded-lg transition-colors text-sm"
        >
          <PlusCircle className="w-4 h-4" /> Добавить
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-24" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-600 mb-4">У вас пока нет объектов</p>
          <Link
            to="/host/create"
            className="inline-flex items-center gap-2 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium"
          >
            <PlusCircle className="w-4 h-4" /> Создать первый объект
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <img
                  src={
                    p.photos.find((ph) => ph.isMain)?.imageUrl ||
                    p.photos[0]?.imageUrl ||
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&auto=format&fit=crop&q=60'
                  }
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{p.title}</h3>
                <p className="text-sm text-gray-500">
                  {PropertyTypeLabels[p.type]} · ₽{p.pricePerNight.toLocaleString()} / ночь
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.isPublished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {p.isPublished ? 'Опубликовано' : 'Черновик'}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.isAvailable
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {p.isAvailable ? 'Доступно' : 'Недоступно'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/host/edit/${p.id}`}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
