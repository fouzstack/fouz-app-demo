import { ProcessedProduct } from './productCalculations';
import { COLUMN_GROUPS } from './ProductTableFull';

interface ProductInfoCardProps {
  product: ProcessedProduct;
  isVisible: boolean;
  onClose: () => void;
}

// ─── COMPONENTE CARD DE INFORMACIÓN ───────────────────────────────────────
const ProductInfoCard: React.FC<ProductInfoCardProps> = ({
  product,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-sm'
      style={{ top: '16px' }} // Posicionada en el borde superior
      onClick={onClose}
    >
      <div
        className='bg-gray-800 border border-gray-600 rounded-xl shadow-2xl p-6 mx-4 max-w-sm w-full'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex justify-between items-start mb-4'>
          <div className='flex-1 min-w-0'>
            <h3 className='text-white font-bold text-lg truncate pr-2'>
              {product.name}
            </h3>
            <p className='text-gray-400 text-sm mt-1'>Código: {product.code}</p>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors flex-shrink-0 text-lg ml-2'
          >
            ✕
          </button>
        </div>

        {/* Métricas agrupadas */}
        <div className='space-y-3 !text-2xl'>
          {/* Grupo Inventario */}
          <div
            className={`p-3 rounded-lg ${COLUMN_GROUPS.inventory.color} border ${COLUMN_GROUPS.inventory.border}`}
          >
            <h4 className='text-green-400 font-semibold  mb-2'>INVENTARIO</h4>
            <div className='grid grid-cols-2 gap-2 '>
              <div>
                <span className='text-gray-300'>A la Venta:</span>
                <div className='text-white font-semibold'>
                  {product.available_products.toLocaleString()}
                </div>
              </div>
              <div>
                <span className='text-gray-300'>Finales:</span>
                <div
                  className={`font-semibold ${product.final_products === 0 ? 'text-red-400' : 'text-white'}`}
                >
                  {product.final_products.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Grupo Ventas */}
          <div
            className={`p-3 rounded-lg ${COLUMN_GROUPS.sales.color} border ${COLUMN_GROUPS.sales.border}`}
          >
            <h4 className='text-purple-400 font-semibold  mb-2'>VENTAS</h4>
            <div className='text-center'>
              <div className='text-white font-bold '>
                {product.sold_products.toLocaleString()}
              </div>
              <div className='text-gray-300'>unidades vendidas</div>
            </div>
          </div>

          {/* Grupo Finanzas */}
          <div
            className={`p-3 rounded-lg ${COLUMN_GROUPS.finance.color} border ${COLUMN_GROUPS.finance.border}`}
          >
            <h4 className='text-amber-400 font-semibold  mb-2'>FINANZAS</h4>
            <div className='space-y-2'>
              <div className='flex flex-col justify-between '>
                <div>
                  <span className='text-gray-300'>Costo: </span>
                  <span className='text-amber-300 font-semibold'>
                    {product.cost.toLocaleString('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                    })}
                  </span>
                </div>
                <div>
                  <span className='text-gray-300'>Precio: </span>
                  <span className='text-amber-300 font-semibold'>
                    {product.price.toLocaleString('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                    })}
                  </span>
                </div>
              </div>
              <div className='flex justify-between items-center pt-2 border-t border-amber-700/50'>
                <span className='text-gray-300'>Importe:</span>
                <span className='text-green-400 font-bold'>
                  {product.total_cash.toLocaleString('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 pt-3 border-t border-gray-700'>
          <p className='text-xs text-gray-400 text-center'>
            Toca fuera del recuadro para cerrar
          </p>
        </div>
      </div>
    </div>
  );
};
export default ProductInfoCard;
