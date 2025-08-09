import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, X, Volume2, VolumeX, SkipBack, SkipForward, Download, Move } from 'lucide-react';
import { AudioSlider } from '../ui/audio-slider';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

export const FloatingAudioPlayer: React.FC = () => {
  const { currentTrack, isPlaying, isVisible, audioRef, pauseTrack, resumeTrack, closePlayer } = useAudioPlayer();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  // Estados para el drag and drop
  const [position, setPosition] = useState({ x: 24, y: 24 }); // bottom-6 right-6 equivale a 24px
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const playerRef = useRef<HTMLDivElement>(null);

  // Estados para el redimensionado
  const [size, setSize] = useState({ width: 320, height: 180 }); // Tamaño inicial más específico
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 320, height: 180 });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Cargar nueva pista
    audio.src = currentTrack.url;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (isPlaying) {
        audio.play();
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Mostrar indicador cuando falten los últimos 3 segundos
      const timeRemaining = audio.duration - audio.currentTime;
      if (timeRemaining <= 3 && timeRemaining > 0 && !isEnding) {
        setIsEnding(true);
      } else if (timeRemaining > 3 && isEnding) {
        setIsEnding(false);
      }
    };

    const handleEnded = () => {
      pauseTrack();
      setCurrentTime(0);
      // Cerrar el reproductor automáticamente cuando termine la canción
      setTimeout(() => {
        closePlayer();
      }, 1000); // Esperar 1 segundo antes de cerrar para dar feedback visual
    };

    const handleError = () => {
      console.error('Error loading audio file');
      // También cerrar en caso de error
      setTimeout(() => {
        closePlayer();
      }, 2000);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack, isPlaying, audioRef, pauseTrack, closePlayer, isEnding]);

  // Actualizar volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadAudio = () => {
    if (currentTrack) {
      const link = document.createElement('a');
      link.href = currentTrack.url;
      link.download = `${currentTrack.title}.mp3`;
      link.click();
    }
  };

  // Funciones para drag and drop optimizadas (mouse y touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!playerRef.current) return;
    
    e.preventDefault();
    const rect = playerRef.current.getBoundingClientRect();
    
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
    
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!playerRef.current || e.touches.length !== 1) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const rect = playerRef.current.getBoundingClientRect();
    
    setDragStart({
      x: touch.clientX,
      y: touch.clientY
    });
    
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    
    setIsDragging(true);
  };

  // Funciones para redimensionado
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!playerRef.current) return;
    
    const rect = playerRef.current.getBoundingClientRect();
    
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height
    });
    
    setResizeDirection(direction);
    setIsResizing(true);
  };

  const handleResizeTouchStart = (e: React.TouchEvent, direction: string) => {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    e.stopPropagation();
    
    if (!playerRef.current) return;
    
    const touch = e.touches[0];
    const rect = playerRef.current.getBoundingClientRect();
    
    setResizeStart({
      x: touch.clientX,
      y: touch.clientY,
      width: rect.width,
      height: rect.height
    });
    
    setResizeDirection(direction);
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      if (isDragging) {
        updatePosition(e.clientX, e.clientY);
      } else if (isResizing) {
        updateSize(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      
      if (isDragging) {
        updatePosition(touch.clientX, touch.clientY);
      } else if (isResizing) {
        updateSize(touch.clientX, touch.clientY);
      }
    };

    const updatePosition = (clientX: number, clientY: number) => {
      const newX = clientX - dragOffset.x;
      const newY = clientY - dragOffset.y;

      // Límites de la pantalla con un pequeño margen
      const margin = 10;
      const maxX = window.innerWidth - (typeof size.width === 'number' ? size.width : 320) - margin;
      const maxY = window.innerHeight - (playerRef.current?.offsetHeight || 100) - margin;

      const clampedX = Math.max(margin, Math.min(newX, maxX));
      const clampedY = Math.max(margin, Math.min(newY, maxY));

      requestAnimationFrame(() => {
        setPosition({
          x: clampedX,
          y: clampedY
        });
      });
    };

    const updateSize = (clientX: number, clientY: number) => {
      const deltaX = clientX - resizeStart.x;
      const deltaY = clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      
      // Tamaños mínimos y máximos
      const minWidth = 250;
      const maxWidth = Math.min(600, window.innerWidth - 40);
      const minHeight = isMinimized ? 64 : 140;
      const maxHeight = Math.min(400, window.innerHeight - 40);

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.width + deltaX));
      }
      if (resizeDirection.includes('left')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.width - deltaX));
        // Ajustar posición si redimensiona desde la izquierda
        if (newWidth !== size.width) {
          setPosition(prev => ({
            ...prev,
            x: Math.max(10, prev.x - (newWidth - (typeof size.width === 'number' ? size.width : 320)))
          }));
        }
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.height + deltaY));
      }
      if (resizeDirection.includes('top')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.height - deltaY));
        // Ajustar posición si redimensiona desde arriba
        if (newHeight !== size.height) {
          setPosition(prev => ({
            ...prev,
            y: Math.max(10, prev.y - (newHeight - (typeof size.height === 'number' ? size.height : 100)))
          }));
        }
      }

      requestAnimationFrame(() => {
        setSize({
          width: newWidth,
          height: newHeight
        });
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    // Agregar listeners tanto para mouse como para touch
    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Prevenir selección de texto mientras se arrastra o redimensiona
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.touchAction = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.touchAction = '';
    };
  }, [isDragging, isResizing, dragOffset, dragStart, resizeDirection, resizeStart, size, isMinimized]);

  // Reposicionar si la ventana cambia de tamaño
  useEffect(() => {
    const handleResize = () => {
      if (!playerRef.current) return;
      
      const margin = 10;
      const maxX = window.innerWidth - playerRef.current.offsetWidth - margin;
      const maxY = window.innerHeight - playerRef.current.offsetHeight - margin;
      
      setPosition(prev => ({
        x: Math.max(margin, Math.min(prev.x, maxX)),
        y: Math.max(margin, Math.min(prev.y, maxY))
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isVisible || !currentTrack) return null;

  return (
    <>
      <audio ref={audioRef} />
      <div 
        ref={playerRef}
        className={`fixed bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl transition-all duration-200 ${
          isDragging ? 'cursor-grabbing shadow-2xl scale-105' : 
          isResizing ? 'cursor-nw-resize shadow-2xl border-blue-300' : 'cursor-grab'
        } select-none ${
          isEnding ? 'animate-pulse border-red-300 bg-red-50/95' : ''
        } overflow-hidden`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: isMinimized ? '64px' : `${size.height}px`,
          minWidth: '250px',
          maxWidth: '600px',
          minHeight: isMinimized ? '64px' : '140px',
          maxHeight: '400px',
          zIndex: 9999,
          transform: isDragging ? 'rotate(2deg)' : 'rotate(0deg)',
          transition: (isDragging || isResizing) ? 'none' : 'all 0.2s ease-out'
        }}
      >
        {/* Controles de redimensionado */}
        {!isMinimized && (
          <>
            {/* Esquina inferior derecha */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-gradient-to-tl from-blue-500/20 to-transparent hover:from-blue-500/40 transition-colors"
              onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'bottom-right')}
              style={{ clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)' }}
            />
            
            {/* Borde derecho */}
            <div
              className="absolute right-0 top-4 bottom-4 w-2 cursor-col-resize hover:bg-blue-500/20 transition-colors"
              onMouseDown={(e) => handleResizeStart(e, 'right')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'right')}
            />
            
            {/* Borde inferior */}
            <div
              className="absolute bottom-0 left-4 right-4 h-2 cursor-row-resize hover:bg-blue-500/20 transition-colors"
              onMouseDown={(e) => handleResizeStart(e, 'bottom')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'bottom')}
            />
          </>
        )}
        {/* Header arrastrrable */}
        <div 
          className={`flex items-center p-3 transition-colors duration-200 ${
            isDragging ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'
          } cursor-grab active:cursor-grabbing rounded-t-xl touch-none`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Imagen solo si hay espacio suficiente */}
          {currentTrack.thumbnail && size.width > 280 && (
            <img 
              src={currentTrack.thumbnail} 
              alt={currentTrack.title}
              className="w-8 h-8 rounded-md object-cover flex-shrink-0 pointer-events-none"
            />
          )}
          <div className={`flex-1 min-w-0 pointer-events-none ${
            currentTrack.thumbnail && size.width > 280 ? 'mx-3' : 'mr-3'
          }`}>
            <h4 className={`font-medium text-gray-900 truncate ${
              size.width > 300 ? 'text-sm' : 'text-xs'
            }`}>{currentTrack.title}</h4>
            
            {/* Descripción solo si no está minimizado y hay espacio */}
            {!isMinimized && currentTrack.description && size.height > 120 && (
              <p className="text-xs text-gray-500 truncate">{currentTrack.description}</p>
            )}
            
            {/* Indicador de finalización */}
            {isEnding && (
              <p className="text-xs text-red-600 font-medium animate-pulse">
                Finalizando...
              </p>
            )}
          </div>

          <div className="flex items-center space-x-1 flex-shrink-0">
            {/* Indicador de que es arrastrable - más visible */}
            {/* Indicador de arrastre - se oculta en tamaños pequeños */}
            {size.width > 300 && (
              <div className={`text-gray-400 mr-2 transition-colors ${isDragging ? 'text-blue-500' : ''}`}>
                <Move className="h-4 w-4" />
              </div>
            )}
            
            {/* Controles de audio - se adaptan al tamaño */}
            {size.width > 280 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); skipBackward(); }}
                className={`p-0 ${size.width > 320 ? 'h-8 w-8' : 'h-6 w-6'}`}
              >
                <SkipBack className={size.width > 320 ? 'h-3 w-3' : 'h-2.5 w-2.5'} />
              </Button>
            )}
            
            {/* Botón principal - siempre visible */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { 
                e.stopPropagation(); 
                if (isPlaying) {
                  pauseTrack();
                } else {
                  resumeTrack();
                }
              }}
              className={`p-0 bg-blue-500 hover:bg-blue-600 text-white ${
                size.width > 320 ? 'h-8 w-8' : 'h-7 w-7'
              }`}
            >
              {isPlaying ? 
                <Pause className={size.width > 320 ? 'h-3 w-3' : 'h-2.5 w-2.5'} /> : 
                <Play className={size.width > 320 ? 'h-3 w-3' : 'h-2.5 w-2.5'} />
              }
            </Button>
            
            {/* Skip forward - se oculta en tamaños pequeños */}
            {size.width > 280 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); skipForward(); }}
                className={`p-0 ${size.width > 320 ? 'h-8 w-8' : 'h-6 w-6'}`}
              >
                <SkipForward className={size.width > 320 ? 'h-3 w-3' : 'h-2.5 w-2.5'} />
              </Button>
            )}

            {/* Minimizar - siempre visible */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
              className={`p-0 ml-1 ${size.width > 320 ? 'h-8 w-8' : 'h-6 w-6'}`}
            >
              <div className={`transition-transform ${size.width > 320 ? 'text-xs' : 'text-xs'} ${isMinimized ? 'rotate-180' : ''}`}>
                ▲
              </div>
            </Button>

            {/* Cerrar - siempre visible */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); closePlayer(); }}
              className={`p-0 hover:bg-red-100 hover:text-red-600 ${size.width > 320 ? 'h-8 w-8' : 'h-6 w-6'}`}
            >
              <X className={size.width > 320 ? 'h-3 w-3' : 'h-2.5 w-2.5'} />
            </Button>
          </div>
        </div>

        {/* Expanded Controls */}
        {!isMinimized && (
          <div 
            className="pointer-events-auto flex-grow overflow-hidden"
            style={{ 
              padding: size.width > 300 ? '16px' : '12px',
              paddingTop: size.height > 160 ? '8px' : '4px'
            }}
          >
            {/* Progress Bar - siempre visible cuando expandido */}
            <div className="space-y-2 mb-3">
              <AudioSlider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className={`flex justify-between text-gray-500 ${
                size.width > 300 ? 'text-xs' : 'text-[10px]'
              }`}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controles de volumen y descarga - se adaptan al espacio */}
            {size.height > 140 && (
              <div className="flex items-center justify-between gap-2">
                <div className={`flex items-center space-x-2 ${
                  size.width < 300 ? 'flex-1 max-w-16' : size.width < 350 ? 'flex-1 max-w-24' : 'flex-1 max-w-32'
                }`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className={`p-0 flex-shrink-0 ${
                      size.width > 300 ? 'h-6 w-6' : 'h-5 w-5'
                    }`}
                  >
                    {isMuted || volume === 0 ? 
                      <VolumeX className={size.width > 300 ? 'h-3 w-3' : 'h-2.5 w-2.5'} /> : 
                      <Volume2 className={size.width > 300 ? 'h-3 w-3' : 'h-2.5 w-2.5'} />
                    }
                  </Button>
                  
                  {/* Slider de volumen solo si hay espacio suficiente */}
                  {size.width > 280 && (
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="flex-1"
                    />
                  )}
                </div>

                {/* Botón de descarga - se oculta en tamaños muy pequeños */}
                {size.width > 270 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadAudio}
                    className={`p-0 flex-shrink-0 ${
                      size.width > 300 ? 'h-6 w-6' : 'h-5 w-5'
                    }`}
                  >
                    <Download className={size.width > 300 ? 'h-3 w-3' : 'h-2.5 w-2.5'} />
                  </Button>
                )}
              </div>
            )}

            {/* Información adicional solo si hay mucho espacio */}
            {size.width > 350 && size.height > 180 && currentTrack.description && (
              <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed mt-3">
                {currentTrack.description}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
