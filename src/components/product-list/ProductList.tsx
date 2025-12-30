import { useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import useProductList from "./useProductList";
import AdminLTE from "../AdminLTE/AdminLTE";
import { ProductType } from "../../models/models";
import { useProductStore } from "../../store/store";

// ======================================================
// 🎨 Componente de Item con estilo corporativo
// ======================================================
const ProductItem = memo(
  ({
    product,
    index,
    onClick,
  }: {
    product: ProductType;
    index: number;
    onClick: (product: ProductType) => void;
  }) => {
    return (
      <li
        className="animate-fade-in"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <button
          onClick={() => onClick(product)}
          className="
            group w-full h-full p-6 
            bg-[#111318] 
            rounded-xl border border-gray-800 
            text-left 
            hover:bg-gray-800/60 
            hover:border-amber-500/40 
            hover:shadow-lg hover:shadow-black/40
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-amber-500/40
            transform hover:-translate-y-1
            flex flex-col
          "
        >
          {/* Icono del producto */}
          <div className="mb-4 flex justify-between items-start">
            <div
              className="
                w-12 h-12 rounded-xl 
                bg-gradient-to-br from-amber-500 to-amber-600 
                flex items-center justify-center 
                text-gray-900 text-lg font-bold shadow-md
              "
            >
              {product.name.charAt(0).toUpperCase()}
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-amber-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Nombre */}
          <h3
            className="
              text-gray-100 font-semibold text-lg mb-2 
              group-hover:text-amber-300 
              transition-colors line-clamp-2
            "
          >
            {product.name}
          </h3>

          {/* Precio */}
          {product.price && (
            <div className="mt-auto pt-4">
              <span
                className="
                  inline-block bg-black/30 
                  text-amber-300 px-3 py-1 
                  rounded-full text-sm font-medium
                "
              >
                ${product.price}
              </span>
            </div>
          )}
        </button>
      </li>
    );
  }
);

ProductItem.displayName = "ProductItem";

// ======================================================
// 🎨 LISTA PRINCIPAL
// ======================================================
const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useProductStore((state) => state.dispatch);

  const { displayedProducts, isLoading, error } = useProductList();

  const handleProductClick = useCallback(
    (product: ProductType) => {
      dispatch({ type: "SET_PRODUCT", payload: product });
      navigate("/añadir/producto");
    },
    [dispatch, navigate]
  );

  const handleCreateProduct = useCallback(() => {
    navigate("/crear/producto");
  }, [navigate]);

  // ======================================================
  // LOADING
  // ======================================================
  if (isLoading) {
    return (
      <AdminLTE>
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#0d0f12]">
          <div className="text-amber-400 animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-gray-300 text-lg">Cargando productos...</p>
        </div>
      </AdminLTE>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================
  if (error) {
    return (
      <AdminLTE>
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#0d0f12]">
          <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-8 border border-red-600/30 max-w-md text-center">
            <div className="text-3xl mb-4 text-red-400">⚠️</div>
            <div className="text-2xl mb-4 text-gray-100 font-semibold">
              Ha ocurrido un error
            </div>
            <div className="text-gray-400 mb-6">{error.message}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </AdminLTE>
    );
  }

  // ======================================================
  // VACÍO
  // ======================================================
  if (!displayedProducts || displayedProducts.length === 0) {
    return (
      <AdminLTE>
        <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6 text-amber-400 animate-pulse">📦</div>

            <h2 className="text-gray-100 text-3xl font-bold mb-4">
              Tu inventario está vacío
            </h2>

            <p className="text-gray-400 mb-6 text-lg">
              Comienza agregando tu primer producto.
            </p>

            <button
              onClick={handleCreateProduct}
              className="
                w-full px-8 py-4 
                bg-amber-600 hover:bg-amber-700 
                text-gray-900 font-semibold 
                rounded-xl transition-all duration-300 
                shadow-lg hover:shadow-amber-500/20 
                transform hover:-translate-y-1
              "
            >
              Crear Producto
            </button>
          </div>
        </div>
      </AdminLTE>
    );
  }

  // ======================================================
  // LISTA DE PRODUCTOS
  // ======================================================
  return (
    <AdminLTE>
      <div className="min-h-screen bg-[#0d0f12]">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-100 mb-3">
              Mis Productos
            </h1>

            <div
              className="
                inline-flex items-center 
                bg-[#111318] border border-gray-800 
                rounded-full px-6 py-3 shadow-md shadow-black/30
              "
            >
              <span className="text-gray-400 mr-2">Total:</span>
              <span className="text-amber-400 font-bold text-xl">
                {displayedProducts.length}
              </span>
            </div>
          </div>

          {/* Botón flotante */}
          <div className="fixed bottom-16 right-8 z-10">
            <button
              onClick={handleCreateProduct}
              className="
                flex items-center justify-center 
                w-14 h-14 
                bg-amber-600 hover:bg-amber-700 
                text-gray-900 rounded-full 
                shadow-lg hover:shadow-amber-500/40 
                transition-all duration-300 
                transform hover:scale-110 
                text-2xl font-bold
              "
              title="Crear nuevo producto"
            >
              +
            </button>
          </div>

          {/* Grid */}
          <div className="max-w-7xl mx-auto">
            <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedProducts.map((product, index) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  index={index}
                  onClick={handleProductClick}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Animaciones */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </AdminLTE>
  );
};

export default ProductList;
