import { create } from 'zustand';
import { User } from '../types';
import { LoginData, RegisterData } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUserRole: (userId: string, role: 'USER' | 'MODERATOR') => void;
  getAllUsers: () => User[];
}

// Simulated users database with admin user
const users: User[] = [
  {
    id: 'admin-1',
    email: 'administrador@SOS.cl',
    name: 'Administrador',
    role: 'ADMIN',
    reports: [],
  },
];

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: async (data) => {
    const user = users.find((u) => u.email === data.email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    // In a real app, we would verify the password here
    // For the admin account, we'll check the specific password
    if (user.email === 'administrador@SOS.cl' && data.password !== 'Otaku21513656') {
      throw new Error('Contraseña incorrecta');
    }
    set({ user, isAuthenticated: true });
  },
  register: async (data) => {
    if (users.some((u) => u.email === data.email)) {
      throw new Error('El email ya está registrado');
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      role: 'USER',
      reports: [],
    };
    users.push(newUser);
    set({ user: newUser, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUserRole: (userId, role) => {
    const currentUser = get().user;
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('No tienes permisos para realizar esta acción');
    }
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], role };
    }
  },
  getAllUsers: () => {
    const currentUser = get().user;
    if (currentUser?.role !== 'ADMIN') {
      throw new Error('No tienes permisos para realizar esta acción');
    }
    return users;
  },
}));