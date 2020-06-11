import React, { createContext, useCallback, useState, useContext } from 'react';

import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthState {
  token: string;
  user: object;
}
interface AuthContextProps {
  signIn(credentials: SignInCredentials): void;
  signOut(): void;
  user: object;
}

const authContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoStack:Token');
    const user = localStorage.getItem('@GoStack:User');

    if (user && token) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', { email, password });
    const { user, token } = response.data;

    localStorage.setItem('@GoStack:Token', token);
    localStorage.setItem('@GoStack:User', JSON.stringify(user));

    setData({ user, token });
  }, []);
  const signOut = useCallback(() => {
    localStorage.removeItem('@GoStack:Token');
    localStorage.removeItem('@GoStack:User');
    setData({} as AuthState);
  }, []);

  return (
    <authContext.Provider value={{ signIn, signOut, user: data.user }}>
      {children}
    </authContext.Provider>
  );
};

export function useAuth() {
  const context: AuthContextProps = useContext(authContext);
  if (!context) {
    throw new Error('useAuth must be used within am AuthProvider');
  }
  return context;
}
