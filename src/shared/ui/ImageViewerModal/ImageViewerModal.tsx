import { useState, useEffect, type MouseEvent } from "react";

import { createPortal } from "react-dom";

interface ImageViewerModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export const ImageViewerModal = ({
  images,
  initialIndex,
  onClose,
}: ImageViewerModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const portalRoot = document.getElementById("modal-portal");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!portalRoot) return null;

  const handlePrev = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return createPortal(
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-6 right-6 text-white text-3xl p-2 cursor-pointer"
        onClick={onClose}
      >
        ✕
      </button>

      {images.length > 1 && (
        <button
          type="button"
          className="absolute left-6 text-white text-4xl w-14 h-14 flex items-center justify-center bg-black/40 rounded-full hover:bg-black/60 transition cursor-pointer"
          onClick={handlePrev}
        >
          ‹
        </button>
      )}

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <img
        src={images[currentIndex]}
        alt={`post-fullscreen-img-${currentIndex}`}
        className="max-w-[90vw] max-h-[90vh] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <button
          type="button"
          className="absolute right-6 text-white text-4xl w-14 h-14 flex items-center justify-center bg-black/40 rounded-full hover:bg-black/60 transition cursor-pointer"
          onClick={handleNext}
        >
          ›
        </button>
      )}

      <div className="absolute bottom-10 text-white text-subtitle-02">
        {currentIndex + 1} / {images.length}
      </div>
    </div>,
    portalRoot,
  );
};
