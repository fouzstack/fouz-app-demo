import { useCallback, memo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useProductList from './useProductList';
import AdminLTE from '../AdminLTE/AdminLTE';
import { ProductType } from '../../models/models';
import { useProductStore } from '../../store/store';

// ======================================================
// 🎨 Tipos y Interfaces Type-Safe
// ======================================================
interface ProductItemProps {
  product: ProductType;
  index: number;
  onClick: (product: ProductType) => void;
}

interface CanvasParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  productId?: number;
  targetX?: number;
  targetY?: number;
  isActive: boolean;
}

// ======================================================
// 🎨 Componente de Item Premium
// ======================================================
const ProductItem = memo<ProductItemProps>(({ product, index, onClick }) => {
  const cardRef = useRef<HTMLLIElement>(null);

  return (
    <li
      ref={cardRef}
      className='animate-fade-in'
      style={{ animationDelay: `${index * 0.05}s` }}
      data-product-id={product.id}
    >
      <button
        onClick={() => onClick(product)}
        className='
          group w-full h-full p-5 
          bg-gradient-to-br from-[#111318] to-[#0f1115]
          rounded-2xl border border-gray-800 
          text-left 
          hover:border-amber-500/60 
          hover:shadow-2xl hover:shadow-amber-500/10
          transition-all duration-500
          focus:outline-none focus:ring-2 focus:ring-amber-500/40
          transform hover:-translate-y-2
          flex flex-col
          overflow-hidden
          relative
        '
        aria-label={`Ver detalles de ${product.name}`}
      >
        {/* Efecto de brillo en hover */}
        <div className='
          absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-700
          -translate-x-full group-hover:translate-x-full
        ' />
        
        {/* Badge de stock si está bajo */}
        {product.final_products && product.final_products <= 5 && (
          <div className='
            absolute -top-2 -right-2 
            bg-gradient-to-r from-red-600 to-red-700 
            text-gray-100 text-xs font-bold 
            px-3 py-1 rounded-full 
            shadow-lg shadow-red-500/30
            z-10
            animate-pulse-gentle
          '>
            Stock: {product.final_products}
          </div>
        )}

        {/* Icono del producto con efecto 3D */}
        <div className='mb-4 flex justify-between items-start'>
          <div className='relative'>
            <div className='
              w-14 h-14 rounded-2xl 
              bg-gradient-to-br from-amber-500 to-amber-700 
              flex items-center justify-center 
              text-gray-900 text-xl font-bold 
              shadow-xl shadow-amber-500/30
              transform group-hover:rotate-12 
              transition-transform duration-500
              relative overflow-hidden
            '>
              {/* Efecto interno */}
              <div className='
                absolute inset-0 
                bg-gradient-to-br from-amber-400/30 to-transparent
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-500
              ' />
              {product.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Anillo exterior */}
            <div className='
              absolute -inset-1 rounded-2xl 
              bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-700
              blur-sm
            ' />
          </div>

          {/* Flecha de interacción */}
          <div className='
            opacity-0 group-hover:opacity-100 
            transition-all duration-300 
            transform translate-x-4 group-hover:translate-x-0
            text-amber-400
          '>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>

        {/* Nombre */}
        <h3
          className='
            text-gray-100 font-bold text-lg mb-2 
            group-hover:text-amber-300 
            transition-colors duration-300 
            line-clamp-2
            relative
          '
        >
          {product.name}
          {/* Subrayado animado */}
          <span className='
            absolute -bottom-1 left-0 w-0 h-0.5 
            bg-gradient-to-r from-amber-500 to-amber-300
            group-hover:w-full
            transition-all duration-500
          ' />
        </h3>

        {/* Información de precio */}
        {product.price && (
          <div className='mt-auto pt-4'>
            <div className='
              inline-flex items-center gap-2
              bg-gradient-to-r from-gray-900/80 to-black/80 
              text-amber-300 px-4 py-2 
              rounded-xl text-sm font-semibold
              border border-amber-500/20
              group-hover:border-amber-500/40
              transition-all duration-300
            '>
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              ${product.price.toLocaleString('es-MX')}
            </div>
          </div>
        )}

        {/* Info adicional sutil */}
        <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-800/50'>
          <span className='text-gray-500 text-xs'>
            ID: <span className='text-gray-400'>{product.id}</span>
          </span>
          {product.unit && (
            <span className='text-gray-500 text-xs'>
              Unidad: <span className='text-gray-400'>{product.unit}</span>
            </span>
          )}
        </div>
      </button>
    </li>
  );
});

ProductItem.displayName = 'ProductItem';

// ======================================================
// 🎨 FONDO ANIMADO MEMORABLE
// ======================================================
const AnimatedBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuración
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: CanvasParticle[] = [];
    const particleCount = 80;
    const productCards: Array<{ id: number; x: number; y: number; width: number; height: number }> = [];

    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: Math.random() > 0.5 ? 'rgba(251, 191, 36, 0.3)' : 'rgba(96, 165, 250, 0.3)',
        opacity: Math.random() * 0.3 + 0.2,
        isActive: true,
      });
    }

    // Actualizar posiciones de tarjetas
    const updateCardPositions = () => {
      productCards.length = 0;
      document.querySelectorAll('[data-product-id]').forEach(card => {
        const rect = card.getBoundingClientRect();
        const id = parseInt(card.getAttribute('data-product-id') || '0');
        if (id) {
          productCards.push({
            id,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            width: rect.width,
            height: rect.height,
          });
        }
      });
    };

    // Animación
    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Actualizar posiciones de tarjetas periódicamente
      if (Math.random() < 0.1) {
        updateCardPositions();
      }

      // Dibujar y actualizar partículas
      particles.forEach(particle => {
        // Movimiento natural
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Rebote en bordes
        if (particle.x <= 0 || particle.x >= canvas.width) particle.speedX *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.speedY *= -1;

        // Interacción con tarjetas
        productCards.forEach(card => {
          const dx = particle.x - card.x;
          const dy = particle.y - card.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.x += (dx / distance) * force * 2;
            particle.y += (dy / distance) * force * 2;
          }
        });

        // Interacción con mouse
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.x -= (dx / distance) * force * 5;
          particle.y -= (dy / distance) * force * 5;
        }

        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.3', particle.opacity.toString());
        ctx.fill();

        // Brillo
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.3', (particle.opacity * 0.3).toString());
        ctx.fill();
      });

      // Conexiones entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(251, 191, 36, ${0.1 * (1 - distance/100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateCardPositions();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Iniciar animación
    animate();
    updateCardPositions();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className='fixed inset-0 z-0 pointer-events-none'
      aria-hidden='true'
    />
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

