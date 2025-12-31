import React from 'react';
import { useNavigate } from 'react-router-dom';

const Documentation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0f12]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/')}
            className={`
              inline-flex items-center mb-8 px-5 py-3 
              bg-[#111318] hover:bg-gray-800/60 
              text-gray-100 font-medium
              rounded-xl transition-all duration-300 
              border border-gray-800
              hover:border-amber-500/40
              hover:shadow-lg hover:shadow-black/40
              hover:-translate-y-1
              group
            `}
          >
            <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-amber-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Dashboard
          </button>
          
          <div className="bg-[#111318] border border-gray-800 rounded-xl shadow-2xl shadow-black/30 p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-100 mb-4">Guía Rápida de Uso</h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Aprende a gestionar tu inventario en pocos minutos. Guía diseñada para usuarios sin experiencia técnica.
            </p>
          </div>
        </div>

        {/* Pasos principales */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: "📦",
              title: "Crear Productos",
              color: "emerald",
              items: [
                "Haz clic en el botón '+' para agregar nuevo producto",
                "Llena los datos básicos: nombre, precio, cantidad",
                "Puedes agregar descripción y categoría opcional"
              ]
            },
            {
              icon: "📊",
              title: "Gestionar Inventario",
              color: "blue",
              items: [
                "Los productos con stock bajo aparecen destacados",
                "Haz clic en cualquier producto para editarlo",
                "Actualiza cantidades cuando recibas mercancía"
              ]
            },
            {
              icon: "🔍",
              title: "Buscar y Filtrar",
              color: "purple",
              items: [
                "Usa la barra de búsqueda para encontrar rápido",
                "Los productos se ordenan alfabéticamente",
                "Vista responsive en móvil, tablet y computadora"
              ]
            }
          ].map((step, index) => (
            <div 
              key={index}
              className={`
                bg-[#111318] border border-gray-800 rounded-xl p-6 
                hover:border-amber-500/40
                transition-all duration-300 
                hover:shadow-xl hover:shadow-black/40
                hover:-translate-y-2
                group
              `}
            >
              <div className={`text-3xl mb-4 text-${step.color}-400`}>{step.icon}</div>
              <h3 className="text-xl font-bold text-gray-100 mb-4">{step.title}</h3>
              <ul className="text-gray-300 space-y-2">
                {step.items.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-400 mr-2 mt-1">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Consejos prácticos */}
        <div className="bg-[#111318] border border-gray-800 rounded-xl shadow-2xl shadow-black/30 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center flex items-center justify-center">
            <span className="text-amber-400 mr-3">💡</span>
            Consejos Prácticos
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: "⭐",
                title: "Nombres Claros",
                description: "Usa nombres descriptivos como 'Camiseta Azul Talla M' en lugar de 'CAZM001'. Esto facilita las búsquedas."
              },
              {
                icon: "📈",
                title: "Stock Mínimo",
                description: "Establece un stock mínimo para cada producto. El sistema te alertará cuando esté por agotarse."
              },
              {
                icon: "🏷️",
                title: "Categorías",
                description: "Agrupa productos por categorías (Ropa, Electrónica, Hogar) para una mejor organización."
              },
              {
                icon: "💰",
                title: "Precios Actualizados",
                description: "Revisa y actualiza precios regularmente, especialmente si hay cambios en costos de proveedores."
              }
            ].map((tip, index) => (
              <div 
                key={index}
                className="bg-[#0f1115] rounded-lg p-5 border border-gray-800 hover:border-gray-700 transition-colors duration-300"
              >
                <h4 className="text-lg font-semibold text-gray-100 mb-3 flex items-center">
                  <span className="text-amber-400 mr-2">{tip.icon}</span>
                  {tip.title}
                </h4>
                <p className="text-gray-400 text-sm">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Preguntas frecuentes */}
        <div className="bg-[#111318] border border-gray-800 rounded-xl shadow-2xl shadow-black/30 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center flex items-center justify-center">
            <span className="text-blue-400 mr-3">❓</span>
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {[
              {
                question: "¿Cómo edito un producto existente?",
                answer: "Simplemente haz clic en el producto que quieres modificar. Serás redirigido al formulario de edición con todos los datos cargados."
              },
              {
                question: "¿Dónde veo qué productos necesito reponer?",
                answer: "Los productos con stock bajo o agotado aparecen automáticamente en tu lista principal. Puedes identificarlos fácilmente."
              },
              {
                question: "¿Los datos se guardan automáticamente?",
                answer: "Sí, todos los cambios se guardan automáticamente en tu navegador. No necesitas hacer clic en 'Guardar'."
              },
              {
                question: "¿Puedo usar la app en mi teléfono?",
                answer: "¡Absolutamente! La aplicación es completamente responsive y funciona perfectamente en móviles, tablets y computadoras."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="bg-[#0f1115] rounded-lg p-5 border border-gray-800 hover:border-gray-700 transition-colors duration-300"
              >
                <h4 className="text-lg font-semibold text-gray-100 mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-400 text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <div className="bg-[#111318] border border-gray-800 rounded-xl shadow-2xl shadow-black/30 p-8">
            <h3 className="text-2xl font-bold text-gray-100 mb-4">¿Listo para comenzar?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Ahora que conoces lo básico, es momento de crear tu primer producto y organizar tu inventario.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className={`
                  px-8 py-4 
                  bg-amber-600 hover:bg-amber-700 
                  text-gray-900 font-semibold
                  rounded-xl 
                  shadow-lg hover:shadow-amber-500/40 
                  transform hover:scale-105
                  transition-all duration-300
                  text-lg
                `}
              >
                Volver al Dashboard
              </button>
              <button
                onClick={() => navigate('/crear/producto')}
                className={`
                  px-8 py-4 
                  bg-gray-800 hover:bg-gray-700 
                  text-gray-300 font-semibold
                  rounded-xl 
                  border border-gray-700
                  shadow-sm hover:shadow-gray-500/20
                  transform hover:scale-105
                  transition-all duration-300
                  text-lg
                `}
              >
                Crear Primer Producto
              </button>
            </div>
          </div>
        </div>

        {/* Footer de ayuda */}
        <div className="text-center pt-8 mt-12 border-t border-gray-800">
          <p className="text-gray-400 mb-4 text-sm">
            ¿Necesitas más ayuda? Contacta a soporte técnico:
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a 
              href="mailto:gfouz1975@gmail.com" 
              className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center"
            >
              <span className="mr-2">✉️</span>
              gfouz1975@gmail.com
            </a>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <a 
              href="tel:+53 54278815" 
              className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-sm flex items-center"
            >
              <span className="mr-2">📞</span>
              +53 54 278815
            </a>
          </div>
        </div>
      </div>

      {/* Estilos adicionales */}
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
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Documentation;
