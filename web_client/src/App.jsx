import { BrowserRouter } from 'react-router-dom';

import AppRouter from './app/router';
import { AuthProvider } from './app/providers/AuthProvider';
import './app/app-shell.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
