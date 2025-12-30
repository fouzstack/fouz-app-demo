interface InventoryFallbackProps {
  message?: string;
}

export default function InventoryFallback({
  message = 'No se encontró ningún inventario disponible.',
}: InventoryFallbackProps) {
  return (
    <div className='p-6 text-center max-w-[320px] mx-auto'>
      <p className='mb-2 text-yellow-700'>{message}</p>

      <section className='border border-yellow-400 rounded p-4 bg-yellow-50 text-left'>
        <h3 className='font-semibold mb-2 text-yellow-700'>
          ¿Qué es el Inventario?
        </h3>
        <p className='text-sm text-yellow-800 leading-relaxed'>
          El inventario es el registro detallado de productos, incluyendo sus
          cantidades iniciales, entradas, pérdidas y ventas. Es crucial
          mantenerlo actualizado para controlar el stock y las ganancias de
          manera precisa.
        </p>
        <p className='mt-2 text-sm text-yellow-800 leading-relaxed'>
          Para comenzar, asegúrate de registrar cada producto correctamente y
          actualizar las cantidades con cada movimiento.
        </p>
      </section>
    </div>
  );
}
