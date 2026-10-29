import { useState } from 'react';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#ece3d1"/><path d="M150 250c0-60 40-90 100-96 0 56-30 100-90 100z" fill="#2d6a4f" opacity=".5"/></svg>',
  );

/** Image with lazy loading by default, intrinsic dimensions (no layout shift) and a graceful fallback. */
export default function SmartImage({ src, alt, width = 800, height = 800, eager = false, className = '', ...rest }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed ? PLACEHOLDER : src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      fetchpriority={eager ? 'high' : undefined}
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
