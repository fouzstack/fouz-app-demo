

 
const PointerHand = ({ className = "w-6 h-6 text-gray-800" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className} // Usa clases de Tailwind para tamaño y color
      aria-hidden="true" // Oculta el SVG de los lectores de pantalla
    >
      {/* Palma y base de la mano */}
      <path d="M10.5 4.5a1.5 1.5 0 1 1 3 0v7.5a.75.75 0 0 0 1.5 0V6a1.5 1.5 0 1 1 3 0v8.5a5.5 5.5 0 0 1-9.5 3.87V4.5Z" />
      {/* Dedo índice (extendido hacia la izquierda) */}
      <path d="M8.25 9.75a.75.75 0 0 0-.75.75v.5c0 .414.336.75.75.75H9v-2H8.25Z" />
      {/* Contorno y definición de los dedos */}
      <path d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Zm-3 0a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Z" />
    </svg>
  );
};

export default PointerHand;
