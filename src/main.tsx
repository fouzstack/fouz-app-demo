import React, { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { routes } from './pages/index';

// Componente de página de error cargado de forma lazy
const ErrorPage = lazy(() => import('./pages/error-page.tsx'));
// Componente Spinner para mostrar mientras se carga
//import Spinner from './components/spinner/Spinner.tsx';
import MainSpinner from './components/global-spinner/MainSpinner.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      {/* Suspense envuelve todo el router para manejar la carga de componentes lazy */}
      <Suspense fallback={<MainSpinner />}>
        <HashRouter>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
                errorElement={route.errorElement} // Opcionalmente mantener errorElement si lo usa tu router
              />
            ))}
            {/* Ruta global para cualquier path no existente */}
            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </HashRouter>
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>,
);
