import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useProductList from './useProductList';
import AdminLTE from '../AdminLTE/AdminLTE';
import { ProductType } from '../../models/models';
import { useProductStore } from '../../store/store';

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useProductStore((state) => state.dispatch);

  const { displayedProducts, isLoading, error } = useProductList();

  // Función para navegar al formulario con el producto seleccionado
  const handleProductClick = useCallback(
    (product: ProductType) => {
      dispatch({ type: 'SET_PRODUCT', payload: product });
      navigate('/añadir/producto');
    },
    [dispatch, navigate],
  );

  // Loading state
  if (isLoading) {
    return (
      <AdminLTE>
        <div className='flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900'>
          <div className='text-white animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4'></div>
          <p className='text-gray-300 text-lg'>Cargando productos...</p>
        </div>
      </AdminLTE>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLTE>
        <div className='flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900'>
          <div className='bg-red-900/30 backdrop-blur-sm rounded-xl p-8 border border-red-500/30 max-w-md text-center'>
            <div className='text-3xl mb-4 text-red-400'>⚠️</div>
            <div className='text-2xl mb-4 text-white font-semibold'>
              Ha ocurrido un error
            </div>
            <div className='text-gray-300 mb-6'>{error.message}</div>
            <button
              onClick={() => window.location.reload()}
              className='px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium'
            >
              Reintentar
            </button>
          </div>
        </div>
      </AdminLTE>
    );
  }

  // Estado vacío
  if (!displayedProducts || displayedProducts.length === 0) {
    return (
      <AdminLTE>
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900'>
          <div className='flex flex-col justify-center items-center min-h-screen px-4'>
            <div className='text-center max-w-md'>
              <div className='text-6xl mb-6 text-purple-400'>📦</div>
              <h2 className='text-white text-3xl font-bold mb-4'>
                No hay productos
              </h2>
              <p className='text-gray-300 mb-8 text-lg'>
                Comienza creando tu primer producto para gestionar tu inventario
              </p>
              <div className=''>
                <button
                  onClick={() => navigate('/crear/producto')}
                  className='px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1'
                >
                  Crear Primer Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLTE>
    );
  }

  return (
    <AdminLTE>
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900'>
        <div className='container mx-auto px-4 py-8'>
          {/* Header */}
          <div className='text-center mb-10'>
            <h1 className='text-4xl font-bold text-white mb-3'>
              Mis Productos
            </h1>
            <div className='inline-flex items-center bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 border border-purple-500/30'>
              <span className='text-gray-300 mr-2'>Total de productos:</span>
              <span className='text-purple-400 font-bold text-xl'>
                {displayedProducts.length}
              </span>
            </div>
          </div>

          {/* Botón de acción flotante */}
          <div className='fixed bottom-16 right-8 z-10'>
            <button
              onClick={() => navigate('/crear/producto')}
              className='flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white rounded-full shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-110 text-2xl font-bold'
              title='Crear nuevo producto'
            >
              +
            </button>
          </div>

          {/* Grid de productos */}
          <div className='max-w-7xl mx-auto'>
            <ul className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {displayedProducts.map((product: ProductType, index: number) => (
                <li
                  key={product.id}
                  className='animate-fade-in'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <button
                    onClick={() => handleProductClick(product)}
                    className='group w-full h-full p-6 bg-gray-800/40 backdrop-blur-sm 
                      rounded-2xl border border-gray-700/50 text-left hover:bg-gray-700/60 
                      hover:border-purple-500/50 hover:shadow-xl transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                      focus:shadow-purple-500/25 transform hover:-translate-y-2 flex flex-col'
                  >
                    {/* Icono del producto */}
                    <div className='mb-4 flex justify-between items-start'>
                      <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center text-white text-lg font-bold'>
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                      <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-400'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
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

                    {/* Nombre del producto */}
                    <h3 className='text-white font-bold text-xl mb-2 group-hover:text-purple-300 transition-colors line-clamp-2'>
                      {product.name}
                    </h3>
                    {/* Precio si está disponible */}
                    {product.price && (
                      <div className='mt-auto pt-4'>
                        <span className='inline-block bg-black/30 text-purple-300 px-3 py-1 rounded-full text-sm font-medium'>
                          ${product.price}
                        </span>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </AdminLTE>
  );
};

export default ProductList;
