import React, { useEffect, useState } from 'react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  /** ms entre imágenes; se pausa mientras el mouse está encima. */
  autoPlayMs?: number;
  className?: string;
}

/**
 * Galería/slider de imágenes de un producto — usado en la tarjeta del
 * catálogo y en el detalle. Con 0 o 1 imagen no muestra ningún control
 * (nada de dots/flechas para algo que no tiene a dónde navegar).
 */
const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt, autoPlayMs = 4000, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [images.length, paused, autoPlayMs]);

  // Si cambia la lista de imágenes (otro producto), arrancar desde la primera.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset al cambiar de producto, sin loop
    setActiveIndex(0);
  }, [images]);

  if (images.length === 0) {
    return <div className={`bg-neutral-200 ${className ?? ''}`} aria-hidden="true" />;
  }

  return (
    <div
      className={`relative overflow-hidden bg-neutral-200 ${className ?? ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={index === 0 ? alt : `${alt} — foto ${index + 1}`}
          loading={index === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveIndex(index);
              }}
              aria-label={`Ver foto ${index + 1}`}
              className="grid h-5 w-5 place-items-center"
            >
              <span
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