// ======================================================
// 🎨 COMPONENTES DE ESTADO
// ======================================================
const LoadingState = memo(() => (
  <div className='flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#0d0f12] to-[#111318] relative overflow-hidden'>
    {/* Partículas de carga */}
    <div className='absolute inset-0'>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className='absolute rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20'
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(40px)',
            animation: `pulse-slow ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>

    <div className='relative z-10 text-center'>
      <div className='relative mb-8'>
        <div className='
          w-32 h-32 
          bg-gradient-to-br from-amber-500/20 to-amber-600/20 
          rounded-full 
          animate-spin-slow
          flex items-center justify-center
        '>
          <div className='
            w-24 h-24 
            bg-gradient-to-br from-[#111318] to-[#0f1115] 
            rounded-full 
            flex items-center justify-center
            border border-amber-500/20
          '>
            <div className='text-3xl text-amber-400'>📦</div>
          </div>
        </div>
      </div>
      
      <p className='text-2xl font-bold text-gray-100 mb-2'>Cargando inventario</p>
      <p className='text-gray-400'>Preparando experiencia premium...</p>
    </div>
  </div>
));

const ErrorState = memo(({ error }: { error: Error }) => (
  <div className='flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#0d0f12] to-[#111318]'>
    <div className='
      bg-gradient-to-br from-[#111318] to-[#0f1115]
      border border-red-500/30
      rounded-2xl p-8 
      shadow-2xl shadow-red-500/10
      max-w-md text-center
    '>
      <div className='text-4xl mb-4 text-red-400 animate-bounce'>⚠️</div>
      <div className='text-xl font-bold text-gray-100 mb-4'>
        Error en el sistema
      </div>
      <div className='text-gray-400 mb-6'>{error.message}</div>
      <button
        onClick={() => window.location.reload()}
        className='
          px-6 py-3 
          bg-gradient-to-r from-red-600 to-red-700 
          hover:from-red-700 hover:to-red-800
          text-white rounded-xl 
          transition-all duration-300
          font-medium
          transform hover:scale-105
          shadow-lg shadow-red-500/20
        '
      >
        Reintentar conexión
      </button>
    </div>
  </div>
));

const EmptyState = memo(({ onCreateProduct }: { onCreateProduct: () => void }) => (
  <div className='min-h-screen bg-gradient-to-br from-[#0d0f12] to-[#111318] flex items-center justify-center px-4 relative overflow-hidden'>
    {/* Efectos de fondo */}
    <div className='absolute inset-0'>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className='absolute rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10'
          style={{
            width: `${Math.random() * 200 + 100}px`,
            height: `${Math.random() * 200 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(60px)',
            animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>

    <div className='relative z-10 text-center max-w-2xl'>
      <div className='mb-8'>
        <div className='text-7xl mb-4 animate-float'>🚀</div>
        <h2 className='text-4xl font-bold text-gray-100 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-emerald-400'>
          Tu viaje comienza aquí
        </h2>
        <p className='text-xl text-gray-300 mb-6'>
          Crea tu primer producto y transforma tu negocio con nuestro sistema premium de inventario.
        </p>
      </div>

      <button
        onClick={onCreateProduct}
        className='
          px-10 py-5 
          bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 
          hover:from-amber-700 hover:via-amber-600 hover:to-amber-700 
          text-gray-900 font-bold text-lg
          rounded-2xl 
          transition-all duration-500
          shadow-2xl shadow-amber-500/30 
          transform hover:-translate-y-1 hover:scale-105
          relative overflow-hidden
          group
        '
      >
        <span className='relative z-10 flex items-center gap-3'>
          <svg className='w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300' 
            fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          Crear Producto Inaugural
        </span>
        <div className='
          absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-500
          -translate-x-full group-hover:translate-x-full
        ' />
      </button>

      <p className='text-gray-500 text-sm mt-8'>
        Empieza tu gestión profesional hoy mismo
      </p>
    </div>
  </div>
));

// ======================================================
// 🎨 COMPONENTE PRINCIPAL OPTIMIZADO
// ======================================================
const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useProductStore((state) => state.dispatch);
  const { displayedProducts, isLoading, error } = useProductList();

  const handleProductClick = useCallback(
    (product: ProductType) => {
      dispatch({ type: 'SET_PRODUCT', payload: product });
      navigate('/añadir/producto');
    },
    [dispatch, navigate],
  );

  const handleCreateProduct = useCallback(() => {
    navigate('/crear/producto');
  }, [navigate]);

  // Renderizado condicional optimizado
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!displayedProducts?.length) return <EmptyState onCreateProduct={handleCreateProduct} />;

  return (
    <AdminLTE>
      <div className='min-h-screen bg-[#0d0f12] relative overflow-hidden'>
        {/* Fondo animado memorable */}
        <AnimatedBackground />

        {/* Contenido principal */}
        <div className='relative z-10'>
          <div className='container mx-auto px-4 py-8 max-w-7xl'>
            {/* Header premium */}
            <div className='text-center mb-12'>
              <div className='inline-block mb-6'>
                <h1 className='
                  text-5xl font-bold mb-4 
                  bg-clip-text text-transparent 
                  bg-gradient-to-r from-gray-100 via-amber-300 to-gray-100
                '>
                  Inventario Premium
                </h1>
                <p className='text-gray-400 text-lg max-w-2xl mx-auto'>
                  Gestión avanzada de productos con tecnología de última generación
                </p>
              </div>

              {/* Contador animado */}
              <div className='
                inline-flex items-center gap-4
                bg-gradient-to-r from-[#111318] to-[#0f1115]
                border border-gray-800 
                rounded-2xl px-8 py-4 
                shadow-2xl shadow-black/50
                mb-8
              '>
                <span className='text-gray-400 text-lg'>Productos activos:</span>
                <span className='
                  text-3xl font-bold 
                  bg-clip-text text-transparent 
                  bg-gradient-to-r from-amber-400 to-emerald-400
                '>
                  {displayedProducts.length}
                </span>
              </div>
            </div>

            {/* Botón flotante premium */}
            <div className='fixed bottom-16 right-8 z-20'>
              <button
                onClick={handleCreateProduct}
                className='
                  group
                  w-16 h-16 
                  bg-gradient-to-br from-amber-600 to-amber-700 
                  hover:from-amber-700 hover:to-amber-800
                  text-gray-900 rounded-2xl 
                  shadow-2xl shadow-amber-500/40 
                  transition-all duration-500 
                  transform hover:scale-110 hover:rotate-90
                  text-3xl font-bold
                  relative overflow-hidden
                  flex items-center justify-center
                '
                title='Crear producto premium'
                aria-label='Crear nuevo producto'
              >
                <span className='relative z-10 transition-transform duration-300 group-hover:scale-125'>
                  +
                </span>
                <div className='
                  absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-500
                  -translate-x-full group-hover:translate-x-full
                ' />
              </button>
            </div>

            {/* Grid de productos optimizado */}
            <ul className='
              grid gap-6 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-4
              auto-rows-fr
            '>
              {displayedProducts.map((product, index) => (
                <ProductItem
                  key={`product-${product.id}-${index}`}
                  product={product}
                  index={index}
                  onClick={handleProductClick}
                />
              ))}
            </ul>

            {/* Footer sutil */}
            <div className='text-center mt-12 pt-8 border-t border-gray-800/30'>
              <p className='text-gray-500 text-sm'>
                Sistema optimizado • Carga instantánea • Experiencia premium
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS optimizados */}
      <style>{`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Scrollbar premium */
        ::-webkit-scrollbar {
          width: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(17, 19, 24, 0.5);
          border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(251, 191, 36, 0.3), rgba(251, 191, 36, 0.5));
          border-radius: 6px;
          border: 2px solid rgba(17, 19, 24, 0.5);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(251, 191, 36, 0.5), rgba(251, 191, 36, 0.7));
        }
      `}</style>
    </AdminLTE>
  );
};

export default ProductList;
