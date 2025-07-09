import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjEyMTIxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [webpFailed, setWebpFailed] = useState(false);

  // Generate WebP version of the image URL
  const getWebPUrl = (originalSrc) => {
    if (typeof originalSrc !== 'string') return originalSrc;
    return originalSrc.replace(/\.(jpg|jpeg|png)(\?.*)?$/i, '.webp$2');
  };

  // Check if browser supports WebP
  const supportsWebP = () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  useEffect(() => {
    let observer;
    
    if (imageRef && imageSrc === placeholder) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsInView(true);
              // Try WebP first if supported and not already failed
              const shouldTryWebP = supportsWebP() && !webpFailed && src.match(/\.(jpg|jpeg|png)$/i);
              const imageToLoad = shouldTryWebP ? getWebPUrl(src) : src;
              setImageSrc(imageToLoad);
              observer.unobserve(imageRef);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );
      observer.observe(imageRef);
    }
    
    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, imageSrc, placeholder, src, webpFailed]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // If WebP fails, try original format
    if (!webpFailed && imageSrc.endsWith('.webp')) {
      setWebpFailed(true);
      setImageSrc(src);
    } else {
      // If original also fails, show placeholder
      setImageSrc(placeholder);
    }
  };

  return (
    <div 
      ref={setImageRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: '#212121' }}
    >
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded && imageSrc !== placeholder ? 'opacity-100' : 'opacity-75'
        }`}
        loading="lazy"
        decoding="async"
        {...props}
      />
      
      {/* Loading overlay */}
      {!isLoaded && imageSrc === src && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/50">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage; 