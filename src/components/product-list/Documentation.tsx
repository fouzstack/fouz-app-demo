import React from 'react';
import { useNavigate } from 'react-router-dom';

const Documentation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center mb-6 px-4 py-2 bg-purple-800/30 hover:bg-purple-700/40 text-white rounded-lg transition-colors border border-purple-500/30"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Inicio
          </button>
          
          <h1 className="text-5xl font-bold text-white mb-4">Guía Rápida de Uso</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Aprende a gestionar tu inventario en pocos minutos. Guía diseñada para usuarios sin experiencia técnica.
          </p>
        </div>

        {/* Pasos principales */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:-translate-y-2">
            <div className="text-4xl mb-4 text-purple-400">1️⃣</div>
            <h3 className="text-2xl font-bold text-white mb-4">Crear Productos</h3>
            <ul className="text-gray-300 space-y-3">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Haz clic en el botón "+" para agregar nuevo producto</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Llena los datos básicos: nombre, precio, cantidad</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Puedes agregar descripción y categoría opcional</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:-translate-y-2">
            <div className="text-4xl mb-4 text-purple-400">2️⃣</div>
            <h3 className="text-2xl font-bold text-white mb-4">Gestionar Inventario</h3>
            <ul className="text-gray-300 space-y-3">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Los productos con stock bajo aparecen destacados</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Haz clic en cualquier producto para editarlo</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Actualiza cantidades cuando recibas mercancía</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:-translate-y-2">
            <div className="text-4xl mb-4 text-purple-400">3️⃣</div>
            <h3 className="text-2xl font-bold text-white mb-4">Buscar y Filtrar</h3>
            <ul className="text-gray-300 space-y-3">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Usa la barra de búsqueda para encontrar rápido</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Los productos se ordenan alfabéticamente</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Vista responsive en móvil, tablet y computadora</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Consejos prácticos */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">💡 Consejos Prácticos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/20 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                <span className="text-yellow-400 mr-2">⭐</span>
                Nombres Claros
              </h4>
              <p className="text-gray-300">
                Usa nombres descriptivos como "Camiseta Azul Talla M" en lugar de "CAZM001". Esto facilita las búsquedas.
              </p>
            </div>
            
            <div className="bg-black/20 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                <span className="text-yellow-400 mr-2">⭐</span>
                Stock Mínimo
              </h4>
              <p className="text-gray-300">
                Establece un stock mínimo para cada producto. El sistema te alertará cuando esté por agotarse.
              </p>
            </div>
            
            <div className="bg-black/20 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                <span className="text-yellow-400 mr-2">⭐</span>
                Categorías
              </h4>
              <p className="text-gray-300">
                Agrupa productos por categorías (Ropa, Electrónica, Hogar) para una mejor organización.
              </p>
            </div>
            
            <div className="bg-black/20 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center">
                <span className="text-yellow-400 mr-2">⭐</span>
                Precios Actualizados
              </h4>
              <p className="text-gray-300">
                Revisa y actualiza precios regularmente, especialmente si hay cambios en costos de proveedores.
              </p>
            </div>
          </div>
        </div>

        {/* Preguntas frecuentes */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">❓ Preguntas Frecuentes</h2>
          <div className="space-y-6">
            <div className="bg-black/20 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-white mb-2">¿Cómo edito un producto existente?</h4>
              <p className="text-gray-300">
                Simplemente haz clic en el producto que quieres modificar. Serás redirigido al formulario de edición con todos los datos cargados.
              </p>
            </div>
            
            <div className="bg-black/20 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-white mb-2">¿Dónde veo qué productos necesito reponer?</h4>
              <p className="text-gray-300">
                Los productos con stock bajo o agotado aparecen automáticamente en tu lista principal. Puedes identificarlos fácilmente.
              </p>
            </div>
            
            <div className="bg-black/20 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-white mb-2">¿Los datos se guardan automáticamente?</h4>
              <p className="text-gray-300">
                Sí, todos los cambios se guardan automáticamente en tu navegador. No necesitas hacer clic en "Guardar".
              </p>
            </div>
            
            <div className="bg-black/20 rounded-xl p-6">
              <h4 className="text-xl font-semibold text-white mb-2">¿Puedo usar la app en mi teléfono?</h4>
              <p className="text-gray-300">
                ¡Absolutamente! La aplicación es completamente responsive y funciona perfectamente en móviles, tablets y computadoras.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-violet-700 rounded-2xl p-1 mb-8">
            <div className="bg-gray-900/90 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">¿Listo para comenzar?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Ahora que conoces lo básico, es momento de crear tu primer producto y organizar tu inventario.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-1"
                >
                  Volver al Inicio
                </button>
                <button
                  onClick={() => navigate('/crear/producto')}
                  className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 font-semibold text-lg border border-gray-700"
                >
                  Crear Primer Producto
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer de ayuda */}
        <div className="text-center pt-8 border-t border-gray-700/50">
          <p className="text-gray-400 mb-4">
            ¿Necesitas más ayuda? Contacta a soporte técnico:
          </p>
          <div className="flex justify-center space-x-6">
            <a href="mailto:gfouz1975@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors">
              ✉️ gfouz1975@gmail.com
            </a>
            <span className="text-gray-600">|</span>
            <a href="tel:+53 54278815" className="text-purple-400 hover:text-purple-300 transition-colors">
              📞 +53 54 278815
            </a>
          </div>
        </div>
      </div>

      {/* Estilos adicionales */}
      <style>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-in-section.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default Documentation;
