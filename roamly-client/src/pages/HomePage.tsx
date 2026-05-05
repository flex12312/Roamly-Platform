import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { propertiesApi } from '../api/properties'
import PropertyCard from '../components/property/PropertyCard'
import SearchBar from '../components/ui/SearchBar'
import {
  MapPin, Shield, Zap, Heart, Sparkles, Mountain,
  Palmtree, Building, Waves, TreePine, Castle,
} from 'lucide-react'

const CATEGORIES = [
  { icon: Sparkles, label: 'Все', type: '' },
  { icon: Building, label: 'Квартиры', type: '0' },
  { icon: TreePine, label: 'Дома', type: '1' },
  { icon: Castle, label: 'Виллы', type: '2' },
  { icon: Mountain, label: 'Хостелы', type: '3' },
  { icon: Waves, label: 'Отели', type: '4' },
] as const

const MOODS = [
  {
    emoji: '🌴',
    title: 'Отдых',
    subtitle: 'Расслабиться и забыть обо всём',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    type: '2',
  },
  {
    emoji: '🏙️',
    title: 'Город',
    subtitle: 'Исследовать улицы и культуру',
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50',
    type: '0',
  },
  {
    emoji: '🏡',
    title: 'Уют',
    subtitle: 'Домашняя атмосфера вдали от дома',
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    type: '1',
  },
  {
    emoji: '✨',
    title: 'Люкс',
    subtitle: 'Премиальные варианты',
    gradient: 'from-purple-400 to-pink-500',
    bg: 'bg-purple-50',
    type: '4',
  },
] as const

export default function HomePage() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['search-featured'],
    queryFn: () => propertiesApi.search({ pageSize: 8, pageNumber: 1 }),
  })

  const properties = data?.data.properties ?? []

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-brand-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <Palmtree className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-medium text-brand-600">Откройте мир путешествий</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
              Найдите идеальное{' '}
              <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
                жильё
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Уникальные места для проживания по всему миру.
              От уютных квартир до роскошных вилл.
            </p>
            <div className="max-w-3xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Travel Mood Selector — "Twist" Feature */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Какое у вас настроение?
            </h2>
            <p className="text-gray-500">Выберите стиль путешествия, а мы подберём варианты</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {MOODS.map((mood) => (
              <button
                key={mood.title}
                onClick={() => navigate(`/search?propertyType=${mood.type}`)}
                className={`group relative ${mood.bg} rounded-2xl p-6 sm:p-8 text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-gray-200 overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <span className="text-4xl sm:text-5xl block mb-4">{mood.emoji}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{mood.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{mood.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="py-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.label}
                  onClick={() =>
                    navigate(cat.type ? `/search?propertyType=${cat.type}` : '/search')
                  }
                  className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 hover:border-brand-500 hover:text-brand-500 text-gray-500 transition-all shrink-0 min-w-[80px] hover:shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium whitespace-nowrap">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: 'Локации по всему миру',
                desc: 'Тысячи вариантов жилья в самых популярных направлениях',
                color: 'text-brand-500 bg-brand-50',
              },
              {
                icon: Shield,
                title: 'Безопасные бронирования',
                desc: 'Защищённые платежи и проверенные хосты',
                color: 'text-emerald-500 bg-emerald-50',
              },
              {
                icon: Zap,
                title: 'Мгновенное подтверждение',
                desc: 'Получайте подтверждение бронирования за секунды',
                color: 'text-amber-500 bg-amber-50',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-5`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Популярные варианты
              </h2>
              <p className="text-gray-500 mt-1">Лучшие предложения прямо сейчас</p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              Смотреть все →
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-3" />
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded-lg w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-600">Пока нет доступных объектов</p>
              <p className="text-sm text-gray-400 mt-1">Объекты появятся здесь после публикации</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Готовы сдавать своё жильё?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам хостов и начните зарабатывать на своей недвижимости
          </p>
          <button
            onClick={() => navigate('/host/create')}
            className="bg-white text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-2xl"
          >
            Начать сдавать
          </button>
        </div>
      </section>
    </div>
  )
}
