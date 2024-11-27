import { BrowserRouter as Router } from 'react-router-dom';
import Map from './components/Map';
import ReportList from './components/ReportList';
import AuthContainer from './components/auth/AuthContainer';
import { useAuthStore } from './store/authStore';
import { LogOut } from 'lucide-react';

function App() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        <div className="flex-1 h-screen">
          <Map />
        </div>
        <div className="w-96 h-screen overflow-y-auto border-l border-gray-200 bg-white">
          {isAuthenticated ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-800"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ReportList />
              </div>
            </div>
          ) : (
            <AuthContainer />
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;