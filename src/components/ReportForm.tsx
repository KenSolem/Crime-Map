import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useReportStore } from '../store/reportStore';
import { useAuthStore } from '../store/authStore';
import { CrimeType } from '../types';

const reportSchema = z.object({
  title: z.string().min(5, 'Título debe tener al menos 5 caracteres'),
  crimeType: z.enum([
    'ROBBERY',
    'DOMESTIC_VIOLENCE',
    'FIGHT',
    'HOMICIDE',
    'SEXUAL_ABUSE',
    'THREATS',
    'THEFT',
    'DRUGS',
    'ALCOHOL',
    'NOISE',
    'OTHER',
  ]),
  description: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
  address: z.string().min(5, 'Dirección es requerida'),
  phone: z.string().min(8, 'Teléfono debe tener al menos 8 dígitos'),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface ReportFormProps {
  location: [number, number];
  onClose: () => void;
}

export default function ReportForm({ location, onClose }: ReportFormProps) {
  const { addReport } = useReportStore();
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = (data: ReportFormData) => {
    if (!user) return;

    const report = {
      id: crypto.randomUUID(),
      ...data,
      location: { lat: location[0], lng: location[1] },
      status: 'ACTIVE',
      createdAt: new Date(),
      createdBy: user.id,
    };

    addReport(report);
    onClose();
  };

  const crimeTypes: { value: CrimeType; label: string }[] = [
    { value: 'ROBBERY', label: 'Robo' },
    { value: 'DOMESTIC_VIOLENCE', label: 'Violencia Intrafamiliar' },
    { value: 'FIGHT', label: 'Riña' },
    { value: 'HOMICIDE', label: 'Homicidio' },
    { value: 'SEXUAL_ABUSE', label: 'Abuso Sexual' },
    { value: 'THREATS', label: 'Amenazas' },
    { value: 'THEFT', label: 'Hurto' },
    { value: 'DRUGS', label: 'Droga' },
    { value: 'ALCOHOL', label: 'Infracción Ley de Alcoholes' },
    { value: 'NOISE', label: 'Ruidos Molestos' },
    { value: 'OTHER', label: 'Otro' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Nueva Denuncia</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Título de la denuncia
            </label>
            <input
              {...register('title')}
              className="w-full border rounded-lg p-2"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de denuncia
            </label>
            <select
              {...register('crimeType')}
              className="w-full border rounded-lg p-2"
            >
              {crimeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              {...register('description')}
              className="w-full border rounded-lg p-2"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input
              {...register('address')}
              className="w-full border rounded-lg p-2"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              {...register('phone')}
              className="w-full border rounded-lg p-2"
              type="tel"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Enviar Denuncia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}