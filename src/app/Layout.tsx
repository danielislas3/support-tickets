import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center px-1 pt-4 pb-4 border-b-2 text-sm font-medium ${
      isActive
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`

  return (
    <div className="min-h-screen bg-gray-50">
    
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Sistema de Tickets de Ayuda
          </h1>
        </div>
      </header>

      
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <NavLink to="/" end className={navLinkClass}>
              Reportar Problema
            </NavLink>
            <NavLink to="/mis-reportes" className={navLinkClass}>
              Mis Reportes
            </NavLink>
          </div>
        </div>
      </nav>

 
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
