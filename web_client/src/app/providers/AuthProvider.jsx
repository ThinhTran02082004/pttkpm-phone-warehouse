import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getCurrentUser, login as loginRequest } from '../../api/auth';

const TOKEN_STORAGE_KEY = 'pttkpm_access_token';
const AuthContext = createContext(null);

function readStoredToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken());
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() => (readStoredToken() ? 'checking' : 'guest'));

  useEffect(() => {
    let ignore = false;

    async function hydrateUser() {
      if (!token) {
        setStatus('guest');
        setUser(null);
        return;
      }

      setStatus('checking');

      try {
        const currentUser = await getCurrentUser(token);
        if (!ignore) {
          setUser(currentUser);
          setStatus('authenticated');
        }
      } catch (error) {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        if (!ignore) {
          setToken(null);
          setUser(null);
          setStatus('guest');
        }
      }
    }

    hydrateUser();

    return () => {
      ignore = true;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      status,
      isAuthenticated: status === 'authenticated',
      async signIn(credentials) {
        const response = await loginRequest(credentials);
        window.localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
        setToken(response.token);
        const currentUser = await getCurrentUser(response.token);
        setUser(currentUser);
        setStatus('authenticated');
        return currentUser;
      },
      signOut() {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
        setStatus('guest');
      },
    }),
    [status, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
