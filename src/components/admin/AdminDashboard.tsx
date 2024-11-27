import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuthStore } from '../../store/authStore';
import { useReportStore } from '../../store/reportStore';
import { User } from '../../types';

export default function AdminDashboard() {
  const { getAllUsers, updateUserRole } = useAuthStore();
  const { reports } = useReportStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users = getAllUsers();

  const handleRoleChange = (userId: string, newRole: 'USER' | 'MODERATOR') => {
    try {
      updateUserRole(userId, newRole);
      // Force re-render
      setSelectedUser(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al actualizar rol');
    }
  };

  const userReports = selectedUser
    ? reports.filter((report) => report.createdBy === selectedUser.id)
    : reports;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Usuarios Registrados</h3>
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">Rol: {user.role}</p>
                </div>
                {user.role !== 'ADMIN' && (
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(
                        user.id,
                        e.target.value as 'USER' | 'MODERATOR'
                      )
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="border rounded-lg p-1"
                  >
                    <option value="USER">Usuario</option>
                    <option value="MODERATOR">Moderador</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">
          {selectedUser
            ? `Denuncias de ${selectedUser.name}`
            : 'Todas las Denuncias'}
        </h3>
        <div className="space-y-3">
          {userReports.map((report) => (
            <div key={report.id} className="p-3 border rounded-lg">
              <div className="flex justify-between">
                <h4 className="font-medium">{report.title}</h4>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    report.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {report.status === 'ACTIVE' ? 'Activa' : 'Cerrada'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Creada:{' '}
                {format(report.createdAt, "d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
              </p>
              {report.status === 'CLOSED' && report.closedAt && (
                <p className="text-sm text-gray-600">
                  Cerrada:{' '}
                  {format(report.closedAt, "d 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                  <br />
                  Informe: {report.closureReport}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}