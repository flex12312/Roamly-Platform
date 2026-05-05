import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface FavoritesContextType {
  favorites: number[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (id: number) => void
  count: number
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

const STORAGE_KEY = 'roamly_favorites'

function loadFavorites(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavorites(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>(loadFavorites)

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites],
  )

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id]
      saveFavorites(next)
      return next
    })
  }, [])

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, count: favorites.length }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
