



import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductGallery({ images, alt }: {images: string[];alt: string;}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: (e.clientX - rect.left) / rect.width * 100,
      y: (e.clientY - rect.top) / rect.height * 100
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-white">
        
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full w-full object-cover transition-transform duration-200"
            style={
            zoom ?
            { transform: 'scale(2)', transformOrigin: `${pos.x}% ${pos.y}%` } :
            undefined
            } />
          
        </AnimatePresence>
      </div>

      {images.length > 1 &&
      <div className="flex gap-2.5">
          {images.map((img, i) =>
        <button
          key={i}
          type="button"
          onClick={() => setActive(i)}
          aria-label={`View image ${i + 1}`}
          className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
          i === active ? 'border-primary' : 'border-border hover:border-primary-200'}`
          }>
          
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
        )}
        </div>
      }
    </div>);

}