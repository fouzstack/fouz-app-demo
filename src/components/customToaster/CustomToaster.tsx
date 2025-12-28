import { Toaster, ToastPosition } from 'react-hot-toast';

interface CustomToasterProps {
  position?: ToastPosition;
}

export default function CustomToaster({
  position = 'top-center',
}: CustomToasterProps) {
  return (
    <Toaster
      position={position}
      toastOptions={{
        // Duración de 3 segundos
        duration: 3000,
        // Estilos personalizados
        style: {
          background: 'linear-gradient(135deg, #1a1a1a, #004d40)',
          color: '#ffffff',
          fontWeight: 'bold',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        },
        // Animación de entrada y salida
        className: 'animate-fade-in-out',
      }}
    />
  );
}
