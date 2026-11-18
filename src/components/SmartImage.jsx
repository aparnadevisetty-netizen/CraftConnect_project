import { useState } from 'react';
import StoneArt from './StoneArt.jsx';

/**
 * Shows a real photograph when one exists (URL or uploaded data URL) and falls back to the built-in stone illustration.
 * Photos are lazy-loaded and decoded off the main thread to keep slow connections usable.
 */
export default function SmartImage({ photo, art, tone, alt = '', view = 'full', className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  if (photo && !failed) {
    return (
      <img
        src={photo}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return <StoneArt art={art} tone={tone} view={view} title={alt} className={className} />;
}
