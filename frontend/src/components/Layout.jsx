import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['Admin', 'Inventory Manager'] },
    { path: '/resources', label: 'Resources', roles: ['Admin', 'Inventory Manager', 'Staff'] },
    { path: '/maintenance', label: 'Maintenance', roles: ['Admin', 'Inventory Manager', 'Staff'] },
    { path: '/users', label: 'User Management', roles: ['Admin'] },
  ].filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#428bca] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://www.eesarchitects.net/wp-content/uploads/2024/07/cropped-Screenshot-2024-07-22-150353.png" 
                alt="Ambo University Logo" 
                className="h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hidden">
                <span className="text-[#428bca] text-lg font-bold">AU</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">ResourceMaster</h1>
                <span className="text-sm opacity-90">Ambo University</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm opacity-90">Welcome,</div>
                <div className="font-semibold">{user?.name}</div>
              </div>
              <span className="px-3 py-1 bg-secondary text-[#428bca] rounded-full text-xs font-bold">
                {user?.role}
              </span>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-[#357abd] hover:bg-[#5ba0d4] rounded-lg transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-6 py-4 font-semibold transition ${
                  isActive(item.path)
                    ? 'text-[#428bca] border-b-3 border-[#428bca] bg-[#428bca]/5'
                    : 'text-gray-600 hover:text-[#428bca] hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Ambo University - ResourceMaster System</p>
          <p className="text-gray-400 mt-2">Version 2.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
