import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Role {
  role: 'ADMIN' | 'MEMBER';
  id_horta: number;
  horta_nome: string;
  latitude: number | null;
  longitude: number | null;
  endereco: string | null;
}

interface User {
  id: number;
  nome: string;
  email: string;
  id_perfil: number;
  roles: Role[];
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  
  login: (email: string, senha: string) => Promise<void>;
  // 1. Na interface AuthContextType (linha ~27-29):
register: (
  nome: string,
  email: string,
  senha: string,
  opts: {
    id_horta?: number;
    nome_nova_horta?: string;
    latitude?: number;
    longitude?: number;
    endereco?: string;
  }
) => Promise<void>;
  
  updateUser: (dados: { nome?: string; email?: string }) => Promise<void>;
  logout: () => void;
  
  updatePassword: (
  senhaAtual: string,
  novaSenha: string
) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.roles.some(r => r.role === 'ADMIN') ?? false;

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:8080/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      const userData = await res.json();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

    const register = async (
      nome: string,
      email: string,
      senha: string,
      opts: {
        id_horta?: number;
        nome_nova_horta?: string;
        latitude?: number;
        longitude?: number;
        endereco?: string;
      }
    ) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, ...opts })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Registro falhou');
      }
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (dados: { nome?: string; email?: string }) => {
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const res = await fetch('http://localhost:8080/auth/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || 'Erro ao atualizar usuário');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
  };

const updatePassword = async (
  senhaAtual: string,
  novaSenha: string
) => {
  const response = await fetch('http://localhost:8080/auth/password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    senhaAtual,
    novaSenha,
  }),
});

const text = await response.text();

console.log('Status:', response.status);
console.log('Resposta:', text);

let data;

try {
  data = JSON.parse(text);
} catch {
  throw new Error(
    `O servidor retornou uma resposta inválida: ${text.slice(0, 150)}`
  );
}

if (!response.ok) {
  throw new Error(data.error || 'Erro ao alterar senha');
}
};

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
        <AuthContext.Provider value={{token,user,isAdmin,isLoading,login,logout,register,updateUser,updatePassword,}}
>
        {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
