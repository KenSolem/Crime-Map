import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useReportStore } from '../store/reportStore';
import { useAuthStore } from '../store/authStore';
import AdminDashboard from './admin/AdminDashboard';

export default function ReportList() {
  const { reports } = useReportStore();
  const { user } = useAuthStore();
  
  // If user is admin, show admin dashboard instead
  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  const activeReports = reports.filter((report) => report.status === 'ACTIVE');
  const canSeePersonalInfo = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Denuncias Activas</h2>
      <div className="space-y-4">
        {activeReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <h3 className="font-bold text-lg">{report.title}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {format(report.createdAt, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Tipo:</span>{' '}
              {report.crimeType.replace('_', ' ')}
            </p>
            <p className="mb-2">{report.description}</p>
            <p className="text-sm">
              <span className="font-semibold">Dirección:</span> {report.address}
            </p>
            {canSeePersonalInfo && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm">
                  <span className="font-semibold">Teléfono:</span> {report.phone}
                </p>
              </div>
            )}
            {user?.role === 'MODERATOR' && (
              <button
                onClick={() => {
                  const closureReport = prompt(
                    'Por favor, ingrese el informe de cierre:'
                  );
                  if (closureReport) {
                    useReportStore
                      .getState()
                      .closeReport(report.id, closureReport);
                  }
                }}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cerrar Denuncia
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}