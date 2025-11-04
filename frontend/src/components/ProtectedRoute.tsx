import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.me().then((r) => r.data),
    retry: false,
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <div>Loading...</div>
  if (isError || !data) return <Navigate to="/login" replace />

  return <>{children}</>
}
