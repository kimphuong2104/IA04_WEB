import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'

function Avatar({ name }: { name?: string }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?'
  return (
    <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
      {initial}
    </div>
  )
}

export default function Dashboard() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({ queryKey: ['me'], queryFn: () => api.me().then((r) => r.data), retry: false })

  const logoutMutation = useMutation({ mutationFn: () => api.logout(), onSuccess: () => {
    qc.clear()
    navigate('/login')
  }})

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="loader">Loading...</div>
    </div>
  )

  if (isError) return (
    <div className="p-8">Unable to load user information. <Link to="/login" className="text-indigo-600">Login again</Link></div>
  )

  const user = data
  const createdAt = user?.createdAt ? new Date(user.createdAt).toLocaleString() : '—'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => logoutMutation.mutate()} className="px-4 py-2 bg-red-600 text-white rounded shadow">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <Avatar name={user?.email} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.email}</h2>
                <p className="text-sm text-gray-500">Member since {createdAt}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-gray-500">Account</h3>
              <dl className="mt-2 text-sm text-gray-700">
                <div className="mt-2 flex justify-between">
                  <dt>Email</dt>
                  <dd className="text-gray-900">{user?.email}</dd>
                </div>
                <div className="mt-2 flex justify-between">
                  <dt>Status</dt>
                  <dd className="text-green-600">Active</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Activity</h3>
              <p className="mt-2 text-sm text-gray-600">Recent protected data fetches and activity will appear here.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Requests</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">124</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Errors</p>
                  <p className="mt-1 text-2xl font-semibold text-red-600">2</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Refreshes</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">3</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Raw user data</h3>
              <pre className="mt-2 bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
