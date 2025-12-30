import { useState, useRef, useEffect } from 'react';
import {
  PlusIcon,
  XMarkIcon,
  DocumentPlusIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

// Interfaces para tipado
export interface ActionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface FloatingActionButtonProps {
  actions?: ActionItem[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  mainButtonColor?: string;
  actionButtonColor?: string;
  labelBackground?: string;
  labelTextColor?: string;
  iconColor?: string;
  mainIcon?: React.ComponentType<{ className?: string }>;
  closeIcon?: React.ComponentType<{ className?: string }>;
  mainButtonSize?: 'sm' | 'md' | 'lg';
  actionButtonSize?: 'sm' | 'md' | 'lg';
  openDirection?: 'up' | 'down';
  className?: string;
  closeOnActionClick?: boolean;
  animationDuration?: number;
  spacing?: string;
  maxAnimationDelay?: number;
  // New prop to inform parent about open/close state
  onOpenChange?: (isOpen: boolean) => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions = [
    {
      id: 'action-1',
      label: 'Nuevo Archivo',
      icon: DocumentPlusIcon,
      onClick: () => console.log('Nuevo archivo creado'),
      ariaLabel: 'Crear un nuevo archivo',
    },
    {
      id: 'action-2',
      label: 'Subir Foto',
      icon: PhotoIcon,
      onClick: () => console.log('Subiendo foto...'),
      ariaLabel: 'Subir una foto',
    },
    {
      id: 'action-3',
      label: 'Enviar Mensaje',
      icon: ChatBubbleLeftRightIcon,
      onClick: () => console.log('Enviando mensaje...'),
      ariaLabel: 'Enviar un mensaje',
    },
  ],
  position = 'bottom-right',
  mainButtonColor = 'bg-blue-600 hover:bg-blue-700',
  actionButtonColor = 'bg-blue-600 hover:bg-blue-700',
  labelBackground = 'bg-gray-800 bg-opacity-90',
  labelTextColor = 'text-white',
  iconColor = 'text-white',
  mainIcon = PlusIcon,
  closeIcon = XMarkIcon,
  mainButtonSize = 'sm',
  actionButtonSize = 'md',
  openDirection = 'down',
  className = '',
  closeOnActionClick = true,
  animationDuration = 300,
  spacing = 'space-y-3',
  maxAnimationDelay = 300,
  onOpenChange, // Destructure the new prop
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainButtonRef = useRef<HTMLButtonElement>(null);

  // Validar props con valores por defecto
  const validatedAnimationDuration =
    animationDuration < 0 ? 300 : animationDuration;
  const validatedMaxAnimationDelay =
    maxAnimationDelay < 0 ? 300 : maxAnimationDelay;

  if (!actions || actions.length === 0) {
    console.warn(
      'FloatingActionButton: actions prop is empty or invalid. At least one action is recommended.',
    );
  }

  // Effect to call onOpenChange when isOpen changes
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Soporte para navegación por teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        mainButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Manejar click en acción con manejo de errores
  const handleActionClick = (
    action: ActionItem,
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    evt.preventDefault(); // Prevenir cualquier propagación de eventos por defecto (e.g., submit de form)
    evt.stopPropagation(); //se preventDefault instead of defaultPrevented
    if (!action.disabled) {
      try {
        action.onClick();
        if (closeOnActionClick) {
          setIsOpen(false);
          mainButtonRef.current?.focus();
        }
      } catch (error) {
        console.error('FloatingActionButton: Error in action.onClick:', error);
      }
    }
  };

  // Tamaños de botón
  const mainButtonSizes = {
    sm: 'h-12 w-12',
    md: 'h-14 w-14',
    lg: 'h-16 w-16',
  };

  const actionButtonSizes = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
  };

  // Posiciones
  const positionClasses = {
    'bottom-right': 'bottom-5 right-5', // Adjusted to be near the submit button
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  // Dirección de apertura
  const openDirectionClasses = {
    up: 'flex-col-reverse',
    down: 'flex-col',
  };

  const directionTransform = {
    up: isOpen ? 'translate-y-0' : 'translate-y-4',
    down: isOpen ? 'translate-y-0' : '-translate-y-4',
  };

  const MainIcon = mainIcon;
  const CloseIcon = closeIcon;

  return (
    <div
      ref={menuRef}
      className={`
        absolute ${positionClasses[position]}
        flex ${openDirectionClasses[openDirection]}
        items-end ${spacing} z-50
        ${className}
      `}
    >
      {/* Botones de acción - Siempre renderizados pero ocultos cuando no está abierto */}
      {actions.map((action, index) => {
        const ActionIcon = action.icon;
        return (
          <div
            key={action.id}
            className={`
              flex items-center transition-all transform
              ${isOpen ? `opacity-100 ${directionTransform[openDirection]} scale-100` : 'opacity-0 scale-95 '}
              ${openDirection === 'up' ? 'flex-row-reverse' : ''}
            `}
            style={{
              height: isOpen ? '' : '0',
              transitionDelay: `${isOpen ? Math.min(index * 100, validatedMaxAnimationDelay) : 0}ms`,
              transitionDuration: `${validatedAnimationDuration}ms`,
              pointerEvents: isOpen ? 'auto' : 'none',
            }}
          >
            <span
              className={`
                ${openDirection === 'up' ? 'ml-3' : 'mr-3'}
                rounded-lg ${labelBackground} px-3 py-2 text-sm font-medium
                ${labelTextColor} shadow-lg whitespace-nowrap
              `}
            >
              {action.label}
            </span>
            <button
              onClick={(evt) => handleActionClick(action, evt)}
              type='button'
              className={`
                flex ${actionButtonSizes[actionButtonSize]} items-center justify-center
                rounded-full ${actionButtonColor} ${iconColor} shadow-lg
                transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              `}
            >
              <ActionIcon className={iconSizes[actionButtonSize]} />
            </button>
          </div>
        );
      })}

      {/* Botón principal */}
      <button
        type='button'
        ref={mainButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          transitionDuration: `${validatedAnimationDuration}ms`,
        }}
        className={`
          flex ${mainButtonSizes[mainButtonSize]} items-center justify-center
          rounded-full ${mainButtonColor} ${iconColor} shadow-lg
          transition-all hover:scale-110
          relative z-50
        `}
      >
        {isOpen ? (
          <CloseIcon className={iconSizes[mainButtonSize]} />
        ) : (
          <MainIcon className={iconSizes[mainButtonSize]} />
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;
