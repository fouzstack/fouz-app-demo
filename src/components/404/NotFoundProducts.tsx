import { Button } from '@heroui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function NotFoundProducts() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuración del canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clase de partícula
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      life: number;
      maxLife: number;
      shape: 'circle' | 'square' | 'triangle';
      rotation: number;
      rotationSpeed: number;
      private canvasRef: HTMLCanvasElement;

      constructor(canvas: HTMLCanvasElement) {
        this.canvasRef = canvas;
        this.x = Math.random() * this.canvasRef.width;
        this.y = Math.random() * this.canvasRef.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = this.getRandomColor();
        this.opacity = Math.random() * 0.5 + 0.3;
        this.life = Math.random() * 100 + 50;
        this.maxLife = this.life;
        this.shape = ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle';
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
      }

      getRandomColor(): string {
        const colors = [
          'rgba(251, 191, 36, 0.7)', // Amber
          'rgba(52, 211, 153, 0.7)', // Emerald
          'rgba(96, 165, 250, 0.7)', // Blue
          'rgba(167, 139, 250, 0.7)', // Purple
          'rgba(248, 113, 113, 0.7)', // Red
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.rotation += this.rotationSpeed;

        // Rebote en bordes
        if (this.x <= 0 || this.x >= this.canvasRef.width) this.speedX *= -1;
        if (this.y <= 0 || this.y >= this.canvasRef.height) this.speedY *= -1;

        // Efecto de desvanecimiento
        this.opacity = (this.life / this.maxLife) * 0.7;

        // Si la partícula muere, renacer
        if (this.life <= 0) {
          this.x = Math.random() * this.canvasRef.width;
          this.y = Math.random() * this.canvasRef.height;
          this.life = this.maxLife;
          this.opacity = Math.random() * 0.5 + 0.3;
        }
      }

      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        switch (this.shape) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'square':
            ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
            break;
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size, this.size);
            ctx.lineTo(-this.size, this.size);
            ctx.closePath();
            ctx.fill();
            break;
        }

        ctx.restore();
      }
    }

    // Crear partículas
    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 150);

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }

    // Conexiones entre partículas
    function connectParticles() {
      if (!ctx) return;
      
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(251, 191, 36, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Animación
    let animationId: number;
    
    function animate() {
      if (!ctx || !canvas) return;
      
      // Fondo con gradiente sutil
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(13, 15, 18, 0.95)');
      gradient.addColorStop(1, 'rgba(17, 19, 24, 0.98)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar partículas
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Dibujar conexiones
      connectParticles();

      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Manejo de resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-[#0d0f12]'>
      {/* Canvas para partículas animadas */}
      <canvas
        ref={canvasRef}
        className='absolute inset-0 z-0'
      />

      {/* Contenido principal */}
      <div className='relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12'>
        {/* Icono artístico */}
        <div className='mb-8 relative'>
          <div className='relative'>
            {/* Caja vacía con efecto 3D */}
            <div className='w-48 h-48 relative'>
              {/* Sombra */}
              <div className='absolute inset-0 bg-gradient-to-r from-amber-900/20 to-purple-900/20 blur-2xl rounded-full'></div>
              
              {/* Caja 3D */}
              <div className='relative w-full h-full'>
                {/* Parte frontal */}
                <div className='absolute inset-4 border-2 border-amber-400/40 rounded-lg transform rotate-6'></div>
                
                {/* Parte superior */}
                <div className='absolute top-0 left-4 right-4 h-4 bg-gradient-to-r from-amber-600/20 to-purple-600/20 rounded-t-lg transform -skew-x-6'></div>
                
                {/* Parte lateral */}
                <div className='absolute left-0 top-4 bottom-4 w-4 bg-gradient-to-b from-amber-600/20 to-purple-600/20 rounded-l-lg transform skew-y-6'></div>
                
                {/* Icono de inventario vacío */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='text-center'>
                    {/* Icono de inventario */}
                    <div className='relative'>
                      <svg
                        className='w-24 h-24 mx-auto mb-4 text-gray-400/50'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                        />
                      </svg>
                      
                      {/* Partículas flotando fuera de la caja */}
                      <div className='absolute -top-2 -right-2'>
                        <div className='w-3 h-3 bg-amber-400/60 rounded-full animate-pulse'></div>
                      </div>
                      <div className='absolute -bottom-2 -left-2'>
                        <div className='w-2 h-2 bg-blue-400/60 rounded-full animate-pulse delay-300'></div>
                      </div>
                      <div className='absolute top-1/2 -right-4'>
                        <div className='w-4 h-1 bg-purple-400/40 rounded-full animate-pulse delay-500'></div>
                      </div>
                    </div>
                    
                    {/* Círculo de carga sutil */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='w-32 h-32 border-2 border-gray-700/30 rounded-full animate-spin-slow'></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Texto principal */}
        <div className='text-center mb-8 max-w-2xl'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-100 mb-4 leading-tight'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-gray-100 to-emerald-400'>
              Inventario Vacío
            </span>
          </h1>
          
          <div className='bg-[#111318]/60 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 shadow-2xl shadow-black/30 mb-6'>
            <p className='text-xl text-gray-300 mb-4'>
              Tu espacio de inventario está esperando ser llenado
            </p>
            <p className='text-gray-400'>
              No hay productos o registros para mostrar. Comienza creando tu primer 
              producto para organizar y gestionar tu inventario de manera profesional.
            </p>
          </div>
        </div>

        {/* Estadísticas decorativas */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl'>
          {[
            { label: 'Productos', value: '0', color: 'text-amber-400' },
            { label: 'Categorías', value: '0', color: 'text-blue-400' },
            { label: 'En Stock', value: '0', color: 'text-emerald-400' },
            { label: 'Espacio', value: '100%', color: 'text-purple-400' }
          ].map((stat, index) => (
            <div
              key={index}
              className='bg-[#111318]/40 border border-gray-800/30 rounded-lg p-4 text-center backdrop-blur-sm'
            >
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className='text-gray-400 text-sm mt-1'>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Botones de acción */}
        <div className='flex flex-col sm:flex-row gap-4 mb-12'>
          <Button
            onPress={() => navigate('/crear/producto')}
            className={`
              px-8 py-6
              bg-gradient-to-r from-amber-600 to-amber-700
              hover:from-amber-700 hover:to-amber-800
              text-gray-900 font-bold text-lg
              rounded-xl
              shadow-2xl shadow-amber-500/30
              transform hover:scale-105 hover:shadow-amber-500/50
              transition-all duration-300
              min-w-[200px]
              group
            `}
          >
            <span className='flex items-center justify-center'>
              <svg 
                className='w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300' 
                fill='none' 
                viewBox='0 0 24 24' 
                stroke='currentColor'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
              </svg>
              Crear Primer Producto
            </span>
          </Button>

          <Button
            onPress={() => navigate('/')}
            className={`
              px-8 py-6
              bg-[#111318] hover:bg-gray-800/60
              text-gray-300 font-semibold text-lg
              border border-gray-800
              hover:border-amber-500/40
              rounded-xl
              shadow-lg shadow-black/20
              transform hover:scale-105
              transition-all duration-300
              min-w-[200px]
            `}
          >
            Volver al Dashboard
          </Button>
        </div>

        {/* Tips de inicio */}
        <div className='max-w-2xl text-center'>
          <p className='text-gray-400 text-sm mb-4'>
            💡 <span className='text-amber-400'>Consejo:</span> Organiza tus productos por categorías desde el inicio
          </p>
          <div className='flex items-center justify-center space-x-2 text-gray-500 text-sm'>
            <div className='w-2 h-2 bg-amber-400/60 rounded-full animate-pulse'></div>
            <span>Preparado para recibir tu inventario</span>
            <div className='w-2 h-2 bg-emerald-400/60 rounded-full animate-pulse delay-300'></div>
          </div>
        </div>
      </div>

      {/* Estilos CSS adicionales */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Scrollbar personalizado */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(17, 19, 24, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.3);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.5);
        }
      `}</style>
    </div>
  );
}
