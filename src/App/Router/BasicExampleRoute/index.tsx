import React, { useRef, CSSProperties } from 'react';
import cn from 'classnames';

import styles from './styles.module.css';
import reactLogo from '../logo.svg';

import { useInteractiveTransform } from '../../../useInteractiveTransform';

export function BasicExampleRoute() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const {
    handlers,
    transformStyle,
  } = useInteractiveTransform({
    container: containerRef.current,
    element: imgRef.current,
  });

  const imgStyle = {
    transform: transformStyle,
  } as CSSProperties;

  return (
    <div className={styles.page}>
      <h2>Basic Example</h2>
      <p>Scroll to zoom. Click and drag to pan.</p>

      <div className={styles.container} ref={containerRef} {...handlers}>
        <img
          alt="react-logo-svg"
          className={cn(styles.img, styles.undraggable)}
          ref={imgRef}
          src={reactLogo}
          style={imgStyle}
        />
      </div>
    </div>
  );
}
